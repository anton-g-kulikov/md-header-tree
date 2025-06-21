/**
 * Markdown Hierarchy Viewer Extension
 *
 * A VS Code extension that renders Markdown files as tree structures
 * with live preview, configuration support, and robust error handling.
 */

import * as vscode from "vscode";
import { Logger } from "./logger";
import { CommandManager } from "./commandManager";

let commandManager: CommandManager;

/**
 * Extension activation function
 * Called when the extension is first activated
 */
export function activate(context: vscode.ExtensionContext): void {
  try {
    // Initialize logging
    Logger.initialize("Markdown Hierarchy Viewer");
    Logger.info("Extension activation started");

    // Initialize command manager
    commandManager = new CommandManager(context);
    commandManager.registerCommands(context);

    // Log successful activation
    Logger.info("Markdown Hierarchy Viewer extension activated successfully");

    // Optional: Show welcome message on first activation
    const isFirstActivation = context.globalState.get(
      "markdownHierarchyViewer.firstActivation",
      true
    );
    if (isFirstActivation) {
      context.globalState.update(
        "markdownHierarchyViewer.firstActivation",
        false
      );
      vscode.window
        .showInformationMessage(
          'Markdown Hierarchy Viewer extension is now active! Open a Markdown file and use "Markdown: Show Hierarchy Viewer" command.',
          "Show Logs"
        )
        .then((selection) => {
          if (selection === "Show Logs") {
            Logger.show();
          }
        });
    }
  } catch (error) {
    Logger.error("Failed to activate extension", error as Error);
    vscode.window.showErrorMessage(
      "Failed to activate Markdown Hierarchy Viewer extension. Check the output logs for details."
    );
  }
}

/**
 * Extension deactivation function
 * Called when the extension is deactivated
 */
export function deactivate(): void {
  try {
    Logger.info("Extension deactivation started");

    if (commandManager) {
      commandManager.dispose();
    }

    Logger.info("Extension deactivated successfully");
    Logger.dispose();
  } catch (error) {
    console.error("Error during extension deactivation:", error);
  }
}
