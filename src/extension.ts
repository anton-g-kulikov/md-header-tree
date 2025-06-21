// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "markdown-ascii-tree" is now active!');

	const disposable = vscode.commands.registerCommand('markdown-ascii-tree.showAsciiTree', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active editor found.');
			return;
		}
		const doc = editor.document;
		if (doc.languageId !== 'markdown') {
			vscode.window.showErrorMessage('Active file is not a Markdown file.');
			return;
		}
		const text = doc.getText();
		const lines = text.split(/\r?\n/);
		const headers = lines
			.map(line => {
				const match = line.match(/^(#+)\s+(.*)/);
				if (match) {
					return { level: match[1].length, text: match[2] };
				}
				return null;
			})
			.filter(Boolean) as { level: number, text: string }[];

		function buildTree(headers: { level: number, text: string }[]) {
			const root = { children: [] as any[] };
			const stack = [{ node: root, level: 0 }];
			for (const header of headers) {
				while (stack.length && header.level <= stack[stack.length - 1].level) {
					stack.pop();
				}
				const node = { ...header, children: [] as any[] };
				stack[stack.length - 1].node.children.push(node);
				stack.push({ node, level: header.level });
			}
			return root;
		}

		function printTree(node: any, prefix = '', isLast = true): string {
			return node.children.map((child: any, idx: number) => {
				const isLastChild = idx === node.children.length - 1;
				const line =
					prefix +
					(prefix ? (isLast ? '   ' : '│  ') : '') +
					(isLastChild ? '└─ ' : '├─ ') +
					child.text;
				return (
					line +
					'\n' +
					printTree(child, prefix + (isLast ? '   ' : '│  '), isLastChild)
				);
			}).join('');
		}

		const tree = buildTree(headers);
		const asciiTree = printTree(tree);

		const docNew = await vscode.workspace.openTextDocument({
			language: 'plaintext',
			content: asciiTree
		});
		await vscode.window.showTextDocument(docNew, { preview: false });
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
