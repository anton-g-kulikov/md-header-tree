// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "markdown-ascii-tree" is now active!'
  );

  let panel: vscode.WebviewPanel | undefined;
  let changeDocDisposable: vscode.Disposable | undefined;

  const disposable = vscode.commands.registerCommand(
    "markdown-ascii-tree.showAsciiTree",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found.");
        return;
      }
      const doc = editor.document;
      if (doc.languageId !== "markdown") {
        vscode.window.showErrorMessage("Active file is not a Markdown file.");
        return;
      }

      function parseMarkdownFormatting(text: string): string {
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

      function buildTree(
        elements: { level: number; text: string; type: string }[]
      ) {
        const root = { children: [] as any[] };
        const stack = [{ node: root, level: 0 }];
        for (const element of elements) {
          while (
            stack.length &&
            element.level <= stack[stack.length - 1].level
          ) {
            stack.pop();
          }
          const node = { ...element, children: [] as any[] };
          stack[stack.length - 1].node.children.push(node);
          stack.push({ node, level: element.level });
        }
        return root;
      }

      function printTree(node: any, prefix = "", isLast = true): string {
        return node.children
          .map((child: any, idx: number) => {
            const isLastChild = idx === node.children.length - 1;
            const line =
              prefix +
              (prefix ? (isLast ? "   " : "│  ") : "") +
              (isLastChild ? "└─ " : "├─ ") +
              child.text;
            return (
              line +
              "\n" +
              printTree(child, prefix + (isLast ? "   " : "│  "), isLastChild)
            );
          })
          .join("");
      }

      function printTreeDivs(node: any, prefix = "", isLast = true): string {
        return node.children
          .map((child: any, idx: number) => {
            const isLastChild = idx === node.children.length - 1;
            const linePrefix =
              prefix +
              (prefix ? (isLast ? "   " : "│  ") : "") +
              (isLastChild ? "└── " : "├── ");

            // Add type indicator for different element types
            let typeIcon = "";
            switch (child.type) {
              case "numbered-list":
                // Extract original number from the text if available
                const numberMatch = child.text.match(/^(\d+\.)\s*(.*)/);
                if (numberMatch) {
                  typeIcon = numberMatch[1] + " ";
                  child.text = numberMatch[2]; // Use text without the number
                }
                break;
              default:
                typeIcon = "";
            }

            // Join all text lines back together and wrap the entire paragraph in one div
            const formattedText = parseMarkdownFormatting(
              typeIcon + child.text
            ); // Apply markdown formatting
            const textStartPosition = linePrefix.length; // Calculate where text starts
            return (
              `<div class='tree-line' style='text-indent: -${textStartPosition}ch; padding-left: ${textStartPosition}ch;'>${linePrefix}<span class='tree-content'>${formattedText}</span></div>` +
              printTreeDivs(
                child,
                prefix + (isLast ? "   " : "│  "),
                isLastChild
              )
            );
          })
          .join("");
      }

      function getAsciiTree(mdText: string): string {
        const lines = mdText.split(/\r?\n/);
        const headers = lines
          .map((line) => {
            const match = line.match(/^(#+)\s+(.*)/);
            if (match) {
              return { level: match[1].length, text: match[2], type: "header" };
            }
            return null;
          })
          .filter(Boolean) as { level: number; text: string; type: string }[];
        const tree = buildTree(headers);
        return printTree(tree);
      }

      function getAsciiTreeDivs(mdText: string): string {
        const lines = mdText.split(/\r?\n/);
        const elements: { level: number; text: string; type: string }[] = [];
        let currentHeaderLevel = 0;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();

          // Skip empty lines
          if (!line) {
            continue;
          }

          // Check for headers
          const headerMatch = line.match(/^(#+)\s+(.*)/);
          if (headerMatch) {
            currentHeaderLevel = headerMatch[1].length;
            elements.push({
              level: currentHeaderLevel,
              text: headerMatch[2],
              type: "header",
            });
            continue;
          }

          // Check for list items
          const listMatch = line.match(/^(\s*)[-*+]\s+(.*)/);
          if (listMatch) {
            const indentLevel = Math.floor(listMatch[1].length / 2); // 2 spaces = 1 indent level
            elements.push({
              level: currentHeaderLevel + 1 + indentLevel,
              text: listMatch[2],
              type: "list",
            });
            continue;
          }

          // Check for numbered lists
          const numberedListMatch = line.match(/^(\s*)(\d+\.\s+)(.*)/);
          if (numberedListMatch) {
            const indentLevel = Math.floor(numberedListMatch[1].length / 2);
            elements.push({
              level: currentHeaderLevel + 1 + indentLevel,
              text: numberedListMatch[2] + numberedListMatch[3], // Include the number in the text
              type: "numbered-list",
            });
            continue;
          }

          // Regular paragraphs (if we have a current header context)
          if (currentHeaderLevel > 0) {
            elements.push({
              level: currentHeaderLevel + 1,
              text: line,
              type: "paragraph",
            });
          }
        }

        const tree = buildTree(elements);
        return printTreeDivs(tree);
      }

      function updateWebview(mdText: string) {
        if (panel) {
          const asciiTree = getAsciiTreeDivs(mdText);
          panel.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown ASCII Tree</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap');
    body { 
      font-family: 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; 
      margin: 0; 
      padding: 4em; 
      background: rgb(246, 246, 246); 
      color: rgb(0, 0, 0);
      line-height: 1.6;
    }
    .tree-line { 
      font-family: 'SF Mono', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      white-space: pre-wrap; /* allows wrapping but preserves spaces and line breaks */
      word-break: break-word; /* breaks long words if needed */
      padding: 0.5em 0;
      text-indent: 0; /* reset any text-indent */
      color: rgb(200, 200, 200); /* Gray color for tree symbols */
    }
    .tree-content {
      font-family: 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      color: rgb(0, 0, 0); /* Reset to black for content */
    }
    .tree-continuation {
      padding-top: 0; /* Remove top padding for continuation lines */
    }
    strong {
      font-weight: 700;
    }
    em {
      font-style: italic;
    }
    code {
      font-family: 'SF Mono', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      background-color: rgba(175, 184, 193, 0.2);
      color: rgb(0, 0, 0);
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-size: 0.9em;
    }
  </style>
</head>
<body>${asciiTree || "<i>No headers found</i>"}</body>
</html>`;
        }
      }

      if (!panel) {
        panel = vscode.window.createWebviewPanel(
          "markdownAsciiTreePreview",
          "Markdown ASCII Tree Preview",
          vscode.ViewColumn.Beside,
          { enableScripts: false }
        );
        panel.onDidDispose(() => {
          panel = undefined;
          if (changeDocDisposable) {
            changeDocDisposable.dispose();
            changeDocDisposable = undefined;
          }
        });
      }
      updateWebview(doc.getText());

      if (changeDocDisposable) {
        changeDocDisposable.dispose();
      }
      changeDocDisposable = vscode.workspace.onDidChangeTextDocument((e) => {
        if (e.document.uri.toString() === doc.uri.toString()) {
          updateWebview(e.document.getText());
        }
      });
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
