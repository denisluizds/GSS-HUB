"use client";

import React, { useState } from 'react';
import { useAppContext } from '@/lib/hooks';
import { MessageSquarePlus, Send, X, Sparkles, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

export function SuggestionModal() {
  const { isSuggestionOpen, setSuggestionOpen, session } = useAppContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('feature');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulação de envio de sugestão
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      toast({
        title: "Sugestão Enviada",
        description: "Obrigado por contribuir com a melhoria do Hub!",
      });
    }, 1200);
  };

  const handleClose = () => {
    setSuggestionOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      setTitle('');
      setDescription('');
      setCategory('feature');
    }, 300);
  };

  return (
    <Dialog open={isSuggestionOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl">
        <div className="bg-gradient-to-br from-primary to-red-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
          
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 mb-6 shadow-xl"
          >
            <MessageSquarePlus className="w-8 h-8" />
          </motion.div>
          
          <DialogTitle className="text-3xl font-black tracking-tighter mb-2">Sugerir Melhoria</DialogTitle>
          <DialogDescription className="text-white/70 font-bold uppercase text-[10px] tracking-widest">Sua voz ajuda a construir o Hub</DialogDescription>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Categoria</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-none focus:ring-primary/20 font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feature">Nova Funcionalidade</SelectItem>
                        <SelectItem value="bug">Relatar Erro (Bug)</SelectItem>
                        <SelectItem value="policy">Sugestão de Política</SelectItem>
                        <SelectItem value="other">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">O que você sugere?</Label>
                    <Input 
                      placeholder="Ex: Adicionar calculadora de bagagem" 
                      className="h-12 rounded-xl bg-muted/50 border-none focus-visible:ring-primary/20 font-bold"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Explique melhor</Label>
                    <Textarea 
                      placeholder="Descreva detalhadamente como essa melhoria ajudaria no seu dia a dia..." 
                      className="min-h-[120px] rounded-xl bg-muted/50 border-none focus-visible:ring-primary/20 font-medium"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                   <AlertCircle className="w-5 h-5 text-primary flex-shrink-0" />
                   <p className="text-[10px] font-bold text-primary leading-tight uppercase tracking-widest">Sua sugestão será analisada pela equipe de Processos GSS e poderá ser implementada em futuras atualizações.</p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 group"
                  disabled={loading || !title || !description}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                       <span>Enviando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                       <span>Enviar Sugestão</span>
                       <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center space-y-6"
              >
                <div className="w-24 h-24 rounded-3xl bg-green-100 flex items-center justify-center text-green-600 shadow-inner border border-green-200">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-black tracking-tight">Obrigado, Agente!</p>
                  <p className="text-sm text-muted-foreground max-w-[300px] mx-auto font-medium">Sua sugestão foi registrada com sucesso. Juntos construímos um Hub mais eficiente.</p>
                </div>
                <Button 
                  variant="outline" 
                  className="h-12 rounded-xl font-bold px-8"
                  onClick={handleClose}
                >
                  Fechar Janela
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-4 border-t border-muted/50 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-[10px] uppercase tracking-widest">
              <HelpCircle className="w-3 h-3" /> Precisa de ajuda?
            </div>
            <div className="flex items-center gap-1.5 text-primary font-bold text-[10px] uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> LATAM Hub Feedback
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
