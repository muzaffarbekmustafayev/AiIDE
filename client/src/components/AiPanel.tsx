import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Settings, Sparkles } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
}

const AiPanel: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'ai', content: 'Hello! I am your AI assistant. How can I help you code today?' }
    ]);
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<'chat' | 'agent'>('chat');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, newUserMsg]);
        setInput('');

        // Simulate AI response for now
        setTimeout(() => {
            const aiResponse: Message = { 
                id: (Date.now() + 1).toString(), 
                role: 'ai', 
                content: `Simulated response in ${mode} mode for: "${newUserMsg.content}"` 
            };
            setMessages(prev => [...prev, aiResponse]);
        }, 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-bg-alt text-text-primary">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-border">
                <div className="flex gap-2 bg-bg rounded-lg p-1">
                    <button 
                        onClick={() => setMode('chat')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] transition-all duration-200 font-medium ${
                            mode === 'chat'
                                ? 'bg-border-hover text-white'
                                : 'text-text-secondary hover:text-text-primary hover:bg-bg'
                        }`}
                    >
                        <Bot size={14} className={mode === 'chat' ? 'text-accent-blue' : 'text-text-secondary'} /> Chat
                    </button>
                    <button 
                        onClick={() => setMode('agent')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] transition-all duration-200 font-medium ${
                            mode === 'agent'
                                ? 'bg-border-hover text-white'
                                : 'text-text-secondary hover:text-text-primary hover:bg-bg'
                        }`}
                    >
                        <Sparkles size={14} className={mode === 'agent' ? 'text-accent-cyan' : 'text-text-secondary'} /> Agent
                    </button>
                </div>
                <Settings size={16} className="text-text-secondary hover:text-text-primary cursor-pointer transition-colors" />
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                            msg.role === 'user'
                                ? 'bg-gradient-to-br from-accent-blue to-accent-cyan shadow-lg shadow-accent-blue/30'
                                : 'bg-border-hover'
                        }`}>
                            {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-accent-blue" />}
                        </div>
                        <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-bg rounded-xl border border-border p-2.5 pr-3.5' : 'p-1.5'} text-[14px] leading-relaxed break-words ${
                            msg.role === 'user'
                                ? 'rounded-tr-xs rounded-bl-xl'
                                : 'rounded-tl-xs rounded-br-xl'
                        }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-bg">
                <div className="flex bg-bg-alt rounded-xl border border-border p-1 transition-colors duration-200"
                onFocus={(e) => e.currentTarget.style.borderColor = '#4facfe'}
                     onBlur={(e) => e.currentTarget.style.borderColor = '#1e2130'}>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={mode === 'chat' ? "Ask the AI..." : "Describe a task for the Agent..."}
                        className="flex-1 bg-transparent border-none text-white placeholder:text-text-muted p-3 text-[14px] resize-none min-h-[44px] outline-none font-sans leading-relaxed"
                        style={{ fontFamily: 'inherit' }}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className={`flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                            input.trim()
                                ? 'bg-gradient-to-r from-accent-blue to-accent-cyan text-white cursor-pointer'
                                : 'bg-border-hover text-text-muted cursor-not-allowed'
                        }`}
                    >
                        <Send size={16} />
                    </button>
                </div>
                <div className="text-[11px] text-text-muted mt-2 text-center">
                    {mode === 'agent' ? "Agent can create/edit files automatically." : "Press Enter to send (Shift+Enter for new line)"}
                </div>
            </div>
        </div>
    );
};

export default AiPanel;