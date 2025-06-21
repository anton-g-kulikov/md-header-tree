/**
 * Tree rendering utilities
 */

import { TreeNode, ExtensionConfig } from "./types";
import { MarkdownParser } from "./markdownParser";
import { Logger } from "./logger";

export class TreeRenderer {
  static renderTree(
    node: TreeNode,
    config: ExtensionConfig,
    prefix = "",
    isLast = true
  ): string {
    try {
      return node.children
        .map((child: TreeNode, idx: number) => {
          const isLastChild = idx === node.children.length - 1;
          const linePrefix =
            prefix +
            (prefix
              ? isLast
                ? config.treeSymbols.space
                : config.treeSymbols.vertical + " "
              : "") +
            (isLastChild
              ? config.treeSymbols.last + " "
              : config.treeSymbols.branch + " ");

          // Extract type icon for numbered lists
          let typeIcon = "";
          let displayText = child.text;

          if (child.type === "numbered-list") {
            const numberMatch = child.text.match(/^(\d+\.)\s*(.*)/);
            if (numberMatch) {
              typeIcon = numberMatch[1] + " ";
              displayText = numberMatch[2];
            }
          }

          // Format the text content
          let formattedText: string;

          if (child.type === "code-block") {
            // For code blocks, render as preformatted text without markdown parsing
            const language = child.metadata?.language || "";
            formattedText = `<pre><code class="${language}">${this.escapeHtml(
              child.text
            )}</code></pre>`;
          } else {
            formattedText = MarkdownParser.parseMarkdownFormatting(
              typeIcon + displayText
            );
          }
          const textStartPosition = linePrefix.length;

          const currentLine = `<div class='tree-line' style='text-indent: -${textStartPosition}ch; padding-left: ${textStartPosition}ch;'>${linePrefix}<span class='tree-content ${child.type}'>${formattedText}</span></div>`;

          const childrenHtml = this.renderTree(
            child,
            config,
            prefix +
              (isLast
                ? config.treeSymbols.space
                : config.treeSymbols.vertical + " "),
            isLastChild
          );

          return currentLine + childrenHtml;
        })
        .join("");
    } catch (error) {
      Logger.error("Error rendering tree", error as Error, {
        nodeType: node.type,
        childrenCount: node.children.length,
      });
      return '<div class="error-message">Error rendering tree structure</div>';
    }
  }

  static renderEmpty(): string {
    return '<div class="empty-state">No headers, lists, or content found in this Markdown file.</div>';
  }

  static renderError(message: string): string {
    return `<div class="error-message">Error: ${message}</div>`;
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
}
