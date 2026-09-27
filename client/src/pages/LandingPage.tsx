import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Code2, Cloud, HardDriveDownload } from 'lucide-react';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const cardHover = (e: React.MouseEvent<HTMLDivElement>, color: 'blue' | 'cyan') => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = color === 'blue'
            ? '0 10px 30px rgba(79, 172, 254, 0.2)'
            : '0 10px 30px rgba(0, 242, 254, 0.2)';
};
    const cardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-bg text-white font-sans">

            <div className="text-center mb-16 max-w-3xl">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent">
                    AI-Powered Developer Workspace
                </h1>
                <p className="text-text-secondary text-xl leading-relaxed">
                    Connect to your remote environment, chat with AI agents, and code seamlessly in your browser.
                </p>
            </div>

            <div className="flex flex-wrap gap-8 justify-center max-w-5xl px-4">

                {/* Option 1: Full IDE */}
                <div 
                    onClick={() => navigate('/ide')}
                    onMouseEnter={(e) => cardHover(e, 'blue')}
                    onMouseLeave={cardLeave}
                    className="bg-bg-alt rounded-xl p-8 w-[300px] cursor-pointer transition-all duration-200 border border-border flex flex-col items-center text-center hover:border-accent-blue/50"
                >
                    <div className="bg-border-hover rounded-full p-4 mb-6">
                        <Code2 size={40} className="text-accent-blue" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-3 text-white">Open Web IDE</h2>
                    <p className="text-text-secondary text-base leading-relaxed">
                        Launch the full editor with File Tree, Monaco Editor, and the AI Agent Chat panel. Ideal for deep work.
                    </p>
                </div>

                {/* Option 2: Terminal Only */}
                <div 
                    onClick={() => navigate('/terminal')}
                    onMouseEnter={(e) => cardHover(e, 'cyan')}
                    onMouseLeave={cardLeave}
                    className="bg-bg-alt rounded-xl p-8 w-[300px] cursor-pointer transition-all duration-200 border border-border flex flex-col items-center text-center hover:border-accent-cyan/50"
                >
                    <div className="bg-border-hover rounded-full p-4 mb-6">
                        <Terminal size={40} className="text-accent-cyan" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-3 text-white">Terminal Mode</h2>
                    <p className="text-text-secondary text-base leading-relaxed">
                        Just need the command line? Open a fast, full-screen remote terminal instance.
                    </p>
                </div>

            </div>

            {/* Status Indicator for Hosted Backend */}
            <div className="mt-16 flex items-center gap-2 text-accent-green text-sm">
                <Cloud size={16} /> Server Connected: localhost:4001
            </div>

            <div className="mt-5 text-text-secondary text-sm flex items-center gap-2">
               <HardDriveDownload size={14} /> Prefer Desktop? Run <code className="bg-bg px-1.5 rounded text-accent-blue font-mono">npm i -g @aiide/cli && mzfck start</code>
            </div>
            
        </div>
    );
};

export default LandingPage;