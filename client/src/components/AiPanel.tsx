import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Wand2, Terminal, Code2, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

const quickPrompts = [
  "Ushbu fayldagi kodni tahlil qil va optimallashtir",
  "Ushbu kod uchun TypeScript interfeyslari yoz",
  "Xatoliklarni tekshir va tavsiyalar ber",
  "README hujjati uchun qisqacha tavsif tuz"
];

const AiPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'ai', 
      content: "Assalomu alaykum! Men AI IDE dasturlash yordamchisiman. Kodingizni tahlil qilish, yangi funksiyalar yozish yoki terminal buyruqlarida yordam berishim mumkin.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'chat' | 'agent'>('chat');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newUserMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: query,
      timestamp: time
    };

    setMessages(prev => [...prev, newUserMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      if (mode === 'agent') {
        reply = `[Agent Mode]: Vazifa qabul qilindi: "${query}". Fayllar strukturasi tahlil qilinmoqda...`;
      } else {
        reply = `Tahlil natijasi: Kodingiz yaxshi strukturalangan. Taklif: komponentlararo holatni boshqarish uchun mavjud Zustand do'konidan foydalanish va reaktiv yangilanishlarni to'g'ri ta'minlash maqsadga muvofiq.`;
      }

      const aiResponse: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'ai', 
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 900);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      { 
        id: Date.now().toString(), 
        role: 'ai', 
        content: "Chat tarixi tozalandi. Qanday vazifani bajaramiz?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="flex flex-col h-full glass-panel-subtle text-text-primary select-none overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center px-3.5 py-2.5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-1.5 p-0.5 rounded-lg bg-black/40 border border-white/5">
          <button 
            onClick={() => setMode('chat')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              mode === 'chat'
                ? 'bg-accent-blue/20 text-white border border-accent-blue/30 shadow-sm'
                : 'text-text-muted hover:text-white'
            }`}
          >
            <Bot size={13} className={mode === 'chat' ? 'text-accent-blue' : ''} />
            <span>Chat</span>
          </button>

          <button 
            onClick={() => setMode('agent')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              mode === 'agent'
                ? 'bg-accent-cyan/20 text-white border border-accent-cyan/30 shadow-sm'
                : 'text-text-muted hover:text-white'
            }`}
          >
            <Wand2 size={13} className={mode === 'agent' ? 'text-accent-cyan' : ''} />
            <span>Agent</span>
          </button>
        </div>

        <button 
          onClick={clearChat}
          className="p-1 rounded-md glass-button text-text-muted hover:text-red-400 transition-colors"
          title="Chatni tozalash"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div 
              key={msg.id} 
              className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                isUser 
                  ? 'bg-accent-blue/20 border border-accent-blue/40 text-accent-cyan' 
                  : 'bg-white/5 border border-white/10 text-accent-blue'
              }`}>
                {isUser ? <User size={14} /> : <Bot size={14} />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed space-y-1 ${
                isUser 
                  ? 'glass-card border-accent-blue/25 text-white' 
                  : 'glass-panel text-text-primary'
              }`}>
                <div className="whitespace-pre-wrap select-text font-sans">
                  {msg.content}
                </div>
                <div className={`text-[10px] text-text-muted text-right ${isUser ? 'text-accent-blue/70' : ''}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-text-muted pl-9">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] ml-1">AI javob tayyorlamoqda...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested quick chips */}
      {messages.length <= 2 && (
        <div className="px-3.5 py-2 border-t border-white/5 bg-white/[0.01]">
          <span className="text-[10px] text-text-muted block mb-1.5">Tezkor takliflar:</span>
          <div className="flex flex-wrap gap-1">
            {quickPrompts.slice(0, 2).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-[10px] text-text-secondary hover:text-white glass-panel-subtle px-2 py-1 rounded-md text-left truncate max-w-full"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 border-t border-white/5 bg-black/40">
        <div className="glass-input rounded-xl p-1.5 flex items-end gap-1.5 focus-within:border-accent-blue/50">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode === 'chat' ? "Savol yoki buyruq bering..." : "Agent uchun vazifani bayon qiling..."}
            rows={1}
            className="flex-1 bg-transparent border-none text-white placeholder:text-text-muted p-1.5 text-xs outline-none resize-none max-h-24 font-sans leading-relaxed"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="p-2 rounded-lg glass-button-primary text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
            title="Yuborish"
          >
            <Send size={13} />
          </button>
        </div>
        <div className="text-[10px] text-text-muted mt-1.5 text-center flex items-center justify-between px-1">
          <span>Enter — yuborish</span>
          <span>Shift+Enter — yangi qator</span>
        </div>
      </div>

    </div>
  );
};

export default AiPanel;
