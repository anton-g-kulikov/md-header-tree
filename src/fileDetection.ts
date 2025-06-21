/**
 * File detection utilities for Markdown files
 */

import * as vscode from "vscode";
import * as path from "path";

/**
 * Common Markdown file extensions
 */
const MARKDOWN_EXTENSIONS = [
  ".md",
  ".markdown",
  ".mdown",
  ".mkd",
  ".mdwn",
  ".mdtxt",
  ".mdtext",
  ".text",
];

/**
 * Check if a file is likely a Markdown file based on extension and content
 *
 * @param document - The VS Code text document to analyze
 * @returns True if the file is recognized as a Markdown file, false otherwise
 *
 * @example
 * ```typescript
 * const editor = vscode.window.activeTextEditor;
 * if (editor && isMarkdownFile(editor.document)) {
 *   // Handle Markdown file
 * }
 * ```
 */
export function isMarkdownFile(document: vscode.TextDocument): boolean {
  // First check language ID (most reliable)
  if (document.languageId === "markdown") {
    return true;
  }

  // Check file extension
  const ext = path.extname(document.fileName).toLowerCase();
  if (MARKDOWN_EXTENSIONS.includes(ext)) {
    return true;
  }

  // Check for files without extension but with Markdown-like content
  if (!ext || ext === ".txt") {
    return hasMarkdownContent(document);
  }

  return false;
}

/**
 * Check if file content looks like Markdown by analyzing common patterns
 *
 * @param document - The VS Code text document to analyze
 * @returns True if the content contains sufficient Markdown indicators, false otherwise
 *
 * @internal This function analyzes the first 50 lines for Markdown patterns:
 * - Headers (# ## ###)
 * - Lists (- * + or numbered)
 * - Code blocks (```)
 * - Links ([text](url))
 * - Emphasis (**bold** *italic*)
 */
function hasMarkdownContent(document: vscode.TextDocument): boolean {
  const content = document.getText();
  const lines = content.split("\n").slice(0, 50); // Check first 50 lines

  let markdownIndicators = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    // Check for headers
    if (/^#{1,6}\s/.test(trimmed)) {
      markdownIndicators += 2;
    }

    // Check for lists
    if (/^[-*+]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)) {
      markdownIndicators++;
    }

    // Check for code blocks
    if (/^```/.test(trimmed)) {
      markdownIndicators += 2;
    }

    // Check for links
    if (/\[.*\]\(.*\)/.test(trimmed)) {
      markdownIndicators++;
    }

    // Check for emphasis
    if (
      /\*\*.*\*\*/.test(trimmed) ||
      /__.*__/.test(trimmed) ||
      /\*.*\*/.test(trimmed) ||
      /_.*_/.test(trimmed)
    ) {
      markdownIndicators++;
    }
  }

  // If we found enough Markdown indicators, consider it a Markdown file
  return markdownIndicators >= 3;
}

/**
 * Get the file extension from a file path
 *
 * @param filePath - The file path to extract extension from
 * @returns The lowercase file extension (including the dot), or empty string if none
 *
 * @example
 * ```typescript
 * getFileExtension('/path/to/file.md') // returns '.md'
 * getFileExtension('/path/to/file') // returns ''
 * ```
 */
export function getFileExtension(filePath: string): string {
  return path.extname(filePath).toLowerCase();
}

/**
 * Check if a file extension is a known Markdown extension
 *
 * @param extension - The file extension to check (with or without leading dot)
 * @returns True if the extension is recognized as a Markdown extension, false otherwise
 *
 * @example
 * ```typescript
 * isMarkdownExtension('.md') // returns true
 * isMarkdownExtension('md') // returns true
 * isMarkdownExtension('.txt') // returns false
 * ```
 */
export function isMarkdownExtension(extension: string): boolean {
  const normalized = extension.startsWith(".")
    ? extension.toLowerCase()
    : `.${extension.toLowerCase()}`;
  return MARKDOWN_EXTENSIONS.includes(normalized);
}
