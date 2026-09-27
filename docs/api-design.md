# API & Communication Design (API Dizayni)

Loyihada **RESTful API** va **WebSockets** orqali gibrid kommunikatsiya tizimi qo'llaniladi. REST ko'pincha holatsiz (stateless) va tezkor so'rovlar uchun ishlatilsa, WebSockets real vaqt (real-time) rejimida ikki tomonlama oqim (stream) uchun kerak.

---

## 1. WebSocket Events (Socket.IO)
WebSockets ayniqsa terminal, AI javoblarini streaming qilish va mobil ulanish uchun o'ta muhimdir.

### Terminal Hodisalari (Terminal Events)
- **`pty:spawn`** *(Client -> Server)*: Yangi operatsion tizim terminali (Bash/PowerShell) ochish so'rovi.
- **`pty:data`** *(Server -> Client)*: Terminaldan kelayotgan javob matnlari (OS shell'dan `xterm.js`ga).
- **`pty:input`** *(Client -> Server)*: Foydalanuvchining klaviaturada yozgan harflari yoki buyruqlari.
- **`pty:resize`** *(Client -> Server)*: Ekran o'lchami o'zgarganda terminaldagi qator va ustunlarni (rows/cols) to'g'rilash.

### Fayl Tizimi Hodisalari (File System Events)
- **`fs:watch_change`** *(Server -> Client)*: Agar fayl muhitdan (masalan `git pull` qilinganda) tashqaridan o'zgartirilsa, frontend'ga fayllar daraxti yoki editorni yangilash haqida signal beradi.

### AI & Agent Hodisalari
- **`ai:chat_stream`** *(Server -> Client)*: AI tomonidan yozilayotgan javoblarni so'zma-so'z (typewriter effekti bilan) uzatish.
- **`agent:status_update`** *(Server -> Client)*: AI agentning orqa fonda qanday vazifa bajarayotganligini bildirish ("Faylni o'qiyapman", "npm install qilyapman").

### Mobil va Sessiya Hodisalari (Mobile & Session Events)
- **`session:join`** *(Mobile Client -> Server)*: Telefon orqali mavjud kompyuter sessiyasiga (xonaga) ulanish so'rovi.
- **`session:sync`** *(Server -> Client/Mobile)*: Yangi qurilma ulanganda joriy holatni sinxronlashtirish.

---

## 2. REST API Endpoints (Express.js)
REST API lar asosan fayllarni boshqarish va Git amallari uchun ishlatiladi. Barcha API marshrutlari (routes) `/api/` bilan boshlanadi.

### Fayllarni Boshqarish (File System API - `/api/fs`)
- **`GET /api/fs/tree?path=/`**
  - **Vazifa:** Papka va fayllarni iyerarxik tarzda (daraxt ko'rinishida) JSON formatda qaytaradi.
- **`GET /api/fs/file?path=/src/app.js`**
  - **Vazifa:** Tanlangan faylning matnini (content) o'qib, `Monaco Editor`da ko'rsatish uchun qaytaradi.
- **`POST /api/fs/file`**
  - **Body:** `{ type: "file" | "folder", path: "/newFolder", content?: "..." }`
  - **Vazifa:** Yangi fayl yoki papka yaratadi.
- **`PUT /api/fs/file`**
  - **Body:** `{ path: "/src/app.js", content: "..." }`
  - **Vazifa:** Tahrirlangan faylni saqlaydi (Save).
- **`DELETE /api/fs/file`**
  - **Body:** `{ path: "/src/old.js" }`
  - **Vazifa:** Fayl yoki papkani o'chiradi.
- **`PATCH /api/fs/move`**
  - **Body:** `{ oldPath: "/src/a.js", newPath: "/src/b.js" }`
  - **Vazifa:** Faylni qayta nomlash yoki boshqa joyga ko'chirish (drag-and-drop).

### Git Integratsiyasi API (`/api/git`)
- **`GET /api/git/status`**
  - **Vazifa:** O'zgartirilgan, qo'shilgan yoki o'chirilgan fayllar ro'yxatini (Git Status) qaytaradi.
- **`POST /api/git/commit`**
  - **Body:** `{ message: "Update UI" }`
  - **Vazifa:** Barcha o'zgarishlarni "stage" qilib, berilgan xabar bilan kommit qiladi.
- **`GET /api/git/diff?file=/src/app.js`**
  - **Vazifa:** Bitta fayldagi o'zgarishlarni (diff) qaytaradi. Editor'da oldingi va keyingi holatni yonma-yon ko'rsatish uchun ishlatiladi.

### Foydalanuvchi va AI API (`/api/user`)
- **`GET /api/user/models`**
  - **Vazifa:** Foydalanuvchi saqlab qo'ygan shaxsiy AI API kalitlarini (OpenRouter va boshqalar) yuklaydi.
- **`POST /api/user/models`**
  - **Vazifa:** Yangi BYOK (Bring Your Own Key) kalitlarini ma'lumotlar bazasiga saqlaydi.

---

## 3. Xavfsizlik va Autentifikatsiya (Security & Auth)
- **JWT Tokenlar:** Dastur vebda joylashtirilganda `/api/*` va Socket.IO so'rovlari JWT token bilan himoyalanishi kerak. (Lokal ishlaganda vaqtincha chetlab o'tilishi mumkin).
- **Path Traversal himoyasi:** `/api/fs/*` ga yuborilgan barcha yo'llar (paths) ishchi papka ichida ekanligi server tomonidan tekshiriladi (`path.resolve` orqali yuqoriga chiqib ketish taqiqlanadi).