import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  MessageSquare,
  ChevronDown,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { askAI } from '@/services/aiService';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIAssistant() {
  const { session, flows } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou o Assistente Inteligente da Matriz GSS. Como posso te ajudar com as políticas LATAM hoje?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare context
    const context = `
      Agente: ${session?.bp || "Desconhecido"}
      Protocolo: ${session?.protocol || "Nenhum"}
      Localizador: ${session?.locator || "Nenhum"}
      Fluxos disponíveis: ${flows.map(f => f.title).join(', ')}
    `;

    const response = await askAI(input, context);

    const assistantMsg: Message = {
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  if (!session) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "w-[400px] shadow-[0_20px_80px_rgba(0,0,0,0.15)] rounded-[32px] overflow-hidden border border-slate-100 bg-white flex flex-col transition-all duration-300",
              isMinimized ? "h-20" : "h-[600px]"
            )}
          >
            <CardHeader className="bg-[#1B0088] p-6 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Sparkles className="text-white w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg font-black tracking-tight">GSS AI</CardTitle>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Online</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white/60 hover:text-white hover:bg-white/10 rounded-xl"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white hover:bg-white/10 rounded-xl"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            {!isMinimized && (
              <>
                <CardContent className="flex-1 p-6 overflow-hidden flex flex-col">
                  <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollRef}>
                    <div className="space-y-6 pb-4">
                      {messages.map((msg, idx) => (
                        <div 
                          key={idx} 
                          className={cn(
                            "flex gap-3 max-w-[85%]",
                            msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                            msg.role === 'assistant' ? "bg-slate-100 text-[#1B0088]" : "bg-[#1B0088] text-white"
                          )}>
                            {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                          </div>
                          <div className={cn(
                            "p-4 rounded-2xl text-sm leading-relaxed",
                            msg.role === 'assistant' 
                              ? "bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100" 
                              : "bg-[#1B0088] text-white rounded-tr-none shadow-md shadow-blue-900/10"
                          )}>
                            {msg.content}
                            <p className={cn(
                              "text-[9px] mt-2 font-bold uppercase tracking-widest",
                              msg.role === 'assistant' ? "text-slate-300" : "text-white/40"
                            )}>
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex gap-3 mr-auto max-w-[85%]">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 text-[#1B0088] flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-[#1B0088]" />
                            <span className="text-xs text-slate-400 font-medium italic">GSS AI está pensando...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <div className="relative w-full">
                    <Input 
                      placeholder="Pergunte sobre políticas..." 
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSend()}
                      className="h-14 pl-6 pr-14 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-300 focus-visible:ring-[#1B0088]"
                    />
                    <Button 
                      size="icon" 
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#1B0088] hover:bg-[#15006b] text-white rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardFooter>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl transition-all duration-500 group relative overflow-hidden",
          isOpen ? "bg-white text-[#1B0088] rotate-90" : "bg-[#1B0088] text-white"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? (
          <ChevronDown className="w-8 h-8" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-7 h-7" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-[#1B0088]" />
          </div>
        )}
      </motion.button>
    </div>
  );
}
