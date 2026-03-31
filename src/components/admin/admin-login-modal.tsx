"use client";

import React, { useState } from 'react';
import { useAppContext } from '@/lib/hooks';
import { ShieldCheck, Lock, X, ArrowRight, AlertCircle, Sparkles, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminLoginModal() {
  const { isAdminLoginOpen, setAdminLoginOpen, login } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Simulação de login administrativo
    setTimeout(() => {
      if (login(username, password)) {
        setAdminLoginOpen(false);
        setUsername('');
        setPassword('');
        toast({
          title: "Acesso Autorizado",
          description: "Bem-vindo ao painel do Hub.",
        });
      } else {
        setError(true);
        toast({
          title: "Erro de Acesso",
          description: "Usuário ou senha incorretos.",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 800);
  };

  return (
    <Dialog open={isAdminLoginOpen} onOpenChange={setAdminLoginOpen}>
      <DialogContent className="w-[95vw] sm:max-w-[420px] p-0 overflow-hidden border-none shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl">
        <div className="bg-primary p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-24 h-24 bg-red-500/20 rounded-full blur-2xl" />
          
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 mb-4 md:mb-6 shadow-xl"
          >
            <ShieldCheck className="w-6 h-6 md:w-8 md:h-8" />
          </motion.div>
          
          <DialogTitle className="text-2xl md:text-3xl font-black tracking-tighter mb-1 md:mb-2">Acesso Hub</DialogTitle>
          <DialogDescription className="text-white/70 font-bold uppercase text-[10px] tracking-widest">Painel de Controle GSS</DialogDescription>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <User className="w-3 h-3" /> Usuário
                </Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Seu usuário" 
                  className={`h-14 px-4 rounded-2xl bg-muted/50 border-none focus-visible:ring-primary/20 text-lg font-bold ${error ? 'ring-2 ring-destructive' : ''}`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Senha
                </Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className={`h-14 pl-4 pr-12 rounded-2xl bg-muted/50 border-none focus-visible:ring-primary/20 text-lg font-mono tracking-widest ${error ? 'ring-2 ring-destructive' : ''}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                     <Lock className="w-5 h-5" />
                  </div>
                </div>
              </div>
              
              <AnimatePresence>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xs font-bold text-destructive flex items-center gap-1.5 px-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" /> Credenciais incorretas. Tente novamente.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 group"
              disabled={loading || !username || !password}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   <span>Verificando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                   <span>Entrar no Painel</span>
                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          <div className="pt-4 border-t border-muted/50 flex items-center justify-between">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Segurança LATAM Hub</p>
            <div className="flex items-center gap-1.5 text-primary font-bold text-[10px] uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> Criptografado
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
