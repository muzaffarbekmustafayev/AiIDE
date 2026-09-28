import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Home, Code2, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#090b10] text-text-primary relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-blue/15 rounded-full blur-3xl pointer-events-none" />

      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="glass-card max-w-md w-full p-8 rounded-2xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-blue font-mono text-2xl font-bold">
            404
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Sahifa topilmadi</h1>
            <p className="mt-2 text-xs text-text-secondary leading-relaxed">
              Siz qidirayotgan manzil mavjud emas yoki boshqa joyga ko'chirilgan bo'lishi mumkin.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <NavLink
              to="/"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold glass-button text-white"
            >
              <Home size={14} /> Bosh sahifa
            </NavLink>
            <NavLink
              to="/ide"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold glass-button-primary text-white"
            >
              <Code2 size={14} /> IDE-ga o'tish
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};
