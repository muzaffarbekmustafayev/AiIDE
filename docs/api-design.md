# API & Communication Design

The IDE relies heavily on a hybrid communication model using both **RESTful APIs** (for simple stateless actions) and **WebSockets** (for real-time, bi-directional data streaming).

## 1. WebSocket Events (Socket.io)
WebSockets are crucial for the real-time aspects of the IDE, such as the terminal and AI streaming.

### Terminal Events
- **`pty:spawn`** (Client -> Server): Request to start a new terminal process.
- **`pty:data`** (Server -> Client): Standard output stream from the OS shell to the xterm.js UI.
- **`pty:input`** (Client -> Server): Keystrokes or commands sent from the client terminal UI to the OS shell.
- **`pty:resize`** (Client -> Server): Adjusting terminal rows/cols when the frontend panel is resized.

### File System Events
- **`fs:watch_change`** (Server -> Client): Fired when a file is modified externally (e.g., via git pull or another editor). Prompts the frontend to update the tree or editor.

### AI & Agent Events
- **`ai:chat_stream`** (Server -> Client): Streaming tokens from the LLM to the chat panel for a typewriter effect.
- **`agent:status_update`** (Server -> Client): Updates on the background tasks the AI agent is performing (e.g., "Reading file X", "Running command Y").

## 2. REST API Endpoints (Express.js)
REST is used for standard CRUD operations where real-time streaming isn't strictly necessary.

### File Explorer (FS) API
- **`GET /api/fs/tree?path=/`**
  - Returns a nested JSON structure of directories and files.
- **`GET /api/fs/file?path=/src/app.js`**
  - Returns the text content of a file to be loaded into Monaco Editor.
- **`POST /api/fs/file`**
  - Creates a new file or directory.
- **`PUT /api/fs/file`**
  - Saves edits to an existing file.
- **`DELETE /api/fs/file`**
  - Deletes a file or directory.
- **`PATCH /api/fs/move`**
  - Renames or moves a file to a new path.

### Git Integration API
- **`GET /api/git/status`**
  - Returns the list of modified, untracked, and deleted files.
- **`POST /api/git/commit`**
  - Stages all changes and creates a commit with the provided message.
- **`GET /api/git/diff?file=/src/app.js`**
  - Returns the diff for a specific file to render a side-by-side view in the editor.

## Security & Authentication
- Localhost environments might bypass auth, but in a hosted environment, all API endpoints and WebSocket handshakes must be secured with a JWT token.
- Path traversal protections must be strictly enforced on all `/api/fs/*` endpoints to prevent reading/writing outside the designated workspace root.