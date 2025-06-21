/**
 * Type definitions for the Markdown Hierarchy Viewer extension
 */

export interface MarkdownElement {
  level: number;
  text: string;
  type: ElementType;
  lineNumber?: number;
  metadata?: { [key: string]: any };
}

export type ElementType =
  | "header"
  | "list"
  | "numbered-list"
  | "paragraph"
  | "code-block";

export interface TreeNode extends MarkdownElement {
  children: TreeNode[];
}

export interface ExtensionConfig {
  treeSymbols: {
    branch: string;
    last: string;
    vertical: string;
    space: string;
  };
  colors: {
    treeSymbols: string;
    content: string;
    background: string;
  };
  fonts: {
    content: string;
    treeSymbols: string;
  };
  styling: {
    lineHeight: number;
    padding: string;
  };
}

export interface ParseOptions {
  includeHeaders: boolean;
  includeLists: boolean;
  includeParagraphs: boolean;
  maxDepth?: number;
}
