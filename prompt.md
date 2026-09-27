# Project Prompt: AI-Powered Code IDE (VS Code Clone)

## Overview
Develop a fully functional, AI-powered Code IDE similar to VS Code, built using **React** (Frontend) and **Node.js** (Backend). The IDE should tightly integrate AI assistance, file management, and terminal execution, giving users and AI agents a seamless development environment.

## Tech Stack
- **Frontend:** React (with a robust state manager, code editor like Monaco Editor, and UI components)
- **Backend:** Node.js (for file system operations, terminal spawning via `node-pty`, and Git interactions)

## Core Features & Requirements

### 1. Editor & Workspace
- **Code Editor:** Support for viewing and manually editing multiple file formats (e.g., `.js`, `.py`, `.txt`, `.md`, `.json`, etc.) with syntax highlighting.
- **File Explorer (Tree View):** 
  - Hierarchical view of project files and folders.
  - CRUD operations: Create, Delete, Move (Rename/Drag-and-Drop) files and directories.

### 2. AI Integration
- **AI Chat Panel:** A conversational interface for users to chat with the AI, ask coding questions, and get snippets.
- **AI Agent Panel:** A dedicated panel to monitor and interact with the autonomous AI agent performing complex, multi-step tasks.
- **Model Selector:** A dropdown or UI to let users select which AI model they want to use (e.g., GPT-4, Claude, Llama, etc.).

### 3. Terminal Integration
- **Integrated Terminal:** A built-in terminal UI (using something like xterm.js).
- **Multiple Terminals:** Ability to create, switch between, and manage multiple terminal tabs/instances.
- **Shell Support:** Ability to select terminal types (e.g., PowerShell, Bash, CMD, Zsh) depending on the host OS availability.

### 4. Git Integration
- **Source Control:** Automatically detect changes in the connected workspace.
- **1-Click Commit:** A dedicated UI button to stage and commit changes to Git if there are modifications.

### 5. Settings & Permissions
- **Agent Permissions:** Granular toggles in settings allowing the user to grant or revoke specific permissions to the AI agent:
  - Permission to create/edit files.
  - Permission to install libraries/packages.
  - Permission to run terminal commands.
- **Theme Selector:** A theme toggle/selector supporting at least 10+ different UI and editor themes.

## Guidelines for the AI Generating this Project
- Ensure clean, modular component architecture in React.
- Use WebSocket or IPC for real-time communication between the Node.js backend (terminal output, file watcher) and the React frontend.
- Prioritize security and explicit user consent for AI agent actions.