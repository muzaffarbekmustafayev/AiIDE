import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { 
  BookOpen, Terminal, Code2, Sparkles, FolderGit2, Cpu, 
  Command, ChevronRight, Check, Copy, ExternalLink 
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const DocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const sections = [
    { id: 'overview', title: 'Umumiy maʼlumot', icon: BookOpen },
    { id: 'features', title: 'IDE Imkoniyatlari', icon: Code2 },
    { id: 'terminal', title: 'Terminal & PTY', icon: Terminal },
    { id: 'ai-agent', title: 'AI Assistant & Agent', icon: Sparkles },
    { id: 'cli', title: 'CLI & Buyruqlar', icon: Command },
    { id: 'shortcuts', title: 'Klaviatura tugmalari', icon: Cpu },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#090b10] text-text-primary relative overflow-hidden">
      {/* Background ambient lighting for glassmorphism */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar (Glassmorphic) */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="glass-panel rounded-2xl p-4 sticky top-20">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted px-3 mb-3">
              Mundarija
            </h3>
            <nav className="space-y-1">
              {sections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                      isActive
                        ? 'bg-accent-blue/15 text-white border border-accent-blue/30 shadow-sm'
                        : 'text-text-secondary hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className={isActive ? 'text-accent-blue' : 'text-text-muted'} />
                      <span>{sec.title}</span>
                    </div>
                    {isActive && <ChevronRight size={13} className="text-accent-blue" />}
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 pt-4 border-t border-white/10">
              <NavLink
                to="/ide"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold glass-button-primary text-white"
              >
                <Code2 size={14} /> IDE-ni ishga tushirish
              </NavLink>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-8">
            
            {activeSection === 'overview' && (
              <section className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">AI IDE — Kelajak dasturlash muhiti</h1>
                  <p className="mt-2 text-text-secondary leading-relaxed">
                    AI IDE — brauzer orqali to'g'ridan-to'g'ri masofaviy yoki mahalliy loyihalarda ishlash, Monaco Editor orqali kod yozish, WebSockets PTY orqali to'liq terminal imkoniyatlaridan foydalanish va AI yordamchisi bilan tezkor ishlash imkonini beruvchi kuchli bulutli ish stoli.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="glass-panel-subtle rounded-xl p-4 border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-accent-blue/20 flex items-center justify-center text-accent-blue mb-3">
                      <Code2 size={18} />
                    </div>
                    <h3 className="font-semibold text-white text-sm">Monaco Code Editor</h3>
                    <p className="text-xs text-text-secondary mt-1">
                      VS Code dvigateli asosidagi to'liq sintaksis ta'kidlash, avtosaqlash va qulay tahrirlovchi.
                    </p>
                  </div>

                  <div className="glass-panel-subtle rounded-xl p-4 border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-accent-cyan/20 flex items-center justify-center text-accent-cyan mb-3">
                      <Terminal size={18} />
                    </div>
                    <h3 className="font-semibold text-white text-sm">Haqiqiy xterm.js Terminal</h3>
                    <p className="text-xs text-text-secondary mt-1">
                      Server PTY ga real-vaqtda ulangan interaktiv shell orqali istalgan CLI vositalarini ishga tushiring.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'features' && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white">IDE Imkoniyatlari</h2>
                <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
                  <p>
                    AI IDE tizimi zamonaviy dasturchi uchun zarur bo'lgan barcha vositalarni bitta yagona oynada birlashtiradi:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-md bg-accent-green/20 flex items-center justify-center text-accent-green flex-shrink-0 mt-0.5">
                        <Check size={12} />
                      </div>
                      <div>
                        <strong className="text-white">Interaktiv Fayllar Daraxti (Explorer):</strong> Fayl va papkalarni yaratish, qayta nomlash, o'chirish va bir marta bosish orqali tahrirga ochish.
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-md bg-accent-green/20 flex items-center justify-center text-accent-green flex-shrink-0 mt-0.5">
                        <Check size={12} />
                      </div>
                      <div>
                        <strong className="text-white">Avtomatik Saqlash:</strong> Har qanday kiritilgan o'zgarish darhol xavfsiz backend API orqali diskka saqlanadi.
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-md bg-accent-green/20 flex items-center justify-center text-accent-green flex-shrink-0 mt-0.5">
                        <Check size={12} />
                      </div>
                      <div>
                        <strong className="text-white">Git Status integratsiyasi:</strong> O'zgarishlar va repo holatini to'g'ridan-to'g'ri server orqali kuzatish imkoniyati.
                      </div>
                    </li>
                  </ul>
                </div>
              </section>
            )}

            {activeSection === 'terminal' && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Terminal va PTY Arxitekturasi</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Terminal brauzerda <code className="text-accent-cyan font-mono">xterm.js</code> va serverda <code className="text-accent-blue font-mono">Socket.IO</code> orqali ikki tomonlama oqim (bidirectional duplex stream) orqali ishlaydi.
                </p>

                <div className="bg-slate-950/80 rounded-xl p-4 font-mono text-xs text-text-primary border border-white/10 space-y-2">
                  <div className="text-accent-green"># Masofaviy terminal orqali tizim buyruqlarini tekshirish:</div>
                  <div className="text-white">$ uname -a</div>
                  <div className="text-white">$ git status</div>
                  <div className="text-white">$ npm run build</div>
                </div>
              </section>
            )}

            {activeSection === 'ai-agent' && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white">AI Assistant va Agent</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Yon paneldagi AI Assistant yordamida kodingizni tahlil qiling, xatolarni tuzating yoki avtomatlashtirilgan Agent rejimida yangi funksiyalar yarating.
                </p>
                <div className="glass-panel-subtle p-4 rounded-xl border border-white/10 space-y-2">
                  <h4 className="text-sm font-semibold text-white">Rejimlar:</h4>
                  <ul className="text-xs text-text-secondary space-y-1.5 list-disc list-inside">
                    <li><strong className="text-accent-blue">Chat rejimi:</strong> Savol-javob, kod tushuntirish, arxitektura maslahatlari.</li>
                    <li><strong className="text-accent-cyan">Agent rejimi:</strong> Avtomatik fayl generatsiyasi, testlar yozish va refaktoring.</li>
                  </ul>
                </div>
              </section>
            )}

            {activeSection === 'cli' && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white">CLI O'rnatish va Ishga tushirish</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Lokal mashinangizda AI IDE-ni ishga tushirish uchun quyidagi buyruqdan foydalaning:
                </p>

                <div className="relative group">
                  <div className="bg-slate-950/90 rounded-xl p-4 font-mono text-xs text-emerald-400 border border-white/10 flex items-center justify-between">
                    <code>npx @aiide/cli start --port 3000</code>
                    <button
                      onClick={() => copyToClipboard('npx @aiide/cli start --port 3000')}
                      className="p-1.5 rounded-lg glass-button text-text-muted hover:text-white"
                      title="Nusxalash"
                    >
                      {copiedCmd === 'npx @aiide/cli start --port 3000' ? <Check size={14} className="text-accent-green" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'shortcuts' && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Klaviatura Tugmalari</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-text-muted">
                        <th className="py-2.5 font-medium">Amal</th>
                        <th className="py-2.5 font-medium">Tugmalar kombinatsiyasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-text-secondary">
                      <tr>
                        <td className="py-3 text-white font-medium">Faylni saqlash</td>
                        <td className="py-3"><kbd className="px-2 py-1 rounded bg-white/10 text-white font-mono text-[11px]">Ctrl + S</kbd> / <kbd className="px-2 py-1 rounded bg-white/10 text-white font-mono text-[11px]">⌘ + S</kbd></td>
                      </tr>
                      <tr>
                        <td className="py-3 text-white font-medium">Terminalni tozalash</td>
                        <td className="py-3"><kbd className="px-2 py-1 rounded bg-white/10 text-white font-mono text-[11px]">Ctrl + L</kbd></td>
                      </tr>
                      <tr>
                        <td className="py-3 text-white font-medium">Buyruqni bekor qilish</td>
                        <td className="py-3"><kbd className="px-2 py-1 rounded bg-white/10 text-white font-mono text-[11px]">Ctrl + C</kbd></td>
                      </tr>
                      <tr>
                        <td className="py-3 text-white font-medium">AI Chat-ga xabar yuborish</td>
                        <td className="py-3"><kbd className="px-2 py-1 rounded bg-white/10 text-white font-mono text-[11px]">Enter</kbd> (Yangi qator: <kbd className="px-2 py-1 rounded bg-white/10 text-white font-mono text-[11px]">Shift + Enter</kbd>)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};
