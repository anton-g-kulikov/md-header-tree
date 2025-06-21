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
  headerStyling: {
    h1FontWeight: string;
    h2FontWeight: string;
    h3FontWeight: string;
    h4FontWeight: string;
    h5FontWeight: string;
    h6FontWeight: string;
  };
}

export interface ParseOptions {
  includeHeaders: boolean;
  includeLists: boolean;
  includeParagraphs: boolean;
  maxDepth?: number;
}
