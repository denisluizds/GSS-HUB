"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '@/lib/hooks';
import { GoogleGenAI } from "@google/genai";
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Loader2, 
  MessageSquare, 
  Maximize2, 
  Minimize2, 
  Trash2,
  ChevronRight,
  Zap,
  ShieldCheck,
  BookOpen,
  Workflow
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

export function AiChat() {
  const { chatState, setChatState } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (chatState === 'closed') return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: input,
        config: {
          systemInstruction: "Você é o Assistente Inteligente do Hub LATAM GSS. Seu objetivo é ajudar agentes de viagens e funcionários da LATAM com dúvidas sobre políticas, procedimentos e o uso da Matriz Inteligente. Seja profissional, prestativo e use um tom de voz corporativo mas amigável. Se não souber algo, sugira que o usuário procure na seção de Políticas ou use a Matriz.",
        },
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.text || "Desculpe, não consegui processar sua solicitação agora.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Erro no chat AI:", error);
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: "Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente mais tarde.",
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const suggestions = [
    { text: "Como usar a Matriz?", icon: Workflow },
    { text: "Política de Bagagem", icon: BookOpen },
    { text: "Waiver de Contingência", icon: Zap },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0
        }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={cn(
          "fixed z-50 shadow-2xl transition-all duration-300",
          chatState === 'minimized' 
            ? "w-72 right-5 bottom-20" 
            : "w-[calc(100vw-40px)] md:w-[400px] h-[calc(100vh-140px)] md:h-[600px] right-5 bottom-20"
        )}
      >
        <Card className="h-full flex flex-col border-primary/20 overflow-hidden bg-white/95 backdrop-blur-xl rounded-3xl">
          <CardHeader className="py-4 px-6 bg-primary text-white flex flex-row items-center justify-between space-y-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-lg font-black tracking-tighter">LATAM AI</CardTitle>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                   <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Online agora</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-1 relative z-10">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-white/20 text-white rounded-full"
                onClick={() => setChatState(chatState === 'minimized' ? 'open' : 'minimized')}
              >
                {chatState === 'minimized' ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-white/20 text-white rounded-full"
                onClick={() => setChatState('closed')}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          {chatState === 'open' && (
            <>
              <CardContent className="flex-1 overflow-hidden p-0 bg-muted/10 relative">
                <ScrollArea className="h-full p-6" ref={scrollRef}>
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-10 text-center space-y-6">
                      <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center text-primary shadow-inner border border-primary/10">
                        <Sparkles className="w-10 h-10" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-black tracking-tight">Olá! Como posso ajudar?</p>
                        <p className="text-xs text-muted-foreground max-w-[250px] mx-auto font-medium">Sou seu assistente virtual especializado em políticas GSS e na Matriz Inteligente.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2 w-full max-w-[280px]">
                        {suggestions.map((s, i) => (
                          <Button 
                            key={i} 
                            variant="outline" 
                            className="justify-between h-12 rounded-xl border-muted-foreground/10 hover:border-primary/50 hover:bg-primary/5 group transition-all"
                            onClick={() => setInput(s.text)}
                          >
                            <div className="flex items-center gap-3">
                               <s.icon className="w-4 h-4 text-primary" />
                               <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground">{s.text}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 pb-4">
                      {messages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            "flex gap-3 max-w-[85%]",
                            msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center shadow-md flex-shrink-0",
                            msg.role === 'user' ? "bg-primary text-white" : "bg-white text-primary border border-primary/10"
                          )}>
                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </div>
                          <div className={cn(
                            "p-4 rounded-2xl text-sm shadow-sm",
                            msg.role === 'user' 
                              ? "bg-primary text-white rounded-tr-none font-medium" 
                              : "bg-white text-foreground rounded-tl-none border border-muted"
                          )}>
                            {msg.content}
                            <p className={cn(
                              "text-[9px] mt-2 font-bold uppercase tracking-widest",
                              msg.role === 'user' ? "text-white/60" : "text-muted-foreground"
                            )}>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                      {isLoading && (
                        <div className="flex gap-3 max-w-[85%]">
                          <div className="w-8 h-8 rounded-xl bg-white text-primary border border-primary/10 flex items-center justify-center shadow-md">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-muted shadow-sm">
                            <div className="flex gap-1">
                              <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                              <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                              <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-4 bg-white border-t">
                <form onSubmit={handleSendMessage} className="flex w-full gap-2 relative">
                  <Input
                    placeholder="Digite sua dúvida..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 h-12 pr-12 bg-muted/50 border-none rounded-2xl focus-visible:ring-primary/20 font-medium"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="absolute right-1 top-1 h-10 w-10 rounded-xl shadow-lg shadow-primary/20"
                    disabled={isLoading || !input.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </CardFooter>
            </>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
