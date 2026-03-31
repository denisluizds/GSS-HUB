import React, { useState, useEffect } from 'react';
import { supabaseService, Aviso } from '@/services/supabaseService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Calendar, 
  User, 
  Loader2, 
  AlertCircle,
  Megaphone,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/lib/hooks';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export function AvisosHub() {
  const { currentUser, isAdmin } = useAppContext();
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newAviso, setNewAviso] = useState({ titulo: '', conteudo: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAvisos();
  }, []);

  const fetchAvisos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await supabaseService.getAvisos();
      setAvisos(data);
    } catch (err: any) {
      console.error('Erro ao carregar avisos:', err);
      const message = err.message || 'Erro ao carregar avisos do banco de dados.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAviso.titulo || !newAviso.conteudo) return;

    setSubmitting(true);
    try {
      await supabaseService.createAviso({
        titulo: newAviso.titulo,
        conteudo: newAviso.conteudo,
        autor: currentUser?.username || 'Sistema'
      });
      toast.success('Aviso publicado com sucesso!');
      setNewAviso({ titulo: '', conteudo: '' });
      setIsAdding(false);
      fetchAvisos();
    } catch (error) {
      console.error('Erro ao criar aviso:', error);
      toast.error('Erro ao conectar com o Supabase. Verifique as configurações.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await supabaseService.deleteAviso(id);
      toast.success('Aviso removido.');
      fetchAvisos();
    } catch (error) {
      console.error('Erro ao deletar aviso:', error);
      toast.error('Erro ao remover aviso.');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
            <Megaphone className="w-10 h-10 text-primary" /> Hub de Avisos
          </h1>
          <p className="text-muted-foreground font-medium">Comunicações oficiais e atualizações da Matriz GSS.</p>
        </div>
        
        {isAdmin && (
          <Button 
            onClick={() => setIsAdding(!isAdding)}
            className="h-12 px-6 rounded-2xl font-bold shadow-lg shadow-primary/20"
          >
            {isAdding ? 'Cancelar' : <><Plus className="w-5 h-5 mr-2" /> Novo Aviso</>}
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-2 border-primary/20 shadow-xl bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl font-black tracking-tight">Publicar Novo Comunicado</CardTitle>
                <CardDescription className="font-bold uppercase text-[10px] tracking-widest text-primary/60">Este aviso será visível para todos os agentes</CardDescription>
              </CardHeader>
              <form onSubmit={handleCreate}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Título do Aviso</label>
                    <Input 
                      placeholder="Ex: Atualização na Política de Reacomodação" 
                      value={newAviso.titulo}
                      onChange={e => setNewAviso({ ...newAviso, titulo: e.target.value })}
                      className="h-12 rounded-xl border-none shadow-sm focus-visible:ring-primary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Conteúdo</label>
                    <Textarea 
                      placeholder="Descreva os detalhes do comunicado aqui..." 
                      value={newAviso.conteudo}
                      onChange={e => setNewAviso({ ...newAviso, conteudo: e.target.value })}
                      className="min-h-[150px] rounded-xl border-none shadow-sm focus-visible:ring-primary resize-none"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setIsAdding(false)} className="font-bold">Descartar</Button>
                  <Button type="submit" disabled={submitting} className="h-12 px-8 rounded-xl font-bold shadow-lg">
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publicar Agora'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary/20" />
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Conectando ao Supabase...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 rounded-[32px] border-2 border-dashed border-red-200 p-8">
            <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-red-600">Erro de Configuração</h3>
            <p className="text-red-500 font-medium max-w-md mx-auto mt-2">{error}</p>
            <Button 
              variant="outline" 
              onClick={fetchAvisos} 
              className="mt-6 border-red-200 text-red-600 hover:bg-red-100"
            >
              Tentar Novamente
            </Button>
          </div>
        ) : avisos.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-[32px] border-2 border-dashed border-muted">
            <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Bell className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-muted-foreground">Nenhum aviso no momento</h3>
            <p className="text-muted-foreground font-medium max-w-xs mx-auto mt-2">Fique atento para futuras comunicações da equipe de gestão.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {avisos.map((aviso, idx) => (
              <motion.div
                key={aviso.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-500 border-none bg-white overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="bg-primary/5 text-primary border-none font-bold uppercase text-[9px] tracking-widest">Comunicado Oficial</Badge>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {formatDate(aviso.data_criacao || '')}
                          </span>
                        </div>
                        <CardTitle className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{aviso.titulo}</CardTitle>
                      </div>
                      {isAdmin && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => aviso.id && handleDelete(aviso.id)}
                          className="text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{aviso.conteudo}</p>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-muted/50 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-3 h-3" />
                      </div>
                      <span>Autor: {aviso.autor}</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-500">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Lido</span>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-primary/5 p-8 rounded-[32px] border border-primary/10 flex items-start gap-6">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0 shadow-xl">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h4 className="text-xl font-black tracking-tight text-primary">Diretrizes de Comunicação</h4>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            Todos os avisos publicados aqui são de caráter obrigatório e devem ser seguidos por todos os agentes em atendimento. 
            Em caso de dúvidas sobre algum comunicado, entre em contato com seu supervisor imediato ou utilize a Central de Ajuda.
          </p>
        </div>
      </div>
    </div>
  );
}
