"use client";

import React, { useState } from 'react';
import { useAppContext } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { User, ArrowRight, HelpCircle, FileCheck, LogOut } from 'lucide-react';
import type { OperationalFlow, DecisionResult, RecordedCase } from '@/lib/types';

export function FlowEngine() {
  const { session, startSession, endSession, flows, addCase } = useAppContext();
  const [selectedFlow, setSelectedFlow] = useState<OperationalFlow | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [path, setPath] = useState<string[]>([]);
  const [formData, setFormData] = useState({ bp: '', protocol: '', locator: '' });

  const activeFlows = flows.filter(f => f.active);

  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    startSession({ ...formData, startTime: new Date().toISOString() });
  };

  const handleStartFlow = (flow: OperationalFlow) => {
    setSelectedFlow(flow);
    setCurrentNodeId(flow.rootNodeId);
    setPath([]);
  };

  const handleOptionClick = (nextNodeId: string, optionText: string) => {
    setPath(prev => [...prev, optionText]);
    setCurrentNodeId(nextNodeId);
  };

  const handleFinish = (result: DecisionResult) => {
    if (session && selectedFlow) {
      const newCase: RecordedCase = {
        id: `case-${Date.now()}`,
        agentBp: session.bp,
        protocol: session.protocol,
        locator: session.locator,
        flowTitle: selectedFlow.title,
        path: path,
        finalResult: result,
        timestamp: new Date().toISOString()
      };
      addCase(newCase);
    }
    // Retorna para o preenchimento inicial resetando a sessão
    setSelectedFlow(null);
    setCurrentNodeId(null);
    setPath([]);
    endSession();
    setFormData({ bp: '', protocol: '', locator: '' });
  };

  if (!session) {
    return (
      <div className="max-w-md mx-auto py-12">
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Início de Atendimento</CardTitle>
            <p className="text-muted-foreground text-sm">Identifique-se para acessar a Matriz.</p>
          </CardHeader>
          <form onSubmit={handleStartSession}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>BP (Código Agente)</Label>
                <Input placeholder="Ex: 123456" value={formData.bp} onChange={e => setFormData({...formData, bp: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Protocolo</Label>
                <Input placeholder="Número" value={formData.protocol} onChange={e => setFormData({...formData, protocol: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>PNR (Localizador)</Label>
                <Input placeholder="ABCDEF" className="uppercase" value={formData.locator} onChange={e => setFormData({...formData, locator: e.target.value.toUpperCase()})} required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full h-12">Iniciar Fluxo</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  if (!selectedFlow) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center bg-primary/5 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
             <User className="w-5 h-5 text-primary" />
             <p className="font-bold">Sessão: BP {session.bp} | PNR {session.locator}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={endSession} className="text-destructive"><LogOut className="w-4 h-4 mr-2"/> Encerrar</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeFlows.map(flow => (
                <Card key={flow.id} className="hover:border-primary/50 cursor-pointer shadow-sm transition-all" onClick={() => handleStartFlow(flow)}>
                    <CardHeader><CardTitle className="text-lg">{flow.title}</CardTitle></CardHeader>
                    <CardContent><p className="text-xs text-muted-foreground">{flow.description}</p></CardContent>
                    <CardFooter className="justify-end"><ArrowRight className="w-5 h-5 text-primary" /></CardFooter>
                </Card>
            ))}
        </div>
      </div>
    );
  }

  const currentNode = selectedFlow.nodes[currentNodeId || ''];
  if (!currentNode) return null;

  return (
    <div className="max-w-4xl mx-auto py-4">
      <Card className="shadow-xl border-primary/20 overflow-hidden">
        <div className={`h-2 ${currentNode.type === 'result' ? (currentNode.result?.isNegative ? 'bg-destructive' : 'bg-green-600') : 'bg-primary'}`} />
        <CardContent className="p-8">
            {currentNode.type === 'question' ? (
                <div className="space-y-8">
                    <h3 className="text-2xl font-medium text-center">{currentNode.text}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentNode.options?.map((opt, idx) => (
                            <Button key={idx} variant="outline" className="h-16 text-lg hover:bg-primary/5" onClick={() => handleOptionClick(opt.nextNodeId, opt.text)}>{opt.text}</Button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in zoom-in-95">
                    <div className={`p-6 rounded-xl border-2 ${currentNode.result?.isNegative ? 'bg-destructive/5 border-destructive/20' : 'bg-green-50 border-green-200'}`}>
                        <h4 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${currentNode.result?.isNegative ? 'text-destructive' : 'text-green-800'}`}>
                            {currentNode.result?.isNegative ? <HelpCircle /> : <FileCheck />}
                            {currentNode.result?.isNegative ? 'NEGATIVA / RESTRITO' : 'AUTORIZADO / PROCEDENTE'}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><Label className="text-[10px] uppercase font-bold text-muted-foreground">Política</Label><p className="font-bold text-primary">{currentNode.result?.policy}</p></div>
                            <div><Label className="text-[10px] uppercase font-bold text-muted-foreground">O que oferecer (Diretriz)</Label><p className="text-lg">{currentNode.result?.offered}</p></div>
                            {currentNode.result?.exemption && <div><Label className="text-[10px] uppercase font-bold text-muted-foreground">Isenções</Label><p className="text-sm">{currentNode.result.exemption}</p></div>}
                            {currentNode.result?.restrictions && <div><Label className="text-[10px] uppercase font-bold text-muted-foreground">Restrições</Label><p className="text-sm">{currentNode.result.restrictions}</p></div>}
                        </div>
                        {currentNode.result?.observations && (
                          <div className="mt-6 p-4 bg-white/50 rounded-lg border border-dashed border-primary/20">
                             <Label className="text-[10px] uppercase font-bold mb-2 block">Considerações do Hub</Label>
                             <p className="italic text-sm text-foreground/80">"{currentNode.result.observations}"</p>
                          </div>
                        )}
                    </div>
                </div>
            )}
        </CardContent>
        <CardFooter className="bg-muted/10 border-t p-6 flex justify-between">
            <Button variant="ghost" onClick={() => setSelectedFlow(null)}>Cancelar</Button>
            {currentNode.type === 'result' && <Button onClick={() => handleFinish(currentNode.result!)} className="px-8">Concluir e Salvar Caso</Button>}
        </CardFooter>
      </Card>
    </div>
  );
}
