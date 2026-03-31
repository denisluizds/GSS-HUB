"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Plus, Trash2, Edit2, Save, X, Search } from 'lucide-react';
import { Policy } from '@/lib/types';
import { getPolicies } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export function PolicyManager() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPolicy, setCurrentPolicy] = useState<Partial<Policy>>({});
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    getPolicies().then(setPolicies);
  }, []);

  const handleSave = () => {
    if (!currentPolicy.title) return;

    const newPolicy: Policy = {
      id: currentPolicy.id || `policy-${Date.now()}`,
      title: currentPolicy.title || '',
      description: currentPolicy.description || '',
      scope: currentPolicy.scope || 'Global',
      implementationDate: currentPolicy.implementationDate || new Date().toISOString().split('T')[0],
      considerations: currentPolicy.considerations || '',
      publicationDate: currentPolicy.publicationDate || new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    if (currentPolicy.id) {
      setPolicies(policies.map(p => p.id === currentPolicy.id ? newPolicy : p));
    } else {
      setPolicies([newPolicy, ...policies]);
    }

    setIsEditing(false);
    setCurrentPolicy({});
    toast({
      title: "Política Salva",
      description: "A política foi atualizada com sucesso no CMS.",
    });
  };

  const handleDelete = (id: string) => {
    setPolicies(policies.filter(p => p.id !== id));
    toast({
      title: "Política Removida",
      description: "O documento foi excluído do repositório.",
      variant: "destructive"
    });
  };

  const filteredPolicies = policies.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b bg-muted/20">
        <div>
          <CardTitle className="text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Políticas e Procedimentos</CardTitle>
          <CardDescription>Gerencie o repositório de documentos normativos.</CardDescription>
        </div>
        <Button size="sm" onClick={() => { setIsEditing(true); setCurrentPolicy({}); }} className="rounded-xl font-bold">
          <Plus className="w-4 h-4 mr-1" /> Nova Política
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        {isEditing ? (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest">Título</Label>
                <Input 
                  value={currentPolicy.title || ''} 
                  onChange={e => setCurrentPolicy({...currentPolicy, title: e.target.value})}
                  placeholder="Ex: Política de Waiver v.2"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest">Escopo</Label>
                <Input 
                  value={currentPolicy.scope || ''} 
                  onChange={e => setCurrentPolicy({...currentPolicy, scope: e.target.value})}
                  placeholder="Ex: Doméstico / Internacional"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest">Descrição Curta</Label>
                <Input 
                  value={currentPolicy.description || ''} 
                  onChange={e => setCurrentPolicy({...currentPolicy, description: e.target.value})}
                  placeholder="Resumo da política para listagem..."
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest">Considerações Detalhadas</Label>
                <Textarea 
                  value={currentPolicy.considerations || ''} 
                  onChange={e => setCurrentPolicy({...currentPolicy, considerations: e.target.value})}
                  placeholder="Conteúdo completo da política..."
                  className="min-h-[120px]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-xl font-bold"><X className="w-4 h-4 mr-1" /> Cancelar</Button>
              <Button onClick={handleSave} className="rounded-xl font-bold"><Save className="w-4 h-4 mr-1" /> Salvar Política</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar políticas..." 
                className="pl-10 h-10 rounded-xl"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="rounded-xl border overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Título</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Escopo</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Atualização</TableHead>
                    <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPolicies.map(policy => (
                    <TableRow key={policy.id} className="hover:bg-muted/20">
                      <TableCell className="font-bold text-sm">{policy.title}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{policy.scope}</TableCell>
                      <TableCell className="text-xs">{policy.lastUpdated}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setIsEditing(true); setCurrentPolicy(policy); }} className="h-8 w-8 text-primary">
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(policy.id)} className="h-8 w-8 text-destructive">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPolicies.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground italic">Nenhuma política encontrada.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
