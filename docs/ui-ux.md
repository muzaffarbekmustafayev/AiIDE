# UI & UX Architecture

The interface of **AiIDE** is meticulously designed to provide a professional, low-latency development environment. It draws heavy inspiration from VS Code to ensure an instantly familiar UX for developers, while carving out dedicated, prominent real estate for AI interactions.

> ℹ️ **Ta'riflash uchun:** AiIDE uch xil formatda ishlatiladi — **Web IDE**, **Desktop IDE (Electron)** va **Standalone Terminal**. Batafsil: [distribution-models.md](distribution-models.md)

---

## 0. Landing Page (Bosh sahifa)

Landing page — bu butun tizimga kirish eshigi bo'lib, foydalanuvchi qanday usulda ishlatishni o'zi tanlashi kerak:

- **Boshliq (Hero Section):** AiIDE'ning qisqacha tavsifi va asosiy afzalliklari.
- **Uch ta asosiy CTA (Call-to-Action) tugma:**
  | Tugma | Tavsif | Yo'nalish |
  |---|---|---|
  | 🌐 **Brauzerda ishlatish** | Hech narsa o'rnatmasdan, darhol boshlash | Auth (Login/Register) → Web IDE |
  | 💻 **Desktop'ni yuklab olish** | Windows/macOS/Linux uchun o'rnatiladigan dastur | `downloads/` — `.exe` / `.dmg` / `.deb` |
  | ⌨️ **Terminalni yuklab olish** | Faqat aqlli terminal (kod muharririsiz) | `downloads/` — terminal-only build |
- **Login / Register Rejasi:** Navbatdagi qadam sifatida Landing Page'dan keyin yoki yuqori panelda (Navbar) foydalanuvchilarni autentifikatsiya qilish (Auth) tizimi qo'shilishi rejalashtirilgan. Bu API kalitlarni va xususiy sessiyalarni cloud'da saqlash imkonini beradi.
- **Mualliflar / Features bo'limi:** Loyihaning asosiy imkoniyatlari (AI agent, terminal, Git, sessiyalar).
- **Footer:** GitHub, hujjatlar va lisensiya havolalari.

> 💡 Desktop va Terminal yuklab olish tugmalari boshlang'ich holatda **disabled** (o'chirilgan) holatda bo'lishi mumkin, chunki ular birinchi build topshirig'ida paydo bo'ladi.
---

## 1. Core Layout Structure

The main IDE window is divided into five distinct regions, optimized for widescreen desktop displays.

### 1.1 Activity Bar (Far Left)
A narrow, vertical strip containing icons to switch the context of the Primary Sidebar.
- **Explorer (Files):** Manage the workspace.
- **Search (Magnifying Glass):** Global text search.
- **Source Control (Git Node):** Stage and commit changes.
- **Settings (Gear Icon - Bottom):** Access themes, AI permissions, and external API key configurations.

### 1.2 Primary Sidebar (Left Panel)
The content of this panel changes dynamically based on the Activity Bar selection.
- **Resizability:** The user can drag the border to make it wider or narrower.
- **Collapsibility:** Clicking the active Activity Bar icon toggles the sidebar's visibility, giving more room to the editor.

## 1.3 Editor Group (Center Main Area)
The primary workspace for writing code.
- **Tab Bar:** Displays currently open files. The active tab is highlighted.
- **Breadcrumbs (Optional):** A top navigation bar showing the folder path to the current file (e.g., `src > components > App.tsx`).
- **Editor Canvas:** The Monaco Editor instance.
- **Empty State:** If no files are open, a landing screen with quick keyboard shortcuts (e.g., `Ctrl+P` to search files, `Ctrl+Shift+` to open terminal) is displayed.

### 1.4 Bottom Panel (Terminal Area)
A resizable drawer anchored to the bottom of the screen.
- **Panel Tabs:** Switch between `Terminal`, `Output` (build logs), and `Problems` (linter errors).
- **Terminal Management:** A plus icon (`+`) to open a new terminal instance, and a trash can icon (`🗑`) to kill the active instance.

### 1.5 Secondary Sidebar (Right Panel - The AI Core)
This is the differentiating factor of AiIDE. It is persistently available on the right side.
- **AI Chat Tab:** A conversational interface for Q&A, code explanations, and snippet generation.
- **Agent Workspace Tab:** A task-oriented UI displaying the Agent's current plan, activity logs, and pending approval requests.
---

## 2. Frontend Windows & Views (Complete List)

To accommodate the full lifecycle of a user session—from authentication to mobile pairing—the application routes users through several distinct views:

1. **Landing Page:** The public entry point. Presents the three distribution models (Web IDE, Desktop IDE, Standalone Terminal) with dedicated CTA buttons.
2. **Authentication Window:**
   - The entry point for unauthenticated users. Features Login/Register forms.
   - Upon login, a *Data Sync Prompt* asks if the user wants to import previously saved OpenRouter API keys.
3. **Workspace Selector:** A screen where the user selects the local directory they want to open as a project.
4. **Main IDE Window:** The primary interface described in the Layout Structure.
5. **Terminal-Only Window:** A minimal, chrome-free view that renders **only** the integrated terminal. Used both as a route inside the web app (`/terminal-only`) and as the entire payload of the standalone Terminal distribution. It keeps the session management and mobile pairing capabilities but removes the editor, file tree and AI panels.
6. **Settings Modal:** A centered overlay for configuring Themes, Editor Preferences (Font size, Tab size), and AI Permissions (File creation, Terminal execution).
7. **AI Provider Connection Window (BYOK):** A dedicated settings interface for managing external API keys, testing connections, and selecting default LLM models.
8. **Mobile Pairing Screen:** A modal displaying the QR code and the 8-digit random PIN for connecting a smartphone to the active session.
9. **Command Palette (`Ctrl+Shift+P`):** A floating, centered search bar used for quickly finding files by name or executing IDE commands (e.g., "Format Document", "Change Theme").
10. **Agent Feedback / Diff View:** A specialized modal or split-editor view that appears when an AI Agent proposes modifying a file, allowing the user to review the Git-style diff before hitting "Approve".

---

## 3. Theming Engine

The visual identity of the IDE is entirely driven by **CSS Variables (Custom Properties)** and Tailwind CSS.

- **Theme Swapping:** Changing a theme instantly updates the `--bg-primary`, `--text-main`, `--accent-color`, etc., attached to the root `<html>` element. There is no need to reload the page.
- **Monaco Synchronization:** When the UI theme changes, the Monaco Editor's internal theme (`vs-dark`, `hc-black`, custom themes) is automatically synchronized via a React `useEffect` hook.
- **Terminal Synchronization:** The `xterm.js` color palette (ANSI colors) is also re-injected to match the new overall aesthetic.