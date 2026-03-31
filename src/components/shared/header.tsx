"use client";

import React from 'react';
import { useAppContext } from '@/lib/hooks';
import { Search, Bell, Menu, X, User, ShieldCheck, Sun, Moon, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function Header() {
  const { isSidebarOpen, setSidebarOpen, setSearchOpen, isAdmin, currentUser, setAdminLoginOpen, theme, setTheme, isBannerVisible } = useAppContext();

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('indigo');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-5 h-5 text-muted-foreground" />;
    if (theme === 'dark') return <Moon className="w-5 h-5 text-muted-foreground" />;
    return <Palette className="w-5 h-5 text-muted-foreground" />;
  };

  return (
    <header 
      className={cn(
        "fixed right-0 h-20 bg-background/80 backdrop-blur-md border-b border-muted z-30 transition-all duration-300 flex items-center justify-between px-4 md:px-8",
        typeof window !== 'undefined' && window.innerWidth < 768 
          ? "left-0" 
          : (isSidebarOpen ? "left-[280px]" : "left-[80px]"),
        isBannerVisible ? "top-[48px]" : "top-0"
      )}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden flex-shrink-0"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
        
        {isAdmin && (
          <div className="relative max-w-[320px] w-full hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Pesquisar políticas, fluxos ou vídeos..." 
              className="pl-10 bg-muted/50 border-none h-11 rounded-xl focus-visible:ring-primary/20 truncate"
              onClick={() => setSearchOpen(true)}
              readOnly
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-11 w-11 rounded-xl hover:bg-primary/5"
          onClick={toggleTheme}
          title="Alterar Tema"
        >
          {getThemeIcon()}
        </Button>

        <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-xl hover:bg-primary/5">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </Button>
        
        <Separator orientation="vertical" className="h-8 mx-2" />
        
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black tracking-tight">{currentUser?.username || 'LATAM Agent'}</p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
              {currentUser ? (currentUser.role === 'admin' ? 'Administrador' : 'Agente GSS') : 'Visitante'}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-11 w-11 rounded-xl transition-all",
              isAdmin ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground"
            )}
            onClick={() => !currentUser && setAdminLoginOpen(true)}
          >
            {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}

function Separator({ orientation, className }: { orientation: 'vertical' | 'horizontal', className?: string }) {
  return (
    <div className={cn(
      "bg-muted",
      orientation === 'vertical' ? "w-[1px] h-full" : "h-[1px] w-full",
      className
    )} />
  );
}
