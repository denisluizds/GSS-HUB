"use client";

import React from 'react';
import { useAppContext } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  const { isSidebarOpen, currentUser, setAdminLoginOpen, isBannerVisible } = useAppContext();

  return (
    <motion.main
      initial={false}
      animate={{ 
        marginLeft: typeof window !== 'undefined' && window.innerWidth < 768 
          ? 0 
          : (isSidebarOpen ? 280 : 80),
        width: typeof window !== 'undefined' && window.innerWidth < 768 
          ? '100%' 
          : (isSidebarOpen ? 'calc(100% - 280px)' : 'calc(100% - 80px)'),
        paddingTop: isBannerVisible ? 128 : 80
      }}
      className={cn(
        "min-h-screen pb-12 px-4 md:px-8 lg:px-12 transition-all duration-300 bg-muted/20",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {!currentUser ? (
          <motion.div
            key="restricted-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="h-[70vh] flex flex-col items-center justify-center text-center space-y-8 max-w-xl mx-auto"
          >
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl bg-primary/10 flex items-center justify-center text-primary animate-pulse">
                <ShieldCheck className="w-16 h-16" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white border-4 border-background">
                <X className="w-4 h-4" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-4xl font-black tracking-tighter leading-none">Acesso Restrito</h1>
              <p className="text-muted-foreground font-medium text-lg">Este hub é exclusivo para pessoal autorizado. Por favor, realize o login para acessar as ferramentas.</p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Button 
                size="lg" 
                className="h-14 px-8 rounded-2xl font-bold shadow-xl text-lg group"
                onClick={() => setAdminLoginOpen(true)}
              >
                Acessar o Hub <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Somente pessoal autorizado GSS</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="page-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
