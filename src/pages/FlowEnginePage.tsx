import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/store';
import { FlowNode, DecisionResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export default function FlowEnginePage() {
  const { id } = useParams();
  const { flows, session, addCase } = useApp();
  const navigate = useNavigate();
  
  const flow = flows.find(f => f.id === id);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(flow?.rootNodeId || null);
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!session) navigate('/');
  }, [session, navigate]);

  if (!flow || !currentNodeId) return <div>Fluxo não encontrado</div>;

  const currentNode = flow.nodes[currentNodeId];

  const handleOptionSelect = (nextNodeId: string) => {
    setHistory([...history, currentNodeId]);
    setCurrentNodeId(nextNodeId);
  };

  const handleReset = () => {
    setCurrentNodeId(flow.rootNodeId);
    setHistory([]);
  };

  const handleBack = () => {
    if (history.length === 0) {
      navigate('/dashboard');
      return;
    }
    const newHistory = [...history];
    const prevNodeId = newHistory.pop();
    setHistory(newHistory);
    setCurrentNodeId(prevNodeId || flow.rootNodeId);
  };

  const handleFinish = () => {
    if (currentNode.type === 'result' && currentNode.result && session) {
      addCase({
        id: Math.random().toString(36).substr(2, 9),
        agentBp: session.bp,
        protocol: session.protocol,
        locator: session.locator,
        flowTitle: flow.title,
        path: [...history.map(hid => flow.nodes[hid].text || 'Pergunta'), currentNode.id],
        finalResult: currentNode.result,
        timestamp: new Date().toISOString()
      });
      navigate('/dashboard');
    }
  };

  const copyToClipboard = () => {
    if (currentNode.type === 'result' && currentNode.result) {
      const text = `
PARECER OPERACIONAL - GSS LATAM
Fluxo: ${flow.title}
Política: ${currentNode.result.policy}
Oferecido: ${currentNode.result.offered}
Isenção: ${currentNode.result.exemption}
Restrições: ${currentNode.result.restrictions}
Observações: ${currentNode.result.observations}
      `.trim();
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="text-slate-400 hover:text-[#1B0088] hover:bg-slate-50 rounded-xl px-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Separator orientation="vertical" className="h-6 bg-slate-100" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">{flow.title}</h2>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Protocolo</span>
            <span className="text-xs font-bold text-slate-600">{session?.protocol}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Localizador</span>
            <span className="text-xs font-bold text-slate-600 uppercase">{session?.locator}</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentNodeId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {currentNode.type === 'question' ? (
            <Card className="border-none shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-[40px] overflow-hidden bg-white">
              <div className="h-2 bg-slate-50">
                <div 
                  className="h-full bg-red-600 transition-all duration-700 ease-out" 
                  style={{ width: `${Math.max(5, (history.length / 8) * 100)}%` }} 
                />
              </div>
              <CardHeader className="pb-10 pt-16 text-center px-12">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl mb-6">
                  <Info className="text-[#1B0088] w-7 h-7" />
                </div>
                <CardTitle className="text-3xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                  {currentNode.text}
                </CardTitle>
                <CardDescription className="text-slate-400 mt-4 text-base font-medium">
                  Analise as condições do passageiro e selecione a opção correspondente.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-12 pb-12">
                <div className="grid grid-cols-1 gap-4">
                  {currentNode.options?.map((option, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="h-auto py-6 px-8 justify-between text-left border-slate-100 hover:border-[#1B0088] hover:bg-slate-50 group transition-all duration-300 rounded-2xl"
                      onClick={() => handleOptionSelect(option.nextNodeId)}
                    >
                      <span className="font-bold text-slate-700 group-hover:text-[#1B0088] text-lg tracking-tight">{option.text}</span>
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-[#1B0088] transition-colors duration-300">
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50/50 px-12 py-6 flex justify-between items-center border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Etapa {history.length + 1}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-400 hover:text-red-600 font-bold text-[10px] uppercase tracking-widest">
                  <RotateCcw className="w-3.5 h-3.5 mr-2" />
                  Reiniciar Fluxo
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className={cn(
              "border-none shadow-[0_30px_80px_rgba(0,0,0,0.1)] rounded-[40px] overflow-hidden bg-white",
              currentNode.result?.isNegative ? "ring-2 ring-red-100" : "ring-2 ring-emerald-100"
            )}>
              <CardHeader className={cn(
                "pb-10 pt-16 text-center px-12 relative overflow-hidden",
                currentNode.result?.isNegative ? "bg-red-600" : "bg-emerald-600"
              )}>
                {/* Decorative circles */}
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-black/10 rounded-full blur-3xl" />
                
                <div className="flex justify-center mb-6 relative z-10">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[28px] flex items-center justify-center shadow-xl">
                    {currentNode.result?.isNegative ? (
                      <AlertCircle className="w-10 h-10 text-white" />
                    ) : (
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    )}
                  </div>
                </div>
                <CardTitle className="text-4xl font-black text-white tracking-tighter relative z-10">Parecer Operacional</CardTitle>
                <CardDescription className="text-white/80 font-bold text-lg mt-2 relative z-10 uppercase tracking-wide">
                  {currentNode.result?.policy}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-12 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">O que oferecer</p>
                    <p className="text-slate-900 font-bold text-lg leading-tight">{currentNode.result?.offered}</p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Isenções</p>
                    <p className="text-slate-900 font-bold text-lg leading-tight">{currentNode.result?.exemption}</p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Restrições</p>
                    <p className="text-slate-900 font-bold text-lg leading-tight">{currentNode.result?.restrictions}</p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Observações</p>
                    <p className="text-slate-500 font-medium leading-relaxed italic">{currentNode.result?.observations}</p>
                  </div>
                </div>

                <Separator className="bg-slate-50" />

                <div className="bg-slate-50/50 p-8 rounded-[32px] border border-slate-100">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <FileText className="w-4 h-4 text-[#1B0088]" />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Texto para Log</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyToClipboard} 
                      className={cn(
                        "h-10 px-5 rounded-xl border-slate-200 font-bold text-xs transition-all",
                        copied ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-white text-slate-600"
                      )}
                    >
                      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copied ? 'Copiado' : 'Copiar Texto'}
                    </Button>
                  </div>
                  <pre className="text-xs font-mono text-slate-600 whitespace-pre-wrap bg-white p-6 rounded-2xl border border-slate-100 shadow-inner leading-relaxed">
                    {`PARECER: ${currentNode.result?.policy}\nTRATATIVA: ${currentNode.result?.offered}\nISENÇÃO: ${currentNode.result?.exemption}`}
                  </pre>
                </div>
              </CardContent>

              <CardFooter className="bg-slate-50/50 p-12 flex gap-4 border-t border-slate-50">
                <Button 
                  variant="outline" 
                  className="flex-1 h-16 border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-white hover:text-slate-900 transition-all"
                  onClick={handleReset}
                >
                  <RotateCcw className="w-5 h-5 mr-3" />
                  Refazer Fluxo
                </Button>
                <Button 
                  className={cn(
                    "flex-1 h-16 text-white font-black rounded-2xl shadow-xl transition-all active:scale-[0.98]",
                    currentNode.result?.isNegative ? "bg-red-600 hover:bg-red-700 shadow-red-900/20" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20"
                  )}
                  onClick={handleFinish}
                >
                  Finalizar Atendimento
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </CardFooter>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
