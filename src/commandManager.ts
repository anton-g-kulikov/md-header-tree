/**
 * Command handlers for the Markdown Hierarchy Viewer extension
 */

import * as vscode from "vscode";
import { WebviewManager } from "./webviewManager";
import { Logger } from "./logger";

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

    context.subscriptions.push(
      showTreeCommand,
      refreshCommand,
      showLogsCommand
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

      if (document.languageId !== "markdown") {
        vscode.window.showErrorMessage(
          "Active file is not a Markdown file. Please open a .md file."
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

      if (!editor || editor.document.languageId !== "markdown") {
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

  public dispose(): void {
    this.webviewManager.dispose();
  }
}
