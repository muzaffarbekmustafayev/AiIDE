# 🚀 AiIDE — AI-Powered Code IDE

**AiIDE** zamonaviy, brauzer asosidagi AI-integratsiyali IDE (Integrated Development Environment) hisoblanadi. U VS Code interfeysiga o'xshatilgan bo'lib, AI agentlar bilan birgalikda ishlay olish uchun maxsus loyihalangan.

> A modern, browser-based IDE inspired by VS Code, built to work seamlessly with AI agents, custom AI models (OpenRouter), and remote mobile access.

---

## ✨ Key Features (Asosiy imkoniyatlar)

| Feature | Tavsif |
|---|---|
| 🖋️ **Robust Editor** | Monaco asosidagi tahrirlovchi — JS, PY, TXT, MD va hokazo tillar sintaksislarini qo'llab-quvvatlaydi |
| 🤖 **AI Native** | Integratsiyalangan AI Chat va Agent workspace, model tanlash tizimi |
| 🔌 **Bring Your Own Key (BYOK)** | Shaxsiy AI API kalitlaringizni (masalan, **OpenRouter**) ulab, o'z AI modellaringiz bilan chat/agentik oynalar ochish |
| 🖥️ **Integrated Terminal** | Bir nechta terminal tab'lar — `xterm.js` + `node-pty` orqali real PowerShell / Bash / Zsh |
| 📁 **File Management** | To'liq ishlaydigan fayllar daraxti (yaratish, ko'chirish, o'chirish, drag-and-drop) |
| 🔀 **Version Control** | 1-click Git commit, o'zgarishlarni avtomatik aniqlash |
| 💾 **Session Management** | Sessiya holati (ochilgan fayllar, terminal tarixi, AI chat) saqlanadi — yopib qo'ysangiz, xuddi shu joydan davom ettirasiz |
| 📱 **Mobile Connectivity** | Sessiyaga telefondan ulanish — **QR kod** yoki **8-xonali tasodifiy kod** orqali |
| 🎨 **Customizable** | 10+ mavzu (VS Dark, Dracula, Monokai, GitHub Dark...) va aniq AI ruxsatnoma sozlamalari |
| 🧩 **Extension Support** | Tashqi AI provayderlarni extension (kengaytma) sifatida ulash imkoniyati |

---

## 📦 How to Use AiIDE (Ishlatish usullari)

AiIDE uch xil formatda ishlatilishi mumkin:

| Model | Tavsif | Kimlar uchun? |
|---|---|---|
| 🌐 **Web IDE** | Brauzerda to'g'ridan-to'g'ri ishlaydi. Hech narsa o'rnatish shart emas. | Har qanday foydalanuvchi, planshet, mobil |
| 💻 **Desktop IDE** | Electron asosidagi mustaqil dastur. Offline ishlaydi, mahalliy fayl tizimiga to'liq kirish. | Jiddiy dasturchilar, offline ishlash kerak bo'lganda |
| ⌨️ **Standalone Terminal** | Faqat aqlli terminal (kod muharririsiz, minimal interfeys). | CLI foydalanuvchilari, system adminlar |

Landing page'da bu uchta model uchun alohida tugmalar joylashgan:
**"Brauzerda ishlatish"**, **"Desktop'ni yuklab olish"** va **"Terminalni yuklab olish"**.

> 📄 Batafsil ma'lumot: [docs/distribution-models.md](docs/distribution-models.md)

---

## 🛠️ Tech Stack

### Frontend (`client/`)
- **React 19** + **TypeScript** + **Vite**
- **Monaco Editor** — yuqori unumdor kod tahrirlovchi
- **xterm.js** + **xterm-addon-fit** — terminal interfeysi
- **Zustand** — holat boshqaruvi (state management)
- **Socket.IO Client** — real-time kommunikatsiya
- **Tailwind CSS** — stilizatsiya
- **React Router** — sahifalar orasida navigatsiya (Landing, Login, IDE)

### Backend (`server/`)
- **Node.js** + **Express**
- **Socket.IO** — terminal I/O, fayl kuzatish va AI javoblarni streaming qilish
- **node-pty** — OS darajasidagi real terminal (PTY) ishga tushirish
- **simple-git** — Git operatsiyalari (status, stage, commit)
- **chokidar** — fayl tizimini real vaqtda kuzatish

---

## 🏗️ Architecture (Ishlash logikasi)

```
Browser / Mobile
┌────────────────────────────────────────────────────────────────────────┐
│  React Frontend (Vite)                                                 │
│  ├── Landing Page                                                      │
│  ├── Login / Register (auth)                                           │
│  └── Main IDE Window                                                   │
│       ├── File Tree (left)      ├── Monaco Editor (center)             │
│       ├── Terminal (bottom)     └── AI Chat / Agent (right)            │
│                                                                        │
│         │ HTTP (REST)           │ WebSocket (Socket.IO)                │
└─────────┼───────────────────────┼──────────────────────────────────────┘
          ▼                       ▼
Node.js Backend
┌────────────────────────────────────────────────────────────────────────┐
│  Express API (port 4001)                                               │
│  ├── /api/fs    → File System CRUD (read, write, create, delete, move) │
│  ├── /api/git   → Git status / stage / commit                          │
│  └── Socket.IO  → PTY terminal I/O + file watching + AI streaming      │
└────────────────────────────────────────────────────────────────────────┘
```

