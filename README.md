**AiIDE** zamonaviy, brauzer asosidagi AI-integratsiyali IDE (Integrated Development Environment) hisoblanadi. U VS Code interfeysiga o'xshatilgan bo'lib, AI agentlar bilan birgalikda ishlay olish uchun maxsus loyihalangan.

> A modern, browser-based IDE inspired by VS Code, built to work seamlessly with AI agents, custom AI models (OpenRouter), and remote mobile access.

---

## Key Features (Asosiy imkoniyatlar)

| Feature | Tavsif |
|---|---|
| **Robust Editor** | Monaco asosidagi tahrirlovchi — JS, PY, TXT, MD va hokazo tillar sintaksislarini qo'llab-quvvatlaydi |
| **AI Native** | Integratsiyalangan AI Chat va Agent workspace, model tanlash tizimi |
| **Bring Your Own Key (BYOK)** | Shaxsiy AI API kalitlaringizni (masalan, **OpenRouter**) ulab, o'z AI modellaringiz bilan chat/agentik oynalar ochish |
| **Integrated Terminal** | Bir nechta terminal tab'lar — `xterm.js` + `node-pty` orqali real PowerShell / Bash / Zsh |
| **File Management** | To'liq ishlaydigan fayllar daraxti (yaratish, ko'chirish, o'chirish, drag-and-drop) |
| **Version Control** | 1-click Git commit, o'zgarishlarni avtomatik aniqlash |
| **Session Management** | Sessiya holati (ochilgan fayllar, terminal tarixi, AI chat) saqlanadi — yopib qo'ysangiz, xuddi shu joydan davom ettirasiz |
| **Mobile Connectivity** | Sessiyaga telefondan ulanish — **QR kod** yoki **8-xonali tasodifiy kod** orqali |
| **Customizable** | 10+ mavzu (VS Dark, Dracula, Monokai, GitHub Dark...) va aniq AI ruxsatnoma sozlamalari |
| **Extension Support** | Tashqi AI provayderlarni extension (kengaytma) sifatida ulash imkoniyati |

---

## Tech Stack

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

## Project Structure

