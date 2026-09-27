# AI-Powered Code IDE (React + Node.js)

Welcome to the AI-Powered Code IDE, a modern, browser-based integrated development environment heavily inspired by VS Code, built specifically to work seamlessly with AI agents.

## Key Features
- **Robust Editor:** Monaco-based editor supporting syntax highlighting for JS, PY, TXT, MD, etc.
- **AI Native:** Integrated AI Chat, Agent workspaces, and Model selection.
- **Integrated Terminal:** Multiple tabs, supporting bash/powershell via xterm.js + node-pty.
- **File Management:** Fully functional file tree (create, move, delete).
- **Version Control:** 1-Click Git commits.
- **Session Management:** Persists your workspace, open tabs, terminals, and AI chats across reloads.
- **Customizable:** 10+ themes and granular AI permission controls.

## Documentation
- [System Architecture](docs/architecture.md)
- [Features Overview](docs/features.md)
- [AI & Agents](docs/ai-agents.md)
- [API & Communication](docs/api-design.md)
- [UI / UX Design](docs/ui-ux.md)
- [Session Management](docs/sessions.md)
- [Project Prompt](prompt.md)

The IDE is split into a robust Node.js backend and a dynamic React frontend.

## Frontend (React)
- **State Management:** Zustand or Redux to manage file tree states, terminal instances, active files, and AI chat histories. Handles Session Hydration on startup.
- **Code Editor:** Monaco Editor integration for high-performance text editing, syntax highlighting, and code auto-completion.
- **Terminal UI:** xterm.js combined with xterm-addon-fit for rendering the terminal interface.
- **Components:** Modular panels for:
  - File Explorer (Sidebar)
  - Editor (Main View)
  - Terminal (Bottom Panel)
  - AI Chat / Agent Workspace (Right Sidebar)
  - Settings Modal

## Backend (Node.js)
- **File System (FS) API:** REST endpoints and WebSockets for CRUD operations (Read, Write, Create, Delete, Move) on the local file system.
- **Session DB:** A lightweight store (e.g., SQLite or simply JSON files per workspace) to remember open files, layout sizes, and terminal histories.
- **Terminal Spawner:** `node-pty` to spawn OS-level shells (PowerShell, Bash) and pipe stdout/stdin securely to the frontend via WebSockets.
- **Git Integration:** Wrapper over standard `git` CLI (using `simple-git`) for detecting changes, staging, and committing.
- **Real-time Communication:** Socket.io for streaming terminal I/O, file watching (chokidar), and AI response streaming.