**Sessiya oqimi (Session lifecycle):**
1. Foydalanuvchi **Login/Register** orqali tizimga kiradi (auth qilinmagan bo'lsa, har doim login sahifasiga yo'naltiriladi).
2. Login paytida agar profilingizda avval saqlangan AI modellar (API kalitlar) bo'lsa, tizim so'raydi: *"Eski modellarni olib kelamizmi?"*
3. Ruxsat berilgach — **Working Directory** (asosiy ishchi papka) ochiladi.
4. Sessiya holati avto-saqlanadi; qaytib kelganingizda xuddi shu holatda davom ettirasiz.

---

## 📂 Project Structure

```
AiIDE/
├── electron/                # Desktop ilova (Electron qobig'i)
│   ├── main.js              # Asosiy jarayon (Desktop IDE)
│   ├── main-terminal.js     # Asosiy jarayon (Standalone Terminal)
│   └── package.json
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # AiPanel, CodeEditor, FileTree, TerminalUI...
│   │   ├── pages/           # IdePage, LandingPage, TerminalOnlyPage
│   │   ├── store.ts         # Zustand state store
│   │   └── AppRouter.tsx    # Routing
│   └── vite.config.ts
├── server/                  # Node.js backend
│   ├── src/
│   │   ├── pty.js           # Terminal (PTY) boshqaruvi
│   │   └── routes/          # fs.js, git.js REST endpointlar
│   └── index.js             # Express + Socket.IO server
├── docs/                    # Loyiha hujjatlari
│   ├── architecture.md
│   ├── api-design.md
│   ├── ai-agents.md
│   ├── features.md
│   ├── sessions.md
│   ├── ui-ux.md
│   └── distribution-models.md
├── bin/                     # CLI fayllar
├── prompt.md                # Loyiha prompt
└── .gitignore
```

---

## 🚀 Getting Started (Ishga tushirish)

### Prerequisites (Talab qilinadigan)
- **Node.js** 18+ va **npm**
- **Git**

### 1. Repozitori yuklab oling
```bash
git clone https://github.com/muzaffarbekmustafayev/AiIDE.git
cd AiIDE
```

### 2. Backendni (Server) ishga tushiring
```bash
cd server
npm install
npm run dev      # nodemon bilan (auto-reload)
# yoki: npm start
```
Server **http://localhost:4001** portida ishlay boshlaydi.

### 3. Frontendni (Client) ishga tushiring
```bash
cd client
npm install
npm run dev
```
Frontend **http://localhost:5173** (Vite default) portida ochiladi.

### 4. Brauzerda oching
Brauzeringizda `http://localhost:5173` ni oching → **Login/Register** → **Working Directory** tanlang → ishlay boshlang!

> 💡 **Eslatma:** `node-pty` native modul — `npm install` paytida build kerak bo'lishi mumkin (Windows'da Visual Studio Build Tools yoki prebuild ishlatiladi).

### 5. 💻 Desktop IDE sifatida (Electron)
```bash
# Asosiy katalogda (electron papkasi qo'shilgach)
npm install
npm run electron:dev      # Dev rejimida ishga tushirish
npm run electron:build    # .exe / .dmg / .deb build qilish
```

### 6. ⌨️ Standalone Terminal sifatida
```bash
npm run terminal:dev
# yoki Web IDE ichida /terminal-only manziline o'ting
```

---

## 📱 Mobile Connection (Telefonda ulanish)

Sessiyaga telefon orqali ulanish uchun:
1. IDE'da **Mobile Pairing** oynasini oching
2. Telefoningizda **QR kodni skanerlang** YOKI
3. Ekrandagi **8-xonali tasodifiy kodni** kiriting

Shundan so'ng telefonningiz kompyuterdagi sessiyaga to'g'ridan-to'g'ri ulanadi — kod va terminalni masofadan boshqarish mumkin.

---

## 🤖 AI Models & API Keys (BYOK)

- **AI Provider Connection** oynasida shaxsiy API kalitingizni (masalan, **OpenRouter**) kiriting
- Ulanishni sinab ko'ring (test connection)
- Modelni tanlab, **Chat** yoki **Agent** oyna oching
- Login qilganda avval saqlangan kalitlaringizni kutubga qaytarib olishingiz so'raladi

**AI ruxsatnomalari (Permissions):**
- `allow_file_creation` — AI yangi fayl yaratishi mumkinmi
- `allow_file_editing` — AI mavjud fayllarni o'zgartirishi mumkinmi
- `allow_terminal_execution` — AI terminal buyruqlarini ishga tushirishi mumkinmi
- `allow_package_installation` — AI npm/pip install qilishi mumkinmi

---

## 📚 Documentation

To'liq hujjatlar `docs/` papkasida:

| Hujjat | Tavsif |
|---|---|
| [System Architecture](docs/architecture.md) | Tizim arxitekturasi |
| [Features Overview](docs/features.md) | Barcha funksiyalar ro'yxati |
| [AI & Agents](docs/ai-agents.md) | AI integratsiya va agentlar |
| [API & Communication](docs/api-design.md) | REST/WS API dizayni |
| [UI / UX Design](docs/ui-ux.md) | Interfeys va oynalar dizayni |
| [Session Management](docs/sessions.md) | Sessiyalar boshqaruvi |
| [Distribution Models](docs/distribution-models.md) | Web / Desktop / Terminal — uch xil tarqatish modeli |
| [Project Prompt](prompt.md) | Loyiha prompt |

---

## 📄 License

Bu loyiha shaxsiy/talaba loyihasi sifatida yaratilgan.


