import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { OperationalFlow, FlowNode, DecisionOption, DecisionResult } from '@/lib/types';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Plus, 
  Trash2, 
  Save, 
  PlusCircle, 
  GitBranch, 
  FileText, 
  Settings2,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export default function FlowBuilderPage() {
  const { flows, saveFlow, deleteFlow } = useApp();
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [editingFlow, setEditingFlow] = useState<OperationalFlow | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleCreateNew = () => {
    const newId = `flow-${Date.now()}`;
    const newFlow: OperationalFlow = {
      id: newId,
      title: 'Novo Fluxo',
      description: 'Descrição do fluxo...',
      active: true,
      rootNodeId: 'start',
      nodes: {
        'start': {
          id: 'start',
          type: 'question',
          text: 'Pergunta inicial?',
          options: []
        }
      }
    };
    setEditingFlow(newFlow);
    setSelectedFlowId(newId);
    setSelectedNodeId('start');
  };

  const handleSelectFlow = (id: string) => {
    const flow = flows.find(f => f.id === id);
    if (flow) {
      setEditingFlow(JSON.parse(JSON.stringify(flow)));
      setSelectedFlowId(id);
      setSelectedNodeId(flow.rootNodeId);
    }
  };

  const handleSaveFlow = () => {
    if (editingFlow) {
      saveFlow(editingFlow);
      alert('Fluxo salvo com sucesso!');
    }
  };

  const handleDeleteFlow = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este fluxo?')) {
      deleteFlow(id);
      if (selectedFlowId === id) {
        setEditingFlow(null);
        setSelectedFlowId(null);
      }
    }
  };

  const updateNode = (nodeId: string, updates: Partial<FlowNode>) => {
    if (!editingFlow) return;
    const updatedNodes = { ...editingFlow.nodes };
    updatedNodes[nodeId] = { ...updatedNodes[nodeId], ...updates };
    setEditingFlow({ ...editingFlow, nodes: updatedNodes });
  };

  const addNode = (type: 'question' | 'result') => {
    if (!editingFlow) return;
    const newId = `node-${Date.now()}`;
    const newNode: FlowNode = type === 'question' 
      ? { id: newId, type: 'question', text: 'Nova Pergunta?', options: [] }
      : { id: newId, type: 'result', result: { policy: '', offered: '', exemption: '', restrictions: '', observations: '' } };
    
    const updatedNodes = { ...editingFlow.nodes, [newId]: newNode };
    setEditingFlow({ ...editingFlow, nodes: updatedNodes });
    setSelectedNodeId(newId);
  };

  const deleteNode = (nodeId: string) => {
    if (!editingFlow || nodeId === editingFlow.rootNodeId) return;
    const updatedNodes = { ...editingFlow.nodes };
    delete updatedNodes[nodeId];
    setEditingFlow({ ...editingFlow, nodes: updatedNodes });
    setSelectedNodeId(editingFlow.rootNodeId);
  };

  const addOption = (nodeId: string) => {
    if (!editingFlow) return;
    const node = editingFlow.nodes[nodeId];
    if (node.type !== 'question') return;
    
    const newOption: DecisionOption = { text: 'Nova Opção', nextNodeId: '' };
    const updatedOptions = [...(node.options || []), newOption];
    updateNode(nodeId, { options: updatedOptions });
  };

  const updateOption = (nodeId: string, index: number, updates: Partial<DecisionOption>) => {
    if (!editingFlow) return;
    const node = editingFlow.nodes[nodeId];
    if (node.type !== 'question' || !node.options) return;
    
    const updatedOptions = [...node.options];
    updatedOptions[index] = { ...updatedOptions[index], ...updates };
    updateNode(nodeId, { options: updatedOptions });
  };

  const removeOption = (nodeId: string, index: number) => {
    if (!editingFlow) return;
    const node = editingFlow.nodes[nodeId];
    if (node.type !== 'question' || !node.options) return;
    
    const updatedOptions = node.options.filter((_, i) => i !== index);
    updateNode(nodeId, { options: updatedOptions });
  };

  return (
    <div className="h-[calc(100vh-2rem)] p-8 flex gap-8">
      {/* Sidebar: Flow List */}
      <div className="w-80 flex flex-col gap-4">
        <Card className="flex-1 border-slate-200 overflow-hidden flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Fluxos</CardTitle>
              <Button size="icon" variant="ghost" onClick={handleCreateNew} className="h-8 w-8 text-[#E8114B] hover:bg-red-50">
                <PlusCircle className="w-5 h-5" />
              </Button>
            </div>
            <CardDescription>Gerencie as árvores de decisão.</CardDescription>
          </CardHeader>
          <Separator />
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {flows.map(flow => (
                <div 
                  key={flow.id}
                  className={cn(
                    "group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all",
                    selectedFlowId === flow.id ? "bg-red-50 border border-red-100" : "hover:bg-slate-50 border border-transparent"
                  )}
                  onClick={() => handleSelectFlow(flow.id)}
                >
                  <div className="overflow-hidden">
                    <p className={cn("text-sm font-bold truncate", selectedFlowId === flow.id ? "text-[#E8114B]" : "text-slate-700")}>
                      {flow.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate uppercase mt-0.5">{Object.keys(flow.nodes).length} nós</p>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-[#E8114B]"
                    onClick={(e) => { e.stopPropagation(); handleDeleteFlow(flow.id); }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {editingFlow ? (
          <>
            {/* Flow Header Config */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6 flex items-center gap-6">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-400">Título do Fluxo</Label>
                    <Input 
                      value={editingFlow.title} 
                      onChange={e => setEditingFlow({...editingFlow, title: e.target.value})}
                      className="h-9 font-bold text-slate-900 border-slate-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-400">Descrição</Label>
                    <Input 
                      value={editingFlow.description} 
                      onChange={e => setEditingFlow({...editingFlow, description: e.target.value})}
                      className="h-9 text-slate-600 border-slate-200"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 border-l border-slate-100 pl-6">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-medium text-slate-500">Ativo</Label>
                    <Switch 
                      checked={editingFlow.active} 
                      onCheckedChange={checked => setEditingFlow({...editingFlow, active: checked})}
                    />
                  </div>
                  <Button onClick={handleSaveFlow} className="bg-[#1B0088] hover:bg-[#15006b] shadow-lg shadow-blue-900/20 rounded-xl">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Fluxo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Node Editor */}
            <div className="flex-1 flex gap-4 overflow-hidden">
              {/* Node List */}
              <Card className="w-64 border-slate-200 flex flex-col overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center justify-between">
                    Nós do Fluxo
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => addNode('question')}>
                        <GitBranch className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => addNode('result')}>
                        <FileText className="w-4 h-4 text-emerald-600" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1">
                  <div className="p-2 space-y-1">
                    {(Object.values(editingFlow.nodes) as FlowNode[]).map(node => (
                      <div 
                        key={node.id}
                        className={cn(
                          "p-2.5 rounded-md cursor-pointer text-xs flex items-center gap-2 border transition-all",
                          selectedNodeId === node.id 
                            ? "bg-slate-900 text-white border-slate-900" 
                            : "bg-white text-slate-600 border-slate-100 hover:border-slate-300"
                        )}
                        onClick={() => setSelectedNodeId(node.id)}
                      >
                        {node.type === 'question' ? <GitBranch className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                        <span className="truncate flex-1">{node.text || node.result?.policy || 'Sem título'}</span>
                        {node.id === editingFlow.rootNodeId && <Badge className="h-4 px-1 text-[8px] bg-red-600">INÍCIO</Badge>}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>

              {/* Node Properties */}
              <Card className="flex-1 border-slate-200 overflow-hidden flex flex-col">
                {selectedNodeId && editingFlow.nodes[selectedNodeId] ? (
                  <>
                    <CardHeader className="pb-4 border-b border-slate-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            editingFlow.nodes[selectedNodeId].type === 'question' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                          )}>
                            {editingFlow.nodes[selectedNodeId].type === 'question' ? <GitBranch className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                          </div>
                          <div>
                            <CardTitle className="text-lg">Configuração do Nó</CardTitle>
                            <CardDescription className="text-[10px] uppercase font-bold tracking-widest">ID: {selectedNodeId}</CardDescription>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-slate-400 hover:text-red-600"
                          disabled={selectedNodeId === editingFlow.rootNodeId}
                          onClick={() => deleteNode(selectedNodeId)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir Nó
                        </Button>
                      </div>
                    </CardHeader>
                    <ScrollArea className="flex-1">
                      <CardContent className="p-6 space-y-6">
                        {editingFlow.nodes[selectedNodeId].type === 'question' ? (
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold text-slate-700">Texto da Pergunta</Label>
                              <Textarea 
                                value={editingFlow.nodes[selectedNodeId].text || ''} 
                                onChange={e => updateNode(selectedNodeId, { text: e.target.value })}
                                className="min-h-[80px] border-slate-200 resize-none"
                                placeholder="O que o agente deve perguntar?"
                              />
                            </div>
                            
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm font-semibold text-slate-700">Opções de Resposta</Label>
                                <Button size="sm" variant="outline" onClick={() => addOption(selectedNodeId)} className="h-8 border-slate-200">
                                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                                  Adicionar Opção
                                </Button>
                              </div>
                              
                              <div className="space-y-3">
                                {editingFlow.nodes[selectedNodeId].options?.map((option, idx) => (
                                  <div key={idx} className="flex gap-3 items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="flex-1 space-y-3">
                                      <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold uppercase text-slate-400">Texto da Opção</Label>
                                        <Input 
                                          value={option.text} 
                                          onChange={e => updateOption(selectedNodeId, idx, { text: e.target.value })}
                                          className="h-8 text-sm bg-white border-slate-200"
                                        />
                                      </div>
                                      <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold uppercase text-slate-400">Próximo Nó (Destino)</Label>
                                        <Select 
                                          value={option.nextNodeId} 
                                          onValueChange={val => updateOption(selectedNodeId, idx, { nextNodeId: val })}
                                        >
                                          <SelectTrigger className="h-8 text-sm bg-white border-slate-200">
                                            <SelectValue placeholder="Selecione o destino..." />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {(Object.values(editingFlow.nodes) as FlowNode[]).filter(n => n.id !== selectedNodeId).map(n => (
                                              <SelectItem key={n.id} value={n.id}>
                                                {n.type === 'question' ? 'Q: ' : 'R: '} {n.text || n.result?.policy || n.id}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      className="h-8 w-8 text-slate-400 hover:text-red-600 mt-5"
                                      onClick={() => removeOption(selectedNodeId, idx)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                                {(!editingFlow.nodes[selectedNodeId].options || editingFlow.nodes[selectedNodeId].options.length === 0) && (
                                  <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-xl">
                                    <p className="text-xs text-slate-400">Nenhuma opção configurada.</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                              <div className="flex items-center gap-3">
                                <AlertCircle className={cn("w-5 h-5", editingFlow.nodes[selectedNodeId].result?.isNegative ? "text-red-600" : "text-emerald-600")} />
                                <div>
                                  <p className="text-sm font-bold text-slate-900">Resultado Negativo?</p>
                                  <p className="text-[10px] text-slate-500 uppercase font-medium">Sinaliza em vermelho no motor</p>
                                </div>
                              </div>
                              <Switch 
                                checked={editingFlow.nodes[selectedNodeId].result?.isNegative || false}
                                onCheckedChange={checked => {
                                  const result = { ...editingFlow.nodes[selectedNodeId].result!, isNegative: checked };
                                  updateNode(selectedNodeId, { result });
                                }}
                              />
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">Política Aplicada</Label>
                                <Input 
                                  value={editingFlow.nodes[selectedNodeId].result?.policy || ''} 
                                  onChange={e => {
                                    const result = { ...editingFlow.nodes[selectedNodeId].result!, policy: e.target.value };
                                    updateNode(selectedNodeId, { result });
                                  }}
                                  className="border-slate-200"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">O que oferecer</Label>
                                <Textarea 
                                  value={editingFlow.nodes[selectedNodeId].result?.offered || ''} 
                                  onChange={e => {
                                    const result = { ...editingFlow.nodes[selectedNodeId].result!, offered: e.target.value };
                                    updateNode(selectedNodeId, { result });
                                  }}
                                  className="min-h-[60px] border-slate-200 resize-none"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-sm font-semibold text-slate-700">Isenções</Label>
                                  <Input 
                                    value={editingFlow.nodes[selectedNodeId].result?.exemption || ''} 
                                    onChange={e => {
                                      const result = { ...editingFlow.nodes[selectedNodeId].result!, exemption: e.target.value };
                                      updateNode(selectedNodeId, { result });
                                    }}
                                    className="border-slate-200"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-semibold text-slate-700">Restrições</Label>
                                  <Input 
                                    value={editingFlow.nodes[selectedNodeId].result?.restrictions || ''} 
                                    onChange={e => {
                                      const result = { ...editingFlow.nodes[selectedNodeId].result!, restrictions: e.target.value };
                                      updateNode(selectedNodeId, { result });
                                    }}
                                    className="border-slate-200"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">Observações</Label>
                                <Textarea 
                                  value={editingFlow.nodes[selectedNodeId].result?.observations || ''} 
                                  onChange={e => {
                                    const result = { ...editingFlow.nodes[selectedNodeId].result!, observations: e.target.value };
                                    updateNode(selectedNodeId, { result });
                                  }}
                                  className="min-h-[60px] border-slate-200 resize-none"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </ScrollArea>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-10 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <Settings2 className="w-8 h-8 text-slate-200" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Selecione um nó</h3>
                    <p className="text-sm max-w-[200px]">Clique em um nó na lista lateral para editar suas propriedades.</p>
                  </div>
                )}
              </Card>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-10 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
              <GitBranch className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Editor de Fluxos GSS</h3>
            <p className="text-slate-500 mt-2 max-w-sm">
              Selecione um fluxo existente na lista lateral ou crie um novo para começar a desenhar a árvore de decisão.
            </p>
            <Button onClick={handleCreateNew} className="mt-8 bg-[#E8114B] hover:bg-[#c40e3f] h-11 px-8 rounded-xl shadow-lg shadow-red-900/20">
              <Plus className="w-4 h-4 mr-2" />
              Criar Novo Fluxo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
