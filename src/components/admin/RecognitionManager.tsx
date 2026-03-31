"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Award, Plus, Trash2, Edit2, Save, X, Search, User } from 'lucide-react';
import { Recognition } from '@/lib/types';
import { getAllRecognitions } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export function RecognitionManager() {
  const [recognitions, setRecognitions] = useState<Recognition[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecognition, setCurrentRecognition] = useState<Partial<Recognition>>({});
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    getAllRecognitions().then(setRecognitions);
  }, []);

  const handleSave = () => {
    if (!currentRecognition.employeeName || !currentRecognition.description) return;

    const newRecognition: Recognition = {
      id: currentRecognition.id || `rec-${Date.now()}`,
      employeeName: currentRecognition.employeeName || '',
      description: currentRecognition.description || '',
      imageUrl: currentRecognition.imageUrl || `https://picsum.photos/seed/${currentRecognition.employeeName}/200/200`,
      createdAt: currentRecognition.createdAt || new Date().toISOString().split('T')[0]
    };

    if (currentRecognition.id) {
      setRecognitions(recognitions.map(r => r.id === currentRecognition.id ? newRecognition : r));
    } else {
      setRecognitions([newRecognition, ...recognitions]);
    }

    setIsEditing(false);
    setCurrentRecognition({});
    toast({
      title: "Reconhecimento Salvo",
      description: "O destaque foi publicado com sucesso no Hub.",
    });
  };

  const handleDelete = (id: string) => {
    setRecognitions(recognitions.filter(r => r.id !== id));
    toast({
      title: "Reconhecimento Removido",
      description: "O destaque foi excluído do sistema.",
      variant: "destructive"
    });
  };

  const filteredRecognitions = recognitions.filter(r => 
    r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b bg-muted/20">
        <div>
          <CardTitle className="text-lg flex items-center gap-2"><Award className="w-5 h-5 text-primary" /> Reconhecimentos</CardTitle>
          <CardDescription>Gerencie os destaques e elogios da equipe.</CardDescription>
        </div>
        <Button size="sm" onClick={() => { setIsEditing(true); setCurrentRecognition({}); }} className="rounded-xl font-bold">
          <Plus className="w-4 h-4 mr-1" /> Novo Destaque
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        {isEditing ? (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest">Nome do Colaborador</Label>
                <Input 
                  value={currentRecognition.employeeName || ''} 
                  onChange={e => setCurrentRecognition({...currentRecognition, employeeName: e.target.value})}
                  placeholder="Ex: Maria Silva"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest">Descrição do Elogio</Label>
                <Input 
                  value={currentRecognition.description || ''} 
                  onChange={e => setCurrentRecognition({...currentRecognition, description: e.target.value})}
                  placeholder="Ex: Excelente atendimento ao cliente durante a contingência..."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest">URL da Foto (Opcional)</Label>
                <Input 
                  value={currentRecognition.imageUrl || ''} 
                  onChange={e => setCurrentRecognition({...currentRecognition, imageUrl: e.target.value})}
                  placeholder="Ex: https://picsum.photos/seed/maria/200/200"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-xl font-bold"><X className="w-4 h-4 mr-1" /> Cancelar</Button>
              <Button onClick={handleSave} className="rounded-xl font-bold"><Save className="w-4 h-4 mr-1" /> Salvar Destaque</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar reconhecimentos..." 
                className="pl-10 h-10 rounded-xl"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              {filteredRecognitions.map(rec => (
                <div key={rec.id} className="flex items-center gap-4 p-3 rounded-xl border bg-muted/10 hover:bg-muted/20 transition-all group">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center relative overflow-hidden">
                    <img src={rec.imageUrl} alt={rec.employeeName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    {!rec.imageUrl && <User className="w-6 h-6 text-muted-foreground" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground leading-tight">{rec.employeeName}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1 mt-1">{rec.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{rec.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setIsEditing(true); setCurrentRecognition(rec); }} className="h-8 w-8 text-primary">
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(rec.id)} className="h-8 w-8 text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredRecognitions.length === 0 && (
                <div className="h-24 flex items-center justify-center text-muted-foreground italic border border-dashed rounded-xl">Nenhum reconhecimento encontrado.</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
