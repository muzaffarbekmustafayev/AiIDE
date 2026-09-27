# IDE Features Overview

This document provides an exhaustive list of features available in **AiIDE**, broken down by functional category.

---

## 1. Core Editor Experience

The heart of the IDE is powered by **Monaco Editor** (the same engine behind VS Code).

- **Multi-Tab Interface:** Open, arrange, and switch between multiple files effortlessly.
- **Language Support:** Built-in syntax highlighting, bracket matching, and auto-indentation for HTML, CSS, JavaScript, TypeScript, Python, JSON, Markdown, and more.
- **IntelliSense & Autocomplete:** Smart code completions based on language semantics.
- **Minimap:** A high-level overview of the active file for quick scrolling.
- **Code Folding & Formatting:** Easily collapse code blocks and format code on save.
- **Diff Viewer:** A side-by-side comparison tool for reviewing Git changes or AI-proposed edits.

---

## 2. File Explorer & Workspace Management

Located in the Primary Sidebar, the File Explorer provides full CRUD access to the local file system.

- **Tree View Representation:** Collapsible folder structures reflecting the exact state of the local disk.
- **Drag and Drop:** Move files and folders by dragging them across the tree.
- **Context Menus:** Right-click support for `New File`, `New Folder`, `Rename`, `Delete`, and `Copy Path`.
- **Global Search (Regex):** Search for text across the entire workspace with support for Regular Expressions, Match Case, and Whole Word filters.

---

## 3. Integrated Terminal Engine

AiIDE doesn't just emulate a terminal; it provides a real shell experience.

- **Native OS Shells:** Spawns `bash`, `zsh`, or `powershell` depending on the host operating system using `node-pty`.
- **Multiple Terminal Instances:** Open several terminal tabs concurrently.
- **Terminal Splitting:** (Planned) View two terminal instances side-by-side.
- **ANSI Color Support:** Full color rendering for build logs, error messages, and CLI tools via `xterm.js`.
- **Responsive Resizing:** The terminal automatically adjusts its columns and rows when the UI panel is resized.

---

## 4. Source Control (Git) Integration

A dedicated Source Control panel allows users to manage version history without leaving the browser.

- **Real-time Change Detection:** Modified, added, and deleted files are highlighted with distinct colors and badges.
- **1-Click Staging & Commit:** A unified UI to stage changes and write commit messages.
- **Branch Management:** View the current branch and (planned) switch between branches easily.
- **Inline Editor Diffs:** Git changes are reflected directly in the Monaco editor margin (green for additions, red for deletions).

---

## 5. Mobile & Remote Connectivity

AiIDE breaks the boundaries of traditional desktop coding by allowing seamless mobile control.

- **Session QR Pairing:** Generate a secure QR code on the desktop screen.
- **8-Digit PIN Access:** Alternatively, use a randomly generated code to join the session.
- **Synchronized View:** Actions taken on the mobile device (e.g., triggering an AI prompt, viewing terminal output) are instantly reflected on the main desktop screen via Socket.IO.
- **Remote Execution:** Trigger build scripts or view server logs remotely from a smartphone while away from the keyboard.

---

## 6. Theming & Personalization

- **Dynamic Theme Engine:** Switch between Light and Dark modes seamlessly.
- **Pre-installed Themes:** Includes community favorites like VS Dark+, GitHub Light, Dracula, Monokai Pro, and Solarized.
- **CSS Custom Properties:** The entire UI is built using CSS variables, allowing for rapid customization of primary colors, backgrounds, and syntax highlighting.
- **Editor Configurations:** Toggle word wrap, adjust font size, change tab width, and configure font families.

---

## 7. AI Extensions & Plugins (BYOK)

- **OpenRouter Integration:** Plug in a single API key to access hundreds of models (GPT-4, Claude 3.5, LLaMA).
- **Custom Agent Windows:** Spawn specialized UI windows dedicated to specific AI tasks.
- **Settings Persistence:** The IDE remembers your preferred models, API keys, and safety permissions across sessions.