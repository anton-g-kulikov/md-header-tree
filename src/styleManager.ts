/**
 * CSS template generator for the webview
 */

import { ExtensionConfig } from "./types";

export class StyleManager {
  static generateCSS(config: ExtensionConfig): string {
    return `
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap');
      
      body { 
        font-family: ${config.fonts.content}; 
        margin: 0; 
        padding: ${config.styling.padding}; 
        background: ${config.colors.background}; 
        color: ${config.colors.content};
        line-height: ${config.styling.lineHeight};
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      .tree-line { 
        font-family: ${config.fonts.treeSymbols};
        white-space: pre-wrap;
        word-break: break-word;
        padding: 0.5em 0;
        text-indent: 0;
        color: ${config.colors.treeSymbols};
        position: relative;
      }
      
      .tree-content {
        font-family: ${config.fonts.content};
        color: ${config.colors.content};
      }
      
      .tree-continuation {
        padding-top: 0;
      }
      
      /* Content formatting */
      .tree-content strong {
        font-weight: 700;
      }
      
      .tree-content em {
        font-style: italic;
      }
      
      .tree-content code {
        font-family: ${config.fonts.treeSymbols};
        background-color: rgba(175, 184, 193, 0.2);
        color: ${config.colors.content};
        padding: 0.2em 0.4em;
        border-radius: 3px;
        font-size: 0.9em;
      }
      
      /* Header specific styling - configuration-driven */
      .tree-content.header.header-1 {
        font-weight: ${config.headerStyling.h1FontWeight};
      }
      
      .tree-content.header.header-2 {
        font-weight: ${config.headerStyling.h2FontWeight};
      }
      
      .tree-content.header.header-3 {
        font-weight: ${config.headerStyling.h3FontWeight};
      }
      
      .tree-content.header.header-4 {
        font-weight: ${config.headerStyling.h4FontWeight};
      }
      
      .tree-content.header.header-5 {
        font-weight: ${config.headerStyling.h5FontWeight};
      }
      
      .tree-content.header.header-6 {
        font-weight: ${config.headerStyling.h6FontWeight};
      }
      
      /* List item styling */
      .tree-content.list {
        /* Additional list styling if needed */
      }
      
      /* Paragraph styling */
      .tree-content.paragraph {
        opacity: 0.9;
      }
      
      /* Code block styling */
      .tree-content.code-block {
        display: block;
        margin: 0.5em 0;
      }
      
      .tree-content.code-block pre {
        font-family: ${config.fonts.treeSymbols};
        background-color: rgba(175, 184, 193, 0.1);
        border: 1px solid rgba(175, 184, 193, 0.3);
        border-radius: 6px;
        padding: 1em;
        margin: 0;
        overflow-x: auto;
        white-space: pre;
        line-height: 1.4;
        font-size: 0.9em;
      }
      
      /* Custom scrollbar styling for code blocks */
      .tree-content.code-block pre::-webkit-scrollbar {
        height: 8px;
      }
      
      .tree-content.code-block pre::-webkit-scrollbar-track {
        background: rgba(175, 184, 193, 0.1);
        border-radius: 4px;
      }
      
      .tree-content.code-block pre::-webkit-scrollbar-thumb {
        background: rgba(175, 184, 193, 0.4);
        border-radius: 4px;
      }
      
      .tree-content.code-block pre::-webkit-scrollbar-thumb:hover {
        background: rgba(175, 184, 193, 0.6);
      }
      
      /* Firefox scrollbar styling */
      .tree-content.code-block pre {
        scrollbar-width: thin;
        scrollbar-color: rgba(175, 184, 193, 0.4) rgba(175, 184, 193, 0.1);
      }
      
      .tree-content.code-block code {
        font-family: ${config.fonts.treeSymbols};
        background: none;
        padding: 0;
        border-radius: 0;
        color: ${config.colors.content};
        font-size: inherit;
      }
      
      /* Link styling */
      a {
        color: #007acc;
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: all 0.2s ease;
      }
      
      a:hover {
        color: #005a9e;
        border-bottom-color: #007acc;
        text-decoration: none;
      }
      
      a:visited {
        color: #6f42c1;
      }
      
      a:visited:hover {
        color: #5a2d91;
        border-bottom-color: #6f42c1;
      }
      
      /* Error message styling */
      .error-message {
        color: #e74c3c;
        font-style: italic;
        text-align: center;
        padding: 2em;
      }
      
      /* Empty state styling */
      .empty-state {
        color: #7f8c8d;
        font-style: italic;
        text-align: center;
        padding: 2em;
      }
    `;
  }

  static generateHTML(content: string, config: ExtensionConfig): string {
    const css = this.generateCSS(config);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'unsafe-inline';">
  <title>Markdown Hierarchy Viewer</title>
  <style>${css}</style>
</head>
<body>
  ${content || '<div class="empty-state">No content to display</div>'}
</body>
</html>`;
  }
}
