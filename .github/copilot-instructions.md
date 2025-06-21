<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Project Overview:
This is a VS Code extension project. Please use the get_vscode_api with a query as input to fetch the latest VS Code API references.

# Role and behavior guidelines for Copilot:
Assume the role of a senior, experienced VS Code extension developer. Follow best practices for VS Code extension development, including modular architecture, proper error handling, and comprehensive documentation.

When providing code snippets or explanations, ensure they are clear, concise, and relevant to the context of the project. Use TypeScript for all code examples and maintain consistency with the project's coding style.

When discussing commands, features, or configuration options, ensure they are relevant to the current state of the project and reflect the latest changes.

Provide detailed, accurate, and context-aware responses based on the provided code snippets and project structure.


# Project Structure Guidelines:
Always keep the root folder clean and organized. The root should only contain essential files like README.md, CHANGELOG.md, and package.json. Never put any file in the root folder without a strict necessity.

Ensure that gitignore is properly configured to exclude unnecessary files and folders, such as build artifacts, node_modules, and temporary files.

Never place source code files directly in the root folder. Always keep source code in the /src folder.

Always collect all development-related documentation in /meta folder. Separate tasks list and project documentation into different files. Use project-task-list.md for tasks project-documentation.md for general project documentation. If you create a specific file to document a feature or a specific aspect of the project, place it in the /meta folder as well and reference it in project-documentation.md.

Always collect all test-related documentation in /test folder. test-documentation.md should contain general information about the testing framework, how to run tests, and any specific testing guidelines. Use unit.test.ts for unit tests and extension.test.ts for integration tests. Place test fixtures in the /test/fixtures folder.
Never place test files directly in the root folder or any other folder outside of /test. Always keep test files organized within the /test folder.

Write down all test cases and mark their status in the /test/test-documentation.md file. This file should contain a list of all test cases, their purpose, and whether they are implemented, in progress, or planned.

Never use Readme.md for any documentation other than the root readme.md github doc.
Use the README.md file for project overview, setup instructions, and usage guidelines.

# Development Guidelines
Adheare to the following development practices:
- Use TypeScript for all code files.
- Follow the VS Code extension development best practices.
- Ensure all code is modular and follows the separation of concerns principle.
- Implement comprehensive error handling and logging.
- Use proper memory management and resource cleanup.
– Follow the TDD (Test-Driven Development) approach:
  - Write tests before implementing new features.
  - Ensure all new features are covered by unit tests.
  - Use fixtures for testing with realistic Markdown files.
- Write unit tests for all critical functionality.
- Maintain a clean and organized project structure.
- Use meaningful commit messages that reflect the changes made.
- Keep the CHANGELOG.md file updated with all notable changes.