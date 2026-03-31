"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '@/lib/hooks';
import { 
  Home, 
  Workflow, 
  BookOpen, 
  Video, 
  Settings, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  User,
  LayoutDashboard,
  ShieldCheck,
  MessageSquarePlus,
  Megaphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function MainSidebar() {
  const { 
    isSidebarOpen, 
    setSidebarOpen, 
    isAdmin, 
    currentUser,
    logout, 
    session, 
    endSession,
    isBannerVisible,
    setBannerVisible,
    setAdminLoginOpen, 
    setSuggestionOpen 
  } = useAppContext();
  const location = useLocation();
  const pathname = location.pathname;

  const menuItems = [
    { icon: Home, label: 'Início', href: '/' },
    { icon: Megaphone, label: 'Hub de Avisos', href: '/avisos' },
    { icon: Workflow, label: 'Matriz Inteligente', href: '/matriz' },
    { icon: BookOpen, label: 'Políticas', href: '/politicas' },
    { icon: Video, label: 'Fast Learning', href: '/fast-learning' },
  ];

  const adminItems = [
    { icon: LayoutDashboard, label: 'Dashboard GSS', href: '/admin/dashboard' },
    { icon: Settings, label: 'Gerenciar Fluxos', href: '/admin/fluxos' },
    { icon: ShieldCheck, label: 'Configurações', href: '/admin/config' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 280 : (typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : 80),
          x: isSidebarOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 768 ? -280 : 0),
          top: isBannerVisible ? 48 : 0,
          height: isBannerVisible ? 'calc(100vh - 48px)' : '100vh'
        }}
        className={cn(
          "fixed left-0 bg-sidebar/80 backdrop-blur-xl border-r border-sidebar-border/30 z-50 flex flex-col transition-all duration-300 shadow-2xl overflow-hidden",
          !isSidebarOpen && "md:items-center"
        )}
      >
      <div className="p-6 flex items-center justify-between h-20 border-b border-sidebar-border/20">
        <AnimatePresence mode="wait">
          {isSidebarOpen ? (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-sidebar-foreground rounded-lg flex items-center justify-center text-sidebar font-bold">L</div>
              <span className="font-black text-xl tracking-tighter text-sidebar-foreground">LATAM <span className="text-sidebar-foreground/60 font-light">HUB</span></span>
            </motion.div>
          ) : (
            <motion.div
              key="logo-short"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="w-10 h-10 bg-sidebar-foreground rounded-xl flex items-center justify-center text-sidebar font-bold shadow-lg"
            >
              L
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        {currentUser ? (
          <>
            <div className="space-y-2">
              <p className={cn("text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/50 px-4 mb-4", !isSidebarOpen && "hidden")}>Menu Principal</p>
              {menuItems.map((item) => (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-4 h-12 transition-all group text-sidebar-foreground",
                      isActive(item.href) && "bg-white/10 text-sidebar-foreground font-bold border-r-4 border-sidebar-foreground rounded-r-none",
                      !isSidebarOpen && "justify-center p-0",
                      !isActive(item.href) && "hover:bg-white/5"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive(item.href) ? "text-sidebar-foreground" : "text-sidebar-foreground")} />
                    {isSidebarOpen && <span>{item.label}</span>}
                  </Button>
                </Link>
              ))}
            </div>

            {isAdmin && (
              <div className="space-y-2 animate-in slide-in-from-left duration-500">
                <p className={cn("text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground px-4 mb-4", !isSidebarOpen && "hidden")}>Administração</p>
                {adminItems.map((item) => (
                  <Link key={item.href} to={item.href}>
                    <Button
                      variant={isActive(item.href) ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-4 h-12 transition-all group text-sidebar-foreground",
                        isActive(item.href) && "bg-white/10 text-sidebar-foreground font-bold border-r-4 border-sidebar-foreground rounded-r-none",
                        !isSidebarOpen && "justify-center p-0",
                        !isActive(item.href) && "hover:bg-white/5"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive(item.href) ? "text-sidebar-foreground" : "text-sidebar-foreground")} />
                      {isSidebarOpen && <span>{item.label}</span>}
                    </Button>
                  </Link>
                ))}
              </div>
            )}

            <div className="space-y-2">
               <p className={cn("text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/50 px-4 mb-4", !isSidebarOpen && "hidden")}>Suporte</p>
               <Button
                    variant="ghost"
                    onClick={() => setSuggestionOpen(true)}
                    className={cn(
                      "w-full justify-start gap-4 h-12 transition-all group text-sidebar-foreground hover:bg-white/5",
                      !isSidebarOpen && "justify-center p-0"
                    )}
                  >
                    <MessageSquarePlus className="w-5 h-5 text-sidebar-foreground transition-transform group-hover:scale-110" />
                    {isSidebarOpen && <span>Sugerir Melhoria</span>}
                </Button>
                <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-4 h-12 transition-all group text-sidebar-foreground hover:bg-white/5",
                      !isSidebarOpen && "justify-center p-0"
                    )}
                  >
                    <HelpCircle className="w-5 h-5 text-sidebar-foreground transition-transform group-hover:scale-110" />
                    {isSidebarOpen && <span>Central de Ajuda</span>}
                </Button>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-sidebar-foreground/30" />
            </div>
            {isSidebarOpen && (
              <div className="space-y-1">
                <p className="text-xs font-bold text-sidebar-foreground">Acesso Restrito</p>
                <p className="text-[10px] text-sidebar-foreground/40">Faça login para acessar as funções do Hub.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-sidebar-border/20 bg-white/5">
        {currentUser ? (
          isSidebarOpen ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl border border-sidebar-border/30 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-sidebar-foreground/20 flex items-center justify-center text-sidebar-foreground font-bold">
                  {currentUser.username.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold truncate text-sidebar-foreground">{currentUser.username}</p>
                  <p className="text-[10px] text-sidebar-foreground/60 truncate uppercase tracking-widest">{currentUser.role}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-sidebar-foreground hover:bg-white/10 transition-colors"
                  onClick={logout}
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
              
              {session && (
                <div className="p-3 bg-white/5 rounded-xl border border-sidebar-border/10">
                  <p className="text-[10px] font-bold text-sidebar-foreground/40 uppercase tracking-widest mb-1">Sessão Ativa</p>
                  <p className="text-[10px] text-sidebar-foreground/60 truncate">BP: {session.bp}</p>
                  <Button 
                    variant="link" 
                    className="h-auto p-0 text-[10px] text-red-400 font-bold uppercase tracking-widest mt-1"
                    onClick={endSession}
                  >
                    Encerrar Sessão
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2 items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-12 h-12 text-sidebar-foreground hover:bg-white/10 rounded-xl" 
                onClick={logout}
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          )
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "w-full h-12 text-sidebar-foreground hover:bg-white/10 rounded-xl flex items-center justify-center gap-3",
              isSidebarOpen && "px-4 justify-start"
            )} 
            onClick={() => setAdminLoginOpen(true)}
          >
            <ShieldCheck className="w-5 h-5" />
            {isSidebarOpen && <span className="text-xs font-bold uppercase tracking-widest">Login Hub</span>}
          </Button>
        )}
      </div>

      <Button
        variant="secondary"
        size="icon"
        className="absolute -right-4 top-24 h-8 w-8 rounded-full shadow-lg border border-sidebar-border/30 z-50 bg-sidebar-foreground text-sidebar hover:bg-white hover:text-sidebar-foreground transition-all hidden md:flex"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </Button>
    </motion.aside>
    </>
  );
}
