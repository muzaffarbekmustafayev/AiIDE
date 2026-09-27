# Session Management (Sessiyalarni boshqarish)

## Overview
A core feature of the AI-Powered IDE is **Session Management**. Sessions ensure that when a user closes the browser or disconnects, their entire workspace state is preserved. Upon returning, they can pick up exactly where they left off.

## Session Data Structure
A session encapsulates the entire state of a specific project/workspace. The backend or local storage will save the following data in a `session.json` or a lightweight SQLite database:

### 1. Editor State
- **Open Files:** An array of file paths that are currently open in the tabs.
- **Active File:** The specific file that is currently focused.
- **Cursor & Scroll Positions:** The exact line/column cursor position and scroll depth for each opened file.
- **Unsaved Changes:** Drafts of files that haven't been saved to the disk yet, preserved in memory/cache.

### 2. Terminal State
- **Active Terminals:** Number of terminal tabs currently open.
- **Terminal History:** The stdout/stderr buffer for each terminal (so users can see previous commands when they reload).
- **Working Directories:** The current path each terminal instance was navigating.

### 3. AI Context & History
- **Chat Histories:** The ongoing conversation threads with the AI for that specific project.
- **Agent Tasks:** The status of any background autonomous agent tasks (e.g., "In Progress", "Paused", "Completed").
- **Selected Models:** The user's last used AI model (e.g., Claude 3.5, GPT-4) for this workspace.

### 4. UI/UX Layout
- **Panel Sizes:** The width of the sidebar (File Explorer) and the height of the bottom panel (Terminal).
- **Theme:** The specific theme applied to this session (though this can also be a global user setting).

## Session Lifecycle
1. **Initialization:** When the IDE loads a folder, it checks for an existing `.ide/session.json` (or calls a backend endpoint).
2. **Auto-Saving:** The session state is auto-saved locally or to the backend every few seconds or on specific triggers (e.g., opening a new file, changing a tab).
3. **Restoration:** On page reload, the frontend state manager (Zustand/Redux) hydrates the stores using the session data, re-spawning terminal PTYs and reopening Monaco Editor models.

## Multi-Workspace Support
Users can have multiple workspaces. Each workspace folder generates a unique session ID. Switching between folders (projects) seamlessly loads the respective session context.

## Remote & Mobile Connection
- **Mobile Access:** Sessions can be accessed and controlled remotely via mobile devices.
- **Connection Methods:**
  - **QR Code:** Users can scan a generated QR code from the IDE to instantly link their mobile device to the current session.
  - **8-Digit Code:** Alternatively, a randomly generated 8-digit code can be entered on the mobile interface to securely join the active session.