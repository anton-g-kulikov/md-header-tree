/**
 * Logging utility for the Markdown ASCII Tree extension
 */

import * as vscode from "vscode";

export class Logger {
  private static outputChannel: vscode.OutputChannel;

  static initialize(extensionName: string): void {
    this.outputChannel = vscode.window.createOutputChannel(extensionName);
  }

  static info(message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] INFO: ${message}`;

    if (this.outputChannel) {
      this.outputChannel.appendLine(logMessage);

      if (args.length > 0) {
        this.outputChannel.appendLine(
          `Details: ${JSON.stringify(args, null, 2)}`
        );
      }
    }

    console.log(logMessage, ...args);
  }

  static warn(message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] WARN: ${message}`;

    if (this.outputChannel) {
      this.outputChannel.appendLine(logMessage);

      if (args.length > 0) {
        this.outputChannel.appendLine(
          `Details: ${JSON.stringify(args, null, 2)}`
        );
      }
    }

    console.warn(logMessage, ...args);
  }

  static error(message: string, error?: Error, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ERROR: ${message}`;

    if (this.outputChannel) {
      this.outputChannel.appendLine(logMessage);

      if (error) {
        this.outputChannel.appendLine(`Stack: ${error.stack}`);
      }

      if (args.length > 0) {
        this.outputChannel.appendLine(
          `Details: ${JSON.stringify(args, null, 2)}`
        );
      }
    }

    console.error(logMessage, error, ...args);
  }

  static show(): void {
    if (this.outputChannel) {
      this.outputChannel.show();
    }
  }

  static dispose(): void {
    if (this.outputChannel) {
      this.outputChannel.dispose();
    }
  }
}
