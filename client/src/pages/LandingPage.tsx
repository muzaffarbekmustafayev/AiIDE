import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Terminal, Code2, Sparkles, FolderTree, Check,
  ArrowRight, Globe, Monitor, Download,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-[#090b10] text-text-primary relative overflow-hidden select-none">
      {/* Ambient background blur lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-accent-blue/15 via-accent-cyan/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-accent-green/10 rounded-full blur-3xl pointer-events-none" />

      {/* Glass Navigation */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel-subtle text-xs text-text-secondary border border-white/10 mb-6 animate-fadeIn">
          <Sparkles size={13} className="text-accent-cyan" />
          <span>Kelajak dasturlash muhiti</span>
          <span className="text-white/30">|</span>
          <span className="text-accent-blue font-medium">Web · Desktop · Terminal</span>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-3xl space-y-4 mb-10 sm:mb-14">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            AI bilan boyitilgan{' '}
            <span className="bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-green bg-clip-text text-transparent">
              Kod IDE
            </span>
          </h1>
          <p className="text-sm sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Brauzeringizda darhol boshlang, kompyuteringizga yuklab oling yoki faqat
            tezkor aqlli terminalni oling — har bir ehtiyoj uchun bir model.
          </p>
        </div>

        {/* ── 3 ta asosiy CTA kartalari (Distribution Models) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl mb-14">
          
          {/* CTA 1: Brauzerda ishlatish (faol, asosiy) */}
          <div 
            onClick={() => navigate('/ide')}
            className="group relative rounded-2xl p-[1px] cursor-pointer bg-gradient-to-b from-accent-blue/60 via-white/10 to-white/5 hover:from-accent-blue hover:via-accent-cyan/50 to-white/5 transition-all"
          >
            <div className="relative rounded-2xl bg-[#0c0f1a]/95 backdrop-blur-xl p-6 sm:p-7 flex flex-col justify-between h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/10 rounded-bl-full blur-2xl group-hover:bg-accent-blue/25 transition-all pointer-events-none" />
              <div className="absolute -top-2.5 left-5 flex">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-accent-blue to-accent-cyan text-slate-950">
                  Asosiy
                </span>
              </div>
              <div className="mt-3">
                <div className="w-12 h-12 rounded-xl bg-accent-blue/15 border border-accent-blue/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Globe size={24} className="text-accent-blue" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Brauzerda ishlatish</h2>
                <p className="text-xs text-text-secondary leading-relaxed mb-5">
                  Hech narsa o'rnatish shart emas. To'liq Web IDE — Monaco muharrir,
                  fayllar daraxti, PTY terminal va AI agent bir klikda ochiladi.
                </p>
                <ul className="space-y-1.5 text-[11px] text-text-secondary mb-1">
                  {['Hisob yaratish talab qilinmaydi', 'Har qanday qurilmada ishlaydi'].map((t) => (
                    <li key={t} className="flex items-center gap-1.5">
                      <Check size={12} className="text-accent-green flex-shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-between pt-4 mt-5 border-t border-white/5">
                <span className="text-xs font-semibold text-accent-blue flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  IDE-ni ochish <ArrowRight size={14} />
                </span>
                <span className="text-[11px] text-text-muted">Darhol</span>
              </div>
            </div>
          </div>

          {/* CTA 2: Desktop'ni yuklab olish (yakunlanmoqda) */}
          <div
            className="group relative rounded-2xl glass-card p-6 sm:p-7 flex flex-col justify-between h-full cursor-not-allowed opacity-80"
            title="Birinchilari orasida bo'lish — tez orada!"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 rounded-bl-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-accent-cyan/15 border border-accent-cyan/20 flex items-center justify-center mb-4">
                  <Monitor size={24} className="text-accent-cyan" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/25">
                  Tez orada
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Desktop'ni yuklab olish</h2>
              <p className="text-xs text-text-secondary leading-relaxed mb-5">
                Electron asosidagi mustaqil dastur. Offline ishlash, mahalliy fayl
                tizimiga to'liq kirish va tarmoq talab qilmaydigan AI agent.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['Windows .exe', 'macOS .dmg', 'Linux .AppImage'].map((os) => (
                  <span key={os} className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 border border-white/10 text-text-muted">
                    {os}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 mt-5 border-t border-white/5">
              <span className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
                <Download size={14} /> Yuklab olish
              </span>
              <span className="text-[11px] text-text-muted">Electron build</span>
            </div>
          </div>

          {/* CTA 3: Terminalni yuklab olish (yakunlanmoqda) */}
          <div
            className="group relative rounded-2xl glass-card p-6 sm:p-7 flex flex-col justify-between h-full cursor-not-allowed opacity-80"
            title="Birinchilari orasida bo'lish — tez orada!"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-green/10 rounded-bl-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-accent-green/15 border border-accent-green/20 flex items-center justify-center mb-4">
                  <Terminal size={24} className="text-accent-green" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/25">
                  Tez orada
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Terminalni yuklab olish</h2>
              <p className="text-xs text-text-secondary leading-relaxed mb-5">
                Eng yengil versiya — faqat aqlli terminal. Kod muharririsiz,
                minimal interfeys, sessiyalar va mobil ulanish saqlanadi.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['Yengil va tez', 'CLI uchun'].map((os) => (
                  <span key={os} className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 border border-white/10 text-text-muted">
                    {os}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 mt-5 border-t border-white/5">
              <span className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
                <Download size={14} /> Yuklab olish
              </span>
              <span className="text-[11px] text-text-muted">Yoki</span>
              <button
                onClick={(e) => { e.stopPropagation(); navigate('/terminal'); }}
                className="text-[11px] font-semibold text-accent-green hover:underline"
              >
                Brauzerda sinash →
            </button>
            </div>
          </div>

        </div>

        {/* Feature Highlights Grid (Responsive Glassmorphism) */}
        <div className="w-full max-w-5xl">
          <div className="text-center mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Asosiy afzalliklar
            </h3>
    </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel-subtle rounded-xl p-4 border border-white/5 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-accent-blue/15 flex items-center justify-center text-accent-blue mb-2">
                <Code2 size={16} />
              </div>
              <h4 className="text-sm font-semibold text-white">Monaco Dvigateli</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                VS Code asosidagi sintaksis ta'kidlash va qulay avtomatik saqlash.
              </p>
            </div>

            <div className="glass-panel-subtle rounded-xl p-4 border border-white/5 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-accent-green/15 flex items-center justify-center text-accent-green mb-2">
                <Terminal size={16} />
              </div>
              <h4 className="text-sm font-semibold text-white">PTY Terminal</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Haqiqiy xterm.js interaktiv sessiyasi va klaviatura yordamchilari.
              </p>
            </div>

            <div className="glass-panel-subtle rounded-xl p-4 border border-white/5 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-accent-cyan/15 flex items-center justify-center text-accent-cyan mb-2">
                <FolderTree size={16} />
              </div>
              <h4 className="text-sm font-semibold text-white">Fayllar Boshqaruvi</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Fayl va papkalarni yaratish, tahrirlash, qayta nomlash va o'chirish.
              </p>
            </div>

            <div className="glass-panel-subtle rounded-xl p-4 border border-white/5 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-accent-yellow/15 flex items-center justify-center text-accent-yellow mb-2">
                <Sparkles size={16} />
              </div>
              <h4 className="text-sm font-semibold text-white">AI Agent & Chat</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Kod tahlili, xatolarni tuzatish va avtomatik kod yozish yordami.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Glass Footer */}
      <footer className="w-full glass-nav border-t border-white/10 py-5 px-4 sm:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            <span>AiIDE — AI-Powered Code IDE</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/docs')} className="hover:text-white transition-colors">
              Hujjatlar
            </button>
            <span>·</span>
            <button onClick={() => navigate('/terminal')} className="hover:text-white transition-colors">
              Terminal
            </button>
            <span>·</span>
            <button onClick={() => navigate('/ide')} className="hover:text-white transition-colors">
              Web IDE
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

