/**
 * Configuration management for the Markdown Hierarchy Viewer extension
 */

import * as vscode from "vscode";
import { ExtensionConfig } from "./types";

export class ConfigurationManager {
  private static readonly SECTION = "markdownHierarchyViewer";

  static getConfiguration(): ExtensionConfig {
    const config = vscode.workspace.getConfiguration(this.SECTION);

    return {
      treeSymbols: {
        branch: config.get("treeSymbols.branch", "├──"),
        last: config.get("treeSymbols.last", "└──"),
        vertical: config.get("treeSymbols.vertical", "│"),
        space: config.get("treeSymbols.space", "   "),
      },
      colors: {
        treeSymbols: config.get("colors.treeSymbols", "rgb(200, 200, 200)"),
        content: config.get("colors.content", "rgb(0, 0, 0)"),
        background: config.get("colors.background", "rgb(246, 246, 246)"),
      },
      fonts: {
        content: config.get(
          "fonts.content",
          "'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
        ),
        treeSymbols: config.get(
          "fonts.treeSymbols",
          "'SF Mono', Consolas, 'Liberation Mono', Menlo, Courier, monospace"
        ),
      },
      styling: {
        lineHeight: config.get("styling.lineHeight", 1.6),
        padding: config.get("styling.padding", "4em"),
      },
      headerStyling: {
        h1FontWeight: config.get("headerStyling.h1FontWeight", "600"),
        h2FontWeight: config.get("headerStyling.h2FontWeight", "600"),
        h3FontWeight: config.get("headerStyling.h3FontWeight", "400"),
        h4FontWeight: config.get("headerStyling.h4FontWeight", "400"),
        h5FontWeight: config.get("headerStyling.h5FontWeight", "400"),
        h6FontWeight: config.get("headerStyling.h6FontWeight", "400"),
      },
    };
  }

  static onConfigurationChange(callback: () => void): vscode.Disposable {
    return vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(this.SECTION)) {
        callback();
      }
    });
  }
}
