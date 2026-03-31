"use client";

import React from 'react';
import { useAppContext } from '@/lib/hooks';
import { Bot, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function AiChatButton() {
  const { chatState, setChatState } = useAppContext();

  if (chatState !== 'closed') return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Button
        size="icon"
        className="h-12 w-12 md:h-16 md:w-16 rounded-2xl md:rounded-3xl bg-primary text-white shadow-2xl shadow-primary/40 group relative overflow-hidden"
        onClick={() => setChatState('open')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Bot className="w-8 h-8 relative z-10 group-hover:scale-110 transition-transform" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-4 border-white flex items-center justify-center animate-bounce">
           <Sparkles className="w-2 h-2 text-white fill-current" />
        </div>
        
        {/* Tooltip-like label */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-white text-primary px-4 py-2 rounded-2xl shadow-xl border border-primary/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
           <p className="text-xs font-black tracking-tighter flex items-center gap-2">
              <MessageSquare className="w-3 h-3" /> Falar com LATAM AI
           </p>
        </div>
      </Button>
    </motion.div>
  );
}
