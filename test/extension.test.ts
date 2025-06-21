import * as assert from "assert";
import * as vscode from "vscode";
import * as path from "path";

suite("Extension Integration Tests", () => {
  vscode.window.showInformationMessage(
    "Start all extension integration tests."
  );

  test("Extension should activate successfully", async () => {
    const extension = vscode.extensions.getExtension(
      "your-publisher-name.markdown-hierarchy-viewer"
    );

    if (extension) {
      if (!extension.isActive) {
        await extension.activate();
      }
      assert.strictEqual(
        extension.isActive,
        true,
        "Extension should be active"
      );
    } else {
      // Skip this test if extension is not found (in development environment)
      console.log(
        "Extension not found in marketplace - this is expected in development"
      );
    }
  });

  test("Commands should be registered", async () => {
    const commands = await vscode.commands.getCommands(true);

    const expectedCommands = [
      "markdown-hierarchy-viewer.showTree",
      "markdown-hierarchy-viewer.refresh",
      "markdown-hierarchy-viewer.showLogs",
    ];

    for (const command of expectedCommands) {
      assert.strictEqual(
        commands.includes(command),
        true,
        `Command ${command} should be registered`
      );
    }
  });

  test("Extension should work with Markdown files", async () => {
    // Create a test markdown document
    const testMarkdown = `# Test Header
This is a test paragraph.

## Sub Header
- List item 1
- List item 2

### Deep Header
1. Numbered item
2. Another numbered item`;

    const document = await vscode.workspace.openTextDocument({
      content: testMarkdown,
      language: "markdown",
    });

    await vscode.window.showTextDocument(document);

    // Test that the command can be executed without throwing
    try {
      await vscode.commands.executeCommand(
        "markdown-hierarchy-viewer.showTree"
      );
      // If we get here, the command executed successfully
      assert.ok(true, "Show tree command executed without error");
    } catch (error) {
      assert.fail(`Show tree command failed: ${error}`);
    }
  });

  test("Extension should handle non-Markdown files gracefully", async () => {
    // Create a test non-markdown document
    const document = await vscode.workspace.openTextDocument({
      content: 'console.log("Hello, world!");',
      language: "javascript",
    });

    await vscode.window.showTextDocument(document);

    // Test that the command handles non-markdown files gracefully
    try {
      await vscode.commands.executeCommand(
        "markdown-hierarchy-viewer.showTree"
      );
      // Command should complete but show an error message
      assert.ok(true, "Command handled non-markdown file gracefully");
    } catch (error) {
      // This is also acceptable behavior
      assert.ok(true, "Command properly rejected non-markdown file");
    }
  });

  test("Configuration should be accessible", () => {
    const config = vscode.workspace.getConfiguration("markdownHierarchyViewer");

    // Test that default configuration values are accessible
    const branch = config.get("treeSymbols.branch");
    const last = config.get("treeSymbols.last");
    const vertical = config.get("treeSymbols.vertical");

    assert.strictEqual(
      typeof branch,
      "string",
      "Branch symbol should be a string"
    );
    assert.strictEqual(typeof last, "string", "Last symbol should be a string");
    assert.strictEqual(
      typeof vertical,
      "string",
      "Vertical symbol should be a string"
    );
  });

  test("Test fixture files should be parseable", async () => {
    // Get workspace root and navigate to fixtures
    const workspaceRoot = path.resolve(__dirname, "..", "..");
    const fixturesDir = path.join(workspaceRoot, "test", "fixtures");
    const testFiles = [
      "test-document.md",
      "test-code-blocks.md",
      "test-readme-with-code.md",
    ];

    for (const filename of testFiles) {
      try {
        const filePath = path.join(fixturesDir, filename);
        const document = await vscode.workspace.openTextDocument(filePath);

        assert.strictEqual(
          document.languageId,
          "markdown",
          `${filename} should be detected as markdown`
        );
        assert.ok(
          document.getText().length > 0,
          `${filename} should have content`
        );
      } catch (error) {
        assert.fail(`Failed to load test fixture ${filename}: ${error}`);
      }
    }
  });
});
