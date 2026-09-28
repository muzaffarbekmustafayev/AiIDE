import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Terminal, Code2, Sparkles, FolderTree, Cpu, Check, 
  ArrowRight, ShieldCheck, Zap, BookOpen 
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useEditorStore } from '../store';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { workspaceRoot } = useEditorStore();

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
          <span>Kelajak dasturlash muhiti — Web & Bulut</span>
          <span className="text-white/30">|</span>
          <span className="text-accent-blue font-medium">v1.0 Pro</span>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-3xl space-y-4 mb-10 sm:mb-14">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            AI bilan boyitilgan{' '}
            <span className="bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-green bg-clip-text text-transparent">
              Bulutli IDE
            </span>
          </h1>
          <p className="text-sm sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Brauzeringizda to'liq quvvatli kod muharriri, tezkor WebSockets terminali, interaktiv fayllar daraxti va sun'iy intellekt agenti.
          </p>
        </div>

        {/* Action Cards (Glassmorphism) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-14">
          
          {/* Option 1: Full IDE */}
          <div 
            onClick={() => navigate('/ide')}
            className="group glass-card rounded-2xl p-6 sm:p-8 cursor-pointer flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/10 rounded-bl-full blur-2xl group-hover:bg-accent-blue/20 transition-all pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent-blue/15 border border-accent-blue/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Code2 size={24} className="text-accent-blue" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-accent-blue transition-colors">
                To'liq Web IDE
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                Monaco Editor, Explorer daraxti, ikkitomonlama PTY terminal va AI Agent paneli bitta mukammal ish stolida.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="text-xs font-semibold text-accent-blue flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                IDE-ni ochish <ArrowRight size={14} />
              </span>
              <span className="text-[11px] text-text-muted">Desktop & Planshet</span>
            </div>
          </div>

          {/* Option 2: Terminal Only */}
          <div 
            onClick={() => navigate('/terminal')}
            className="group glass-card rounded-2xl p-6 sm:p-8 cursor-pointer flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 rounded-bl-full blur-2xl group-hover:bg-accent-cyan/20 transition-all pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent-cyan/15 border border-accent-cyan/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Terminal size={24} className="text-accent-cyan" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-accent-cyan transition-colors">
                Terminal Rejimi
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                Faqat buyruqlar satri kerakmi? To'liq ekranli, mobilga moslashuvchan, tezkor masofaviy terminal sessiyasi.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="text-xs font-semibold text-accent-cyan flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                Terminalni ishga tushirish <ArrowRight size={14} />
              </span>
              <span className="text-[11px] text-text-muted">Tezkor Shell</span>
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
            <span>AI IDE Bulut Ish Stoli</span>
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
