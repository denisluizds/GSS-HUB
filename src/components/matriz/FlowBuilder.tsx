"use client";

import React, { useState } from 'react';
import { useAppContext } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Workflow, 
  Plus, 
  Trash2, 
  Edit2, 
  Power, 
  Save, 
  ArrowLeft, 
  HelpCircle, 
  FileCheck, 
  PlusCircle,
  X,
  ChevronRight,
  AlertCircle,
  GripVertical
} from 'lucide-react';
import { OperationalFlow, FlowNode, DecisionOption, DecisionResult } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Reorder } from 'framer-motion';

export function FlowBuilder() {
  const { flows, saveFlow } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<OperationalFlow | null>(null);
  const { toast } = useToast();

  const handleCreateNew = () => {
    const newFlow: OperationalFlow = {
      id: `flow-${Math.random().toString(36).substr(2, 9)}`,
      title: 'Novo Fluxo Operacional',
      description: 'Descrição do novo fluxo...',
      active: false,
      rootNodeId: 'node-1',
      nodes: {
        'node-1': {
          id: 'node-1',
          type: 'question',
          text: 'Primeira Pergunta do Fluxo?',
          options: []
        }
      }
    };
    setCurrentFlow(newFlow);
    setIsEditing(true);
  };

  const handleEditFlow = (flow: OperationalFlow) => {
    setCurrentFlow(JSON.parse(JSON.stringify(flow)));
    setIsEditing(true);
  };

  const handleToggleFlow = (flow: OperationalFlow) => {
    saveFlow({ ...flow, active: !flow.active });
    toast({
      title: flow.active ? "Fluxo Desativado" : "Fluxo Ativado",
      description: `O fluxo "${flow.title}" foi ${flow.active ? 'desativado' : 'ativado'}.`,
    });
  };

  const handleSaveFlow = () => {
    if (currentFlow) {
      saveFlow(currentFlow);
      setIsEditing(false);
      setCurrentFlow(null);
      toast({
        title: "Fluxo Salvo",
        description: "As alterações foram registradas com sucesso no Hub.",
      });
    }
  };

  const handleReorderNodes = (newOrder: FlowNode[]) => {
    if (!currentFlow) return;
    const newNodes: Record<string, FlowNode> = {};
    newOrder.forEach(node => {
      newNodes[node.id] = node;
    });
    setCurrentFlow({ ...currentFlow, nodes: newNodes });
  };

  if (isEditing && currentFlow) {
    const nodesList: FlowNode[] = Object.values(currentFlow.nodes);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setIsEditing(false)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar à lista
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
            <Button onClick={handleSaveFlow}>
              <Save className="w-4 h-4 mr-2" /> Salvar Alterações
            </Button>
          </div>
        </div>

        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg">Configurações do Fluxo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="flow-title">Título do Fluxo</Label>
              <Input 
                id="flow-title" 
                value={currentFlow.title} 
                onChange={(e) => setCurrentFlow({...currentFlow, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flow-desc">Descrição</Label>
              <Textarea 
                id="flow-desc" 
                value={currentFlow.description} 
                onChange={(e) => setCurrentFlow({...currentFlow, description: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Árvore de Decisão</h3>
            <div className="flex gap-2">
               <p className="text-xs text-muted-foreground self-center italic">Arraste para reordenar</p>
               <Button variant="outline" size="sm" onClick={() => {
                const id = `node-${Math.random().toString(36).substr(2, 5)}`;
                setCurrentFlow({
                    ...currentFlow,
                    nodes: {
                    ...currentFlow.nodes,
                    [id]: { id, type: 'question', text: 'Nova Pergunta?', options: [] }
                    }
                });
                }}>
                <PlusCircle className="w-4 h-4 mr-2" /> Adicionar Nó
                </Button>
            </div>
          </div>

          <Reorder.Group 
            axis="y" 
            values={nodesList} 
            onReorder={(newOrder) => handleReorderNodes(newOrder as FlowNode[])}
            className="space-y-4"
          >
            {nodesList.map((node) => (
              <Reorder.Item 
                key={node.id} 
                value={node}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="cursor-default"
              >
                <NodeEditor 
                    node={node} 
                    allNodes={nodesList}
                    isRoot={currentFlow.rootNodeId === node.id}
                    onUpdate={(updatedNode) => {
                    setCurrentFlow({
                        ...currentFlow,
                        nodes: { ...currentFlow.nodes, [node.id]: updatedNode }
                    });
                    }}
                    onSetRoot={() => setCurrentFlow({...currentFlow, rootNodeId: node.id})}
                    onDelete={() => {
                    const newNodes = { ...currentFlow.nodes };
                    delete newNodes[node.id];
                    setCurrentFlow({ ...currentFlow, nodes: newNodes });
                    }}
                />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleCreateNew}>
          <Plus className="w-5 h-5 mr-2" /> Novo Fluxo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flows.map((flow) => (
          <Card key={flow.id} className="hover:border-primary/50 transition-all">
            <CardHeader className="py-4 flex flex-row items-center justify-between border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <Workflow className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold truncate max-w-[150px]">{flow.title}</span>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${flow.active ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                {flow.active ? 'Ativo' : 'Inativo'}
              </span>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-6 line-clamp-3 h-12">{flow.description}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditFlow(flow)}>
                  <Edit2 className="w-3.5 h-3.5 mr-2" /> Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleToggleFlow(flow)}
                >
                  <Power className="w-3.5 h-3.5 mr-2" /> {flow.active ? 'Desativar' : 'Ativar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function NodeEditor({ node, allNodes, isRoot, onUpdate, onSetRoot, onDelete }: { 
  node: FlowNode, 
  allNodes: FlowNode[],
  isRoot: boolean,
  onUpdate: (node: FlowNode) => void,
  onSetRoot: () => void,
  onDelete: () => void
}) {
  const addOption = () => {
    const newOption: DecisionOption = { text: 'Nova Opção', nextNodeId: '' };
    onUpdate({
      ...node,
      options: [...(node.options || []), newOption]
    });
  };

  const updateOption = (idx: number, updates: Partial<DecisionOption>) => {
    const newOptions = [...(node.options || [])];
    newOptions[idx] = { ...newOptions[idx], ...updates };
    onUpdate({ ...node, options: newOptions });
  };

  const removeOption = (idx: number) => {
    const newOptions = (node.options || []).filter((_, i) => i !== idx);
    onUpdate({ ...node, options: newOptions });
  };

  const updateResult = (updates: Partial<DecisionResult>) => {
    onUpdate({
      ...node,
      result: {
        ...(node.result || { policy: '', offered: '' } as DecisionResult),
        ...updates
      }
    });
  };

  return (
    <Card className={`border-muted ${isRoot ? 'ring-2 ring-primary ring-offset-2' : ''} bg-card`}>
      <CardHeader className="py-2 bg-muted/30 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded transition-colors" title="Arraste para reordenar">
             <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
          {node.type === 'question' ? <HelpCircle className="w-4 h-4 text-blue-500" /> : <FileCheck className="w-4 h-4 text-green-500" />}
          <span className="text-xs font-bold uppercase text-muted-foreground">{node.id}</span>
          {isRoot && <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">INÍCIO</span>}
        </div>
        <div className="flex gap-2">
          {!isRoot && <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold" onClick={onSetRoot}>DEFINIR COMO INÍCIO</Button>}
          <Button variant="ghost" size="sm" className="h-7 text-destructive" onClick={onDelete}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 space-y-2">
            <Label className="text-xs">Tipo do Nó</Label>
            <Select value={node.type} onValueChange={(val: any) => onUpdate({...node, type: val})}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="question">Pergunta</SelectItem>
                <SelectItem value="result">Resultado Final</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3 space-y-2">
            <Label className="text-xs">{node.type === 'question' ? 'Texto da Pergunta' : 'Identificador'}</Label>
            <Input 
              value={node.text || ''} 
              onChange={(e) => onUpdate({...node, text: e.target.value})}
              className="h-9"
            />
          </div>
        </div>

        {node.type === 'question' ? (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-muted-foreground">Opções de Resposta</Label>
              <Button variant="ghost" size="sm" onClick={addOption} className="h-7 text-primary font-bold">
                <Plus className="w-3 h-3 mr-1" /> Adicionar Opção
              </Button>
            </div>
            <div className="space-y-2">
              {node.options?.map((opt, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-muted/20 p-2 rounded-lg border">
                  <Input 
                    value={opt.text} 
                    onChange={(e) => updateOption(idx, { text: e.target.value })}
                    className="flex-1 h-8 text-sm"
                  />
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <Select value={opt.nextNodeId} onValueChange={(val) => updateOption(idx, { nextNodeId: val })}>
                    <SelectTrigger className="w-[180px] h-8 text-xs">
                      <SelectValue placeholder="Ir para nó..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allNodes.filter(n => n.id !== node.id).map(n => (
                        <SelectItem key={n.id} value={n.id}>{n.id}: {n.text?.substring(0, 20)}...</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" onClick={() => removeOption(idx)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <div className="flex items-center gap-2">
                <AlertCircle className={`w-4 h-4 ${node.result?.isNegative ? 'text-destructive' : 'text-primary'}`} />
                <div>
                  <p className="text-xs font-bold text-foreground">Resultado Negativo / Restritivo</p>
                  <p className="text-[10px] text-muted-foreground">Ativa o alerta visual de Negativa no Hub.</p>
                </div>
              </div>
              <Switch 
                checked={node.result?.isNegative || false} 
                onCheckedChange={(val) => updateResult({ isNegative: val })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Política (Nome do Documento)</Label>
                <Input 
                  value={node.result?.policy || ''} 
                  onChange={(e) => updateResult({ policy: e.target.value })}
                  className="h-8 text-sm"
                  placeholder="Ex: Con Waiver v.2"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Diretriz (O que oferecer)</Label>
                <Input 
                  value={node.result?.offered || ''} 
                  onChange={(e) => updateResult({ offered: e.target.value })}
                  className="h-8 text-sm"
                  placeholder="Ex: Reemissão sem cobrança"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Isenções</Label>
                <Input 
                  value={node.result?.exemption || ''} 
                  onChange={(e) => updateResult({ exemption: e.target.value })}
                  className="h-8 text-sm"
                  placeholder="Ex: Diferença Tarifária"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Restrições</Label>
                <Input 
                  value={node.result?.restrictions || ''} 
                  onChange={(e) => updateResult({ restrictions: e.target.value })}
                  className="h-8 text-sm"
                  placeholder="Ex: Manter origem/destino"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-xs">Considerações / Observações</Label>
                <Textarea 
                  value={node.result?.observations || ''} 
                  onChange={(e) => updateResult({ observations: e.target.value })}
                  className="min-h-[80px] text-sm"
                  placeholder="Instruções adicionais para o agente..."
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
