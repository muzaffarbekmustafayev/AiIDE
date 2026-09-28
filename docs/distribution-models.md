# Mahsulot Tarqatish Modellari (Distribution Models)

AiIDE foydalanuvchilarning turli ehtiyojlariga javob berish uchun uch xil formatda taqdim etiladi. Har bir model o'zining afzalliklari va qo'llanilish sohasiga ega.

---

## 1. 🌐 Web IDE (Brauzerda ishlaydigan)

Bu AiIDE'ning asosiy va eng oson ishga tushiriladigan versiyasi. Foydalanuvchilar hech narsa o'rnatmasdan, shunchaki brauzer orqali tizimga kirib, darhol kod yozishni boshlashlari mumkin.

-   **Qo'llanilishi:** Tezkor tahrirlash, istalgan qurilmadan (jumladan, planshet va mobil telefonlardan) loyihaga kirish, o'rnatish imkoni bo'lmagan kompyuterlarda ishlash.
-   **Arxitektura:**
    -   `client/` (React) frontend Vite orqali ishga tushiriladi.
    -   `server/` (Node.js) backend alohida portda ishlaydi.
    -   Barcha fayl operatsiyalari va terminal buyruqlari server orqali amalga oshiriladi.
-   **Afzalliklari:**
    -   O'rnatish talab qilinmaydi.
    -   Platformadan mustaqil (har qanday zamonaviy brauzerda ishlaydi).
    -   Markazlashtirilgan yangilanish (foydalanuvchilar har doim eng so'nggi versiyadan foydalanadi).
-   **Cheklovlar:**
    -   Internetga ulanish talab qilinadi.
    -   Fayl tizimiga to'g'ridan-to'g'ri (native) kirish imkoniyati yo'q.

---

## 2. 💻 Desktop IDE (Yuklab olinadigan dastur)

Bu to'liq funksiyali, mustaqil ishlaydigan dastur bo'lib, **Electron** texnologiyasi asosida quriladi. U web-versiyadagi barcha imkoniyatlarni o'z ichiga oladi va qo'shimcha ravishda kompyuter resurslaridan to'liq foydalana oladi.

-   **Qo'llanilishi:** Jiddiy dasturlash, offline rejimda ishlash, mahalliy fayl tizimi bilan chuqur integratsiya.
-   **Arxitektura:**
    -   Electron "qobig'i" (wrapper) yaratiladi.
    -   Bu qobiq ilova oynasini (browser window) yaratadi va unga React `build` versiyasini (`index.html`) yuklaydi.
    -   Node.js backend ilova bilan birga, `child_process` orqali avtomatik tarzda ishga tushiriladi.
-   **Afzalliklari:**
    -   Offline ishlash imkoniyati.
    -   Mahalliy fayl tizimiga to'g'ridan-to'g'ri va tezkor kirish.
    -   Operatsion tizim bilan chuqurroq integratsiya (masalan, fayl assotsiatsiyalari).
    -   Aniq o'rnatiladigan fayllar (`.exe`, `.dmg`, `.deb`).
-   **Loyiha strukturasi:**
    ```
    AiIDE/
    ├── electron/         # Electron uchun konfiguratsiya va asosiy fayl
    │   ├── main.js
    │   └── package.json
    ├── client/             # React Frontend
    ├── server/             # Node.js Backend
    └── package.json
    ```

---

## 3. ⌨️ Standalone Terminal (Alohida Terminal Dasturi)

Bu AiIDE'ning eng yengil versiyasi bo'lib, faqat terminal funksiyasini taqdim etadi. Kod muharriri va fayl menejerisiz, faqat kuchli va aqlli terminal kerak bo'lgan foydalanuvchilar uchun mo'ljallangan.

-   **Qo'llanilishi:** Tizim administratorlari, buyruq qatori (CLI) vositalari bilan ko'p ishlaydigan dasturchilar, yoki shunchaki sessiyalarni saqlaydigan aqlli terminalni xohlaydiganlar uchun.
-   **Arxitektura:**
    -   Bu ham Electron yordamida quriladi, lekin u faqat `TerminalUI` komponentini va unga bog'liq bo'lgan logikani o'z ichiga olgan maxsus React sahifasini (`/terminal-only`) yuklaydi.
    -   Backend (`server/`) deyarli o'zgarishsiz ishlatiladi, chunki `node-pty` aynan o'sha yerda ishlaydi.
-   **Afzalliklari:**
    -   Juda yengil va tez ishga tushadi.
    -   Minimalistik va chalg'itmaydigan interfeys.
    -   AiIDE'ning sessiyalarni boshqarish va mobil ulanish kabi barcha terminal afzalliklarini saqlab qoladi.
-   **Maqsad:** Foydalanuvchilarga o'zlarining sevimli kod muharrirlari (masalan, Sublime Text, Vim) bilan birga AiIDE'ning kuchli terminalidan foydalanish imkonini berish.
