/**
 * Markdown parsing utilities
 */

import { MarkdownElement, TreeNode, ParseOptions } from "./types";
import { Logger } from "./logger";

export class MarkdownParser {
  private static readonly DEFAULT_OPTIONS: ParseOptions = {
    includeHeaders: true,
    includeLists: true,
    includeParagraphs: true,
    maxDepth: undefined,
  };

  static parseMarkdownFormatting(text: string): string {
    try {
      // Handle reference-style links first
      // Find all reference definitions and store them
      const linkRefs: { [key: string]: string } = {};
      text = text.replace(
        /^\s*\[([^\]]+)\]:\s*(.+)$/gm,
        (match, label, url) => {
          linkRefs[label.toLowerCase()] = url.trim();
          return ""; // Remove the reference definition from text
        }
      );

      // Create a temporary placeholder system to preserve link HTML
      const linkPlaceholders: string[] = [];

      // Convert reference-style links [text][ref] to placeholder
      text = text.replace(
        /\[([^\]]*)\]\[([^\]]+)\]/g,
        (match, linkText, refLabel) => {
          const url = linkRefs[refLabel.toLowerCase()];
          if (url) {
            // Process formatting in link text first, then escape URL
            const formattedText = this.processInlineFormatting(linkText);
            const escapedUrl = this.escapeHtml(url);
            const linkHtml = `<a href="${escapedUrl}">${formattedText}</a>`;
            linkPlaceholders.push(linkHtml);
            return `LINKPLACEHOLDER${
              linkPlaceholders.length - 1
            }LINKPLACEHOLDER`;
          }
          return match; // Return original if reference not found
        }
      );

      // Convert inline links [text](url) to placeholder
      // Handle URLs with balanced parentheses
      const processInlineLinks = (text: string): string => {
        let result = '';
        let i = 0;
        
        while (i < text.length) {
          // Look for link text pattern [...]
          const linkTextStart = text.indexOf('[', i);
          if (linkTextStart === -1) {
            result += text.slice(i);
            break;
          }
          
          // Add text before the link
          result += text.slice(i, linkTextStart);
          
          // Find the closing bracket for link text
          let linkTextEnd = linkTextStart + 1;
          let bracketCount = 1;
          while (linkTextEnd < text.length && bracketCount > 0) {
            if (text[linkTextEnd] === '[') {
              bracketCount++;
            } else if (text[linkTextEnd] === ']') {
              bracketCount--;
            }
            linkTextEnd++;
          }
          
          if (bracketCount > 0 || linkTextEnd >= text.length || text[linkTextEnd] !== '(') {
            // Not a valid link, continue searching
            result += text[linkTextStart];
            i = linkTextStart + 1;
            continue;
          }
          
          // Extract link text (without brackets)
          const linkText = text.slice(linkTextStart + 1, linkTextEnd - 1);
          
          // Find the closing parenthesis for URL, handling balanced parentheses
          let urlStart = linkTextEnd + 1;
          let urlEnd = urlStart;
          let parenCount = 1;
          while (urlEnd < text.length && parenCount > 0) {
            if (text[urlEnd] === '(') {
              parenCount++;
            } else if (text[urlEnd] === ')') {
              parenCount--;
            }
            urlEnd++;
          }
          
          if (parenCount > 0) {
            // No matching closing parenthesis, not a valid link
            result += text[linkTextStart];
            i = linkTextStart + 1;
            continue;
          }
          
          // Extract URL (without parentheses)
          const url = text.slice(urlStart, urlEnd - 1);
          
          // Process formatting in link text first, then escape URL
          const formattedText = this.processInlineFormatting(linkText);
          const escapedUrl = this.escapeHtml(url);
          const linkHtml = `<a href="${escapedUrl}">${formattedText}</a>`;
          linkPlaceholders.push(linkHtml);
          result += `LINKPLACEHOLDER${linkPlaceholders.length - 1}LINKPLACEHOLDER`;
          
          i = urlEnd;
        }
        
        return result;
      };
      
      text = processInlineLinks(text);

      // Escape HTML to prevent XSS (for remaining text)
      text = text.replace(/[&<>"']/g, (match) => {
        const htmlEscapes: { [key: string]: string } = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        };
        return htmlEscapes[match];
      });

      // Convert **bold** and __bold__ to <strong>
      text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      text = text.replace(/__(.*?)__/g, "<strong>$1</strong>");

      // Convert *italic* and _italic_ to <em>
      text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
      text = text.replace(/_(.*?)_/g, "<em>$1</em>");

      // Convert `code` to <code>
      text = text.replace(/`(.*?)`/g, "<code>$1</code>");

      // Restore link placeholders with actual HTML
      text = text.replace(
        /LINKPLACEHOLDER(\d+)LINKPLACEHOLDER/g,
        (match, index) => {
          return linkPlaceholders[parseInt(index)] || match;
        }
      );

      return text;
    } catch (error) {
      Logger.error("Error parsing markdown formatting", error as Error, {
        text,
      });
      return text; // Return original text if parsing fails
    }
  }

  static parseDocument(
    mdText: string,
    options: Partial<ParseOptions> = {}
  ): MarkdownElement[] {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    const lines = mdText.split(/\r?\n/);
    const elements: MarkdownElement[] = [];
    let currentHeaderLevel = 0;
    let inCodeBlock = false;
    let codeBlockFence = "";

    let codeBlockContent: string[] = [];
    let codeBlockLanguage = "";
    let codeBlockStartLine = 0;

    try {
      for (let i = 0; i < lines.length; i++) {
        const originalLine = lines[i];
        const line = originalLine.trim();
        const lineNumber = i + 1;

        // Handle fenced code blocks (``` or ~~~)
        const fenceMatch = line.match(/^(```|~~~)(.*)$/);
        if (fenceMatch) {
          if (!inCodeBlock) {
            // Starting a code block
            inCodeBlock = true;
            codeBlockFence = fenceMatch[1];
            codeBlockLanguage = fenceMatch[2].trim();
            codeBlockContent = [];
            codeBlockStartLine = lineNumber;
          } else if (fenceMatch[1] === codeBlockFence) {
            // Ending the code block - add it as an element
            inCodeBlock = false;
            const level = currentHeaderLevel > 0 ? currentHeaderLevel + 1 : 1;
            if (!opts.maxDepth || level <= opts.maxDepth) {
              elements.push({
                level,
                text: codeBlockContent.join("\n"),
                type: "code-block",
                lineNumber: codeBlockStartLine,
                metadata: { language: codeBlockLanguage },
              });
            }
            codeBlockFence = "";
            codeBlockLanguage = "";
            codeBlockContent = [];
          }
          continue; // Skip fence lines
        }

        // Collect lines inside fenced code blocks
        if (inCodeBlock) {
          codeBlockContent.push(originalLine);
          continue;
        }

        // Handle indented code blocks (4+ spaces or 1+ tabs at start of line)
        if (originalLine.match(/^    /) || originalLine.match(/^\t/)) {
          // This is an indented line - collect all consecutive indented lines as a code block
          const indentedCodeLines = [
            originalLine.substring(originalLine.match(/^\t/) ? 1 : 4),
          ];
          let j = i + 1;

          // Collect consecutive indented lines (or blank lines)
          while (j < lines.length) {
            const nextLine = lines[j];
            if (nextLine.match(/^    /) || nextLine.match(/^\t/)) {
              indentedCodeLines.push(
                nextLine.substring(nextLine.match(/^\t/) ? 1 : 4)
              );
              j++;
            } else if (nextLine.trim() === "") {
              // Allow empty lines in code blocks
              indentedCodeLines.push("");
              j++;
            } else {
              break;
            }
          }

          // Add the indented code block as an element
          const level = currentHeaderLevel > 0 ? currentHeaderLevel + 1 : 1;
          if (!opts.maxDepth || level <= opts.maxDepth) {
            elements.push({
              level,
              text: indentedCodeLines.join("\n"),
              type: "code-block",
              lineNumber,
              metadata: { language: "" },
            });
          }

          i = j - 1; // Skip the processed lines
          continue;
        }

        // Skip empty lines
        if (!line) {
          continue;
        }

        // Check for headers
        if (opts.includeHeaders) {
          const headerMatch = line.match(/^(#+)\s+(.*)/);
          if (headerMatch) {
            const level = headerMatch[1].length;
            if (!opts.maxDepth || level <= opts.maxDepth) {
              currentHeaderLevel = level;
              elements.push({
                level: currentHeaderLevel,
                text: headerMatch[2],
                type: "header",
                lineNumber,
              });
              continue;
            }
          }
        }

        // Check for list items
        if (opts.includeLists) {
          const listMatch = line.match(/^(\s*)[-*+]\s+(.*)/);
          if (listMatch) {
            const indentLevel = Math.floor(listMatch[1].length / 2);
            const level = currentHeaderLevel + 1 + indentLevel;
            if (!opts.maxDepth || level <= opts.maxDepth) {
              elements.push({
                level,
                text: listMatch[2],
                type: "list",
                lineNumber,
              });
              continue;
            }
          }

          // Check for numbered lists
          const numberedListMatch = line.match(/^(\s*)(\d+\.\s+)(.*)/);
          if (numberedListMatch) {
            const indentLevel = Math.floor(numberedListMatch[1].length / 2);
            const level = currentHeaderLevel + 1 + indentLevel;
            if (!opts.maxDepth || level <= opts.maxDepth) {
              elements.push({
                level,
                text: numberedListMatch[2] + numberedListMatch[3],
                type: "numbered-list",
                lineNumber,
              });
              continue;
            }
          }
        }

        // Regular paragraphs (if we have a current header context)
        if (opts.includeParagraphs && currentHeaderLevel > 0) {
          const level = currentHeaderLevel + 1;
          if (!opts.maxDepth || level <= opts.maxDepth) {
            elements.push({
              level,
              text: line,
              type: "paragraph",
              lineNumber,
            });
          }
        }
      }

      Logger.info(
        `Parsed ${elements.length} elements from ${lines.length} lines`
      );
      return elements;
    } catch (error) {
      Logger.error("Error parsing markdown document", error as Error, {
        mdText: mdText.substring(0, 100),
      });
      return [];
    }
  }

  static buildTree(elements: MarkdownElement[]): TreeNode {
    const root: TreeNode = {
      level: 0,
      text: "",
      type: "header",
      children: [],
    };

    const stack: { node: TreeNode; level: number }[] = [
      { node: root, level: 0 },
    ];

    try {
      for (const element of elements) {
        while (stack.length && element.level <= stack[stack.length - 1].level) {
          stack.pop();
        }

        const node: TreeNode = {
          ...element,
          children: [],
        };

        if (stack.length > 0) {
          stack[stack.length - 1].node.children.push(node);
          stack.push({ node, level: element.level });
        }
      }

      Logger.info(`Built tree with ${this.countNodes(root)} total nodes`);
      return root;
    } catch (error) {
      Logger.error("Error building tree structure", error as Error, {
        elementCount: elements.length,
      });
      return root;
    }
  }

  private static countNodes(node: TreeNode): number {
    return (
      1 +
      node.children.reduce((count, child) => count + this.countNodes(child), 0)
    );
  }

  private static escapeHtml(text: string): string {
    return text.replace(/[&<>"']/g, (match) => {
      const htmlEscapes: { [key: string]: string } = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return htmlEscapes[match];
    });
  }

  private static processInlineFormatting(text: string): string {
    // Escape HTML first
    text = this.escapeHtml(text);

    // Convert **bold** and __bold__ to <strong>
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/__(.*?)__/g, "<strong>$1</strong>");

    // Convert *italic* and _italic_ to <em>
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
    text = text.replace(/_(.*?)_/g, "<em>$1</em>");

    // Convert `code` to <code>
    text = text.replace(/`(.*?)`/g, "<code>$1</code>");

    return text;
  }
}
