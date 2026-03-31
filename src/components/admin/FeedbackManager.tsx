"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MessageSquare, Search, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data for feedback/suggestions
const INITIAL_FEEDBACK = [
  { id: '1', user: 'BP: 12345', type: 'Sugestão', content: 'Adicionar fluxo para reacomodação em voos de parceiros.', status: 'Pendente', date: '2024-03-28' },
  { id: '2', user: 'BP: 67890', type: 'Erro', content: 'O botão de "Finalizar" não está funcionando no fluxo de Upgrade.', status: 'Em Análise', date: '2024-03-29' },
  { id: '3', user: 'BP: 11223', type: 'Elogio', content: 'A nova interface da Matriz está muito mais rápida!', status: 'Concluído', date: '2024-03-25' },
];

export function FeedbackManager() {
  const [feedback, setFeedback] = useState(INITIAL_FEEDBACK);
  const [search, setSearch] = useState('');

  const handleStatusChange = (id: string, newStatus: string) => {
    setFeedback(feedback.map(f => f.id === id ? { ...f, status: newStatus } : f));
  };

  const filteredFeedback = feedback.filter(f => 
    f.user.toLowerCase().includes(search.toLowerCase()) ||
    f.content.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Concluído': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1"><CheckCircle2 className="w-3 h-3" /> Concluído</Badge>;
      case 'Em Análise': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1"><Clock className="w-3 h-3" /> Em Análise</Badge>;
      default: return <Badge variant="outline" className="gap-1"><AlertCircle className="w-3 h-3" /> Pendente</Badge>;
    }
  };

  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b bg-muted/20">
        <div>
          <CardTitle className="text-lg flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary" /> Feedback e Sugestões</CardTitle>
          <CardDescription>Monitore as interações e melhorias sugeridas pelos agentes.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar feedbacks..." 
              className="pl-10 h-10 rounded-xl"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="rounded-xl border overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest">Usuário</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest">Tipo</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest">Conteúdo</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest">Data</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest">Status</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedback.map(item => (
                  <TableRow key={item.id} className="hover:bg-muted/20">
                    <TableCell className="font-bold text-xs">{item.user}</TableCell>
                    <TableCell className="text-xs">{item.type}</TableCell>
                    <TableCell className="text-xs max-w-[300px] truncate" title={item.content}>{item.content}</TableCell>
                    <TableCell className="text-xs">{item.date}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleStatusChange(item.id, 'Em Análise')} className="h-7 text-[10px] font-bold">Analisar</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleStatusChange(item.id, 'Concluído')} className="h-7 text-[10px] font-bold text-green-600">Concluir</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredFeedback.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground italic">Nenhum feedback encontrado.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
