# Session & State Management

A critical component of a web-based IDE is ensuring that the user never loses their work. **AiIDE** implements a robust Session Management system that preserves the exact state of the workspace across page reloads, browser closures, and remote mobile connections.

---

## 1. What Constitutes a "Session"?

A Session in AiIDE is an encapsulation of the user's current environment. It is tied to a specific **Working Directory** (Workspace Root) and includes:

### A. Editor State
- **Open Tabs:** An array of file paths that are currently open in the Monaco editor.
- **Active Tab:** The specific file the user is currently looking at.
- **Cursor & Scroll Positions:** The exact line and column the cursor was on, and the vertical scroll depth for *each* open file.
- **Unsaved Drafts:** Text modifications that have not yet been written to the disk (stored in memory/local storage).

### B. Terminal State
- **Active Terminals:** The number of terminal instances running.
- **Terminal Buffers:** The stdout/stderr history of the terminal (so users can read previous logs even after a reload).
- **Current Working Directories (CWD):** The specific folder each terminal instance was navigating.

### C. UI & Layout State
- **Panel Sizes:** The width of the Left Sidebar and the height of the Bottom Terminal panel.
- **Active Sidebar View:** Whether the user was looking at the File Explorer, Git, or Search panel.
- **Theme:** The active visual theme.

### D. AI & Agent State
- **Chat History:** The ongoing conversation thread with the AI.
- **Agent Task Status:** If an AI Agent was in the middle of a multi-step task, its current progress and plan are saved.

---

## 2. Session Lifecycle & Persistence Strategy

### 2.1 Initialization & Hydration
When a user navigates to the IDE:
1. The Frontend checks the Auth State.
2. The user selects a Working Directory.
3. The Frontend requests the session data for that directory from the Backend (or LocalStorage).
4. **Hydration:** Zustand (or Redux) stores are populated with this data. The IDE automatically re-opens the necessary file tabs, requests the file contents from the `/api/fs` endpoint, and re-spawns terminal instances via Socket.IO.

### 2.2 Auto-Saving (Debounced Sync)
To minimize performance overhead, session state is not saved on every keystroke.
- State changes (like scrolling or changing tabs) are tracked locally in the Zustand store.
- A debounced function (e.g., every 3-5 seconds of inactivity) triggers a save event, serializing the JSON state to the Backend database or browser's LocalStorage.

### 2.3 Multi-Workspace Support
Users can switch between different projects (folders). Each folder generates a unique Session ID. Opening a new folder cleanly unmounts the current session and hydrates the new one, keeping project contexts strictly separated.

---

## 3. Remote Mobile Connectivity (Session Joining)

The session architecture natively supports multi-device synchronization, enabling the **Mobile Connection** feature.

### 3.1 The Pairing Process
1. **Host Generation:** The desktop browser generates a unique, temporary pairing token (a QR Code and an 8-digit PIN).
2. **Client Request:** The mobile device scans the QR code or enters the PIN on a dedicated mobile login page.
3. **Socket Room Join:** The Node.js backend verifies the token and adds the mobile device's WebSocket connection to the same "Room" as the desktop session.

### 3.2 State Synchronization
Once paired, the backend acts as a relay:
- If the mobile user types a command into the mobile terminal interface, the `pty:input` event is sent to the backend, executed, and the resulting `pty:data` is broadcasted to **both** the mobile screen and the desktop screen simultaneously.
- If the AI Agent asks for permission to edit a file, the approval modal appears on both devices. The user can click "Approve" from their phone while away from the keyboard.