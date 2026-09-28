# Tizim Arxitekturasi (System Architecture)

Bu loyiha **Client-Server** arxitekturasida qurilgan bo'lib, veb-brauzer orqali kompyuterni (yoki serverni) boshqarish imkonini beruvchi IDE hisoblanadi. Arxitektura asosan ikki qismdan iborat: **React Frontend** va **Node.js Backend**.

Ushbu qismlar bir-biri bilan ikkita asosiy kanal orqali bog'lanadi:
1. **HTTP/REST API:** Statik va tezkor so'rovlar uchun (fayllarni o'qish/saqlash, Git status).
2. **WebSockets (Socket.IO):** Real vaqt rejimida (real-time) oqimlar uchun (terminal kiritish/chiqarish, fayl o'zgarishlarini kuzatish, AI matnini generatsiya qilish, mobil ulanish).

---

## 1. Frontend (Client-side)
Frontend Vite + React 19 yordamida yozilgan. U interfeysni chizish va holatni boshqarish uchun javobgardir.

**Asosiy kutubxonalar va qismlar:**
- **State Management (Zustand):** Foydalanuvchi sessiyasini boshqaradi. Qaysi fayllar ochilganligi, terminallar soni, ochiq tablar holati, ishchi papka (workspace) va tanlangan AI modellari markaziy omborda (store) saqlanadi.
- **Code Editor (Monaco Editor):** VS Code ishlatadigan dvigatel. Frontend ushbu kutubxona orqali sintaksisni ajratib ko'rsatish (syntax highlighting), xatolarni topish va kodni formatlashni amalga oshirishi mumkin.
- **Terminal UI (xterm.js):** Brauzer ichida terminal interfeysini ko'rsatadi. Bu shunchaki "ekran" bo'lib, foydalanuvchining klaviatura bosishlarini `pty:input` WebSockets hodisasi orqali backend'ga jo'natadi.
- **Sahifalar (Pages):**
  - `LandingPage`: Loyihani tanishtiruvchi sahifa.
  - `IdePage`: Asosiy ishchi stol (IDE). Bu yerda barcha modullar birlashadi.
  - `MobilePairing`: Sessiyaga telefonni ulash uchun QR kod ko'rsatuvchi oyna.

---

## 2. Backend (Server-side)
Backend kompyuterning operatsion tizimi (OS) bilan to'g'ridan-to'g'ri aloqa qiladi.

**Asosiy modullar va qismlar:**
- **File System (FS) Moduli:** Tizimdagi qattiq disk bilan ishlash. Backend maxsus `/api/fs/...` endpoint'lari yordamida fayl yaratish, o'qish, ko'chirish va o'chirish operatsiyalarini bajaradi. Ruxsatsiz papkalarga kirishni oldini olish uchun (Path Traversal) qat'iy nazorat mavjud.
- **Terminal Dvigateli (node-pty):** `xterm.js` faqat brauzerda ekran vazifasini o'taydi, aslida komandani kompyuterda ishga tushiradigan qism `node-pty` hisoblanadi. U operatsion tizimda haqiqiy jarayon (process) ochadi — Windows'da `powershell.exe`, Linux'da `bash`.
- **Git Integratsiyasi (simple-git):** Loyihaning versiyalarini boshqarish, fayllardagi o'zgarishlarni topish va kommit qilish uchun standart `git` buyruqlarini dasturiy tarzda chaqiradi.
- **Chokidar (File Watcher):** Papkadagi fayllar agar boshqa dastur tomonidan o'zgartirilsa, backend buni sezadi va Socket.IO orqali brauzerga xabar beradi.

---

## 3. Ma'lumotlar oqimi (Data Flow)

### 3.1. Foydalanuvchi tizimga kirganda (Authentication Flow)
1. Foydalanuvchi frontendda Login qiladi.
2. Token (JWT) tasdiqlangach, frontend backendga `GET /api/user/models` so'rovini yuboradi.
3. Backend foydalanuvchining avvalgi ulab qo'ygan OpenRouter kalitlarini qaytaradi.
4. "Workspace" ochiladi va `GET /api/fs/tree` orqali papkadagi barcha fayllar ro'yxati (daraxt) yuklanadi.

### 3.2. Fayl saqlash (File Save Flow)
1. Foydalanuvchi Monaco Editorda kod yozadi va `Ctrl+S` bosadi.
2. Frontend `PUT /api/fs/file` orqali faylning yangi tarkibini backend'ga yuboradi.
3. Backend diskdagi faylni yangilaydi.
4. Agar AI agent kuzatib turgan bo'lsa, u yangi o'zgarishlarni o'qiydi.

### 3.3. Terminalda buyruq ishga tushirish (Terminal Flow)
1. Frontend'da foydalanuvchi terminal tabini ochganda, Socket.IO orqali `pty:spawn` jo'natiladi.
2. Backend `node-pty` orqali yangi PowerShell/Bash ochadi.
3. Foydalanuvchi klaviaturada "l", "s", "Enter" bossa, ular `pty:input` eventi orqali backend'ga boradi.
4. Bash natijani (`ls` natijasini) chiqaradi va backend uni `pty:data` eventi bilan frontend'ga qaytaradi.
5. `xterm.js` qora ekranga natijani chizadi.

---

## 4. Mobile & Remote Access (Mobil ulanish arxitekturasi)
Bu imkoniyat Socket.IO **"Rooms"** (Xonalar) xususiyati yordamida qurilgan:
1. Asosiy kompyuterdagi IDE ochilganda o'ziga xos **Session ID** generatsiya qiladi.
2. Telefon kamerasi orqali QR kod skaner qilinganda, u ham shu Session ID ga tegishli xonaga kiradi.
3. Telefon va kompyuter bitta Socket xonasida bo'lganligi sababli, telefon brauzeridan yuborilgan buyruq to'g'ridan-to'g'ri kompyuterdagi backend'ga borib tushadi. Kompyuter ekrani esa sinxron ravishda o'zgaradi.

---

## 5. Tarqatish modellari (Distribution Models)

AiIDE bir xil kod bazeasidan uch xil mahsulot sifatida tarqatiladi (batafsil: [distribution-models.md](distribution-models.md)):

### 5.1. Web IDE (brauzer)
- Frontend: Vite dev-server yoki build qilingan `dist/` fayllar.
- Backend: alohida Node.js jarayoni (`localhost:4001`).
- Foydalanuvchi `http://localhost:5173` (yoki deploy qilingan manzil) orqali ulanadi.

### 5.2. Desktop IDE (Electron)
- **Electron main process** (`electron/main.js`):
  - Ilova oynasini yaratadi va unga React `build` natijasini (`client/dist/index.html`) yuklaydi.
  - `child_process.fork()` orqali `server/index.js` ni avtomatik ishga tushiradi (`PORT=4001` bilan).
  - Ilova yopilganda server jarayonini ham yakunlaydi.
- **Yakuniy build:** `electron-builder` yordamida:
  - Windows → `.exe` (NSIS installer + portable)
  - macOS → `.dmg`
  - Linux → `.AppImage` / `.deb`
- Barcha funksiyalar (fayl tizimi, terminal, Git, mobil ulanish) to'liq ishlayveradi, chunki backend shu kompyuterda ishlaydi.

### 5.3. Standalone Terminal
- Shu Electron qobig'ida, lekin boshqa `mainTerminal.js` kiritiladi:
  - Electron oynasi faqat `/terminal-only` routing'ga qaratiladi.
  - Ilova devori minimal (title bar + terminal paneli) bo'ladi.
  - Backendda atigi `pty` va `socket` modullari faollashtiriladi (fayl CRUD va Git endpoint'lari yo'q sayqali qoldirilishi mumkin, lekin ulanish shart emas).

> **Xavfsizlik (barcha modellarda):** Backend faqat `localhost` portida tinglaydi (`0.0.0.0` emas), shuning uchun tarmoqdagi boshqa qurilmalardan bevosita ulanish imkoni yo'q (mobil ulanish shu tizim ichidagi Socket.IO rooms orqali amalga oshiriladi).

---
## 6. Security & Isolation (Xavfsizlik)
- **Path Isolation:** Foydalanuvchi tanlagan ishchi papkadan (Working Directory) tashqaridagi fayllarni backend o'qimaydi.
- **AI Permissions:** AI agenti buyruqlarni ishga tushirishidan oldin `isTerminalAllowed` kabi boolein qiymatlar tekshiriladi.
- **Desktop (Electron) rejim:** Agar bu dastur Electron orqali Desktop ilova qilinsa, Express server kompyuterning mahalliy `localhost` portida yopiladi va faqat dastur ichidan ruxsat etiladi.