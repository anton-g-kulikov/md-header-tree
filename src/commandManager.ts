/**
 * Command handlers for the Markdown Hierarchy Viewer extension
 */

import * as vscode from "vscode";
import { WebviewManager } from "./webviewManager";
import { Logger } from "./logger";
import { isMarkdownFile } from "./fileDetection";

export class CommandManager {
  private webviewManager: WebviewManager;

  constructor(context: vscode.ExtensionContext) {
    this.webviewManager = new WebviewManager(context);
  }

  public registerCommands(context: vscode.ExtensionContext): void {
    // Register the main command
    const showTreeCommand = vscode.commands.registerCommand(
      "markdown-hierarchy-viewer.showTree",
      this.handleShowTree.bind(this)
    );

    // Register additional commands
    const refreshCommand = vscode.commands.registerCommand(
      "markdown-hierarchy-viewer.refresh",
      this.handleRefresh.bind(this)
    );

    const showLogsCommand = vscode.commands.registerCommand(
      "markdown-hierarchy-viewer.showLogs",
      this.handleShowLogs.bind(this)
    );

    const forceMarkdownModeCommand = vscode.commands.registerCommand(
      "markdown-hierarchy-viewer.forceMarkdownMode",
      this.handleForceMarkdownMode.bind(this)
    );

    context.subscriptions.push(
      showTreeCommand,
      refreshCommand,
      showLogsCommand,
      forceMarkdownModeCommand
    );
    Logger.info("Commands registered successfully");
  }

  private async handleShowTree(): Promise<void> {
    try {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showErrorMessage(
          "No active editor found. Please open a Markdown file."
        );
        return;
      }

      const document = editor.document;

      if (!isMarkdownFile(document)) {
        vscode.window.showErrorMessage(
          "Active file is not recognized as a Markdown file. Please open a Markdown file (.md, .markdown, etc.) or check if the file content is valid Markdown."
        );
        return;
      }

      await this.webviewManager.showPreview(document);
    } catch (error) {
      Logger.error("Error in showTree command", error as Error);
      vscode.window.showErrorMessage(
        "Failed to show hierarchy tree preview. Check the output logs for details."
      );
    }
  }

  private async handleRefresh(): Promise<void> {
    try {
      const editor = vscode.window.activeTextEditor;

      if (!editor || !isMarkdownFile(editor.document)) {
        vscode.window.showInformationMessage(
          "Please open a Markdown file to refresh the tree view."
        );
        return;
      }

      if (!this.webviewManager.isVisible()) {
        vscode.window.showInformationMessage(
          'Tree preview is not currently open. Use "Show Hierarchy Viewer" first.'
        );
        return;
      }

      await this.webviewManager.showPreview(editor.document);
      vscode.window.showInformationMessage("Tree view refreshed successfully.");
    } catch (error) {
      Logger.error("Error in refresh command", error as Error);
      vscode.window.showErrorMessage("Failed to refresh tree view.");
    }
  }

  private handleShowLogs(): void {
    Logger.show();
  }

  private async handleForceMarkdownMode(): Promise<void> {
    try {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showErrorMessage("No active editor found.");
        return;
      }

      // Set language mode to markdown
      await vscode.languages.setTextDocumentLanguage(
        editor.document,
        "markdown"
      );

      vscode.window.showInformationMessage(
        `Language mode set to Markdown for "${editor.document.fileName}". You can now use the hierarchy viewer.`
      );

      Logger.info(
        `Forced Markdown language mode for: ${editor.document.fileName}`
      );
    } catch (error) {
      Logger.error("Error forcing Markdown mode", error as Error);
      vscode.window.showErrorMessage("Failed to set Markdown language mode.");
    }
  }

  public dispose(): void {
    this.webviewManager.dispose();
  }
}
