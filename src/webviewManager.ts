/**
 * Webview panel manager for the Markdown Hierarchy Viewer extension
 */

import * as vscode from "vscode";
import { StyleManager } from "./styleManager";
import { TreeRenderer } from "./treeRenderer";
import { MarkdownParser } from "./markdownParser";
import { ConfigurationManager } from "./configuration";
import { Logger } from "./logger";

export class WebviewManager {
  private panel: vscode.WebviewPanel | undefined;
  private disposables: vscode.Disposable[] = [];

  constructor(private context: vscode.ExtensionContext) {}

  public async showPreview(document: vscode.TextDocument): Promise<void> {
    try {
      // Validate document
      if (document.languageId !== "markdown") {
        throw new Error("Active file is not a Markdown file.");
      }

      // Create or reveal panel
      if (!this.panel) {
        this.createPanel();
      } else {
        this.panel.reveal(vscode.ViewColumn.Beside);
      }

      // Update content
      await this.updateContent(document.getText());

      // Set up document change listener
      this.setupDocumentListener(document);

      Logger.info("Preview panel created/updated successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      Logger.error("Failed to show preview", error as Error);
      vscode.window.showErrorMessage(`Markdown Hierarchy Viewer: ${errorMessage}`);
    }
  }

  private createPanel(): void {
    this.panel = vscode.window.createWebviewPanel(
      "markdownHierarchyViewerPreview",
      "Markdown Hierarchy Viewer",
      vscode.ViewColumn.Beside,
      {
        enableScripts: false,
        retainContextWhenHidden: true,
        localResourceRoots: [],
      }
    );

    // Handle panel disposal
    this.panel.onDidDispose(
      () => {
        this.dispose();
      },
      null,
      this.disposables
    );

    // Handle configuration changes
    const configDisposable = ConfigurationManager.onConfigurationChange(() => {
      if (this.panel) {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === "markdown") {
          this.updateContent(editor.document.getText());
        }
      }
    });
    this.disposables.push(configDisposable);

    Logger.info("Webview panel created");
  }

  private async updateContent(markdownText: string): Promise<void> {
    if (!this.panel) {
      return;
    }

    try {
      const config = ConfigurationManager.getConfiguration();
      const elements = MarkdownParser.parseDocument(markdownText);

      let content: string;
      if (elements.length === 0) {
        content = TreeRenderer.renderEmpty();
      } else {
        const tree = MarkdownParser.buildTree(elements);
        content = TreeRenderer.renderTree(tree, config);
      }

      this.panel.webview.html = StyleManager.generateHTML(content, config);
      Logger.info("Webview content updated", { elementCount: elements.length });
    } catch (error) {
      Logger.error("Failed to update webview content", error as Error);
      const errorContent = TreeRenderer.renderError(
        "Failed to parse markdown content"
      );
      const config = ConfigurationManager.getConfiguration();
      this.panel.webview.html = StyleManager.generateHTML(errorContent, config);
    }
  }

  private setupDocumentListener(document: vscode.TextDocument): void {
    // Clear existing listeners
    this.clearDocumentListeners();

    // Set up new listener
    const changeListener = vscode.workspace.onDidChangeTextDocument((event) => {
      if (
        event.document.uri.toString() === document.uri.toString() &&
        this.panel
      ) {
        // Debounce updates to avoid excessive re-rendering
        this.debounceUpdate(event.document.getText());
      }
    });

    this.disposables.push(changeListener);
  }

  private debounceTimer: NodeJS.Timeout | undefined;

  private debounceUpdate(text: string): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.updateContent(text);
    }, 300); // 300ms debounce
  }

  private clearDocumentListeners(): void {
    // Only clear document change listeners, not all disposables
    this.disposables = this.disposables.filter((disposable) => {
      const isDocumentListener = disposable
        .toString()
        .includes("onDidChangeTextDocument");
      if (isDocumentListener) {
        disposable.dispose();
        return false;
      }
      return true;
    });
  }

  public dispose(): void {
    Logger.info("Disposing webview manager");

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.disposables.forEach((disposable) => disposable.dispose());
    this.disposables = [];

    this.panel = undefined;
  }

  public isVisible(): boolean {
    return this.panel !== undefined && this.panel.visible;
  }
}
