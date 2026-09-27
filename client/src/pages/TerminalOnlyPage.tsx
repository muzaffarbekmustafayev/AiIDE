import React from 'react';
import TerminalUI from '../components/TerminalUI';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TerminalOnlyPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen w-screen flex flex-col bg-bg">
            <div className="h-10 bg-bg-alt flex items-center px-4 border-b border-border">
                <button 
                    onClick={() => navigate('/')}
                    className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                    <ArrowLeft size={16} /> Back to Home
                </button>
                <div className="flex-1 text-center text-[13px] font-semibold text-text-secondary">
                    Remote Server Terminal
                </div>
            </div>
            
            <div className="flex-1">
                <TerminalUI port={4001} />
            </div>
        </div>
    );
};

export default TerminalOnlyPage;