"use client";

import React, { useMemo, useState } from 'react';
import { useAppContext } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Download, Users, BarChart3, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as XLSX from 'xlsx';
import { formatDate } from '@/lib/utils';

export function MatrizDashboard() {
  const { cases } = useAppContext();
  const [selectedBp, setSelectedBp] = useState<string>('all');

  const uniqueBps = useMemo(() => Array.from(new Set(cases.map(c => c.agentBp))).sort(), [cases]);

  const filteredCases = useMemo(() => {
    if (selectedBp === 'all') return cases;
    return cases.filter(c => c.agentBp === selectedBp);
  }, [cases, selectedBp]);

  const flowUsageData = useMemo(() => {
    const stats: Record<string, number> = {};
    filteredCases.forEach(c => stats[c.flowTitle] = (stats[c.flowTitle] || 0) + 1);
    return Object.entries(stats).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredCases]);

  const agentActivityData = useMemo(() => {
    const stats: Record<string, number> = {};
    cases.forEach(c => stats[c.agentBp] = (stats[c.agentBp] || 0) + 1);
    return Object.entries(stats).map(([bp, total]) => ({ bp, total })).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [cases]);

  const handleExportXlsx = () => {
    const data = filteredCases.map(c => ({
      Data: formatDate(c.timestamp),
      Agente_BP: c.agentBp,
      PNR: c.locator,
      Protocolo: c.protocol,
      Fluxo_Executado: c.flowTitle,
      Parecer_Hub: c.finalResult.policy,
      O_Que_Oferecer: c.finalResult.offered,
      Status: c.finalResult.isNegative ? 'NEGATIVA' : 'AUTORIZADO',
      Caminho_Decisao: c.path.join(' -> ')
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório_GSS_Matriz");
    XLSX.writeFile(workbook, `Relatorio_Matriz_GSS_${selectedBp === 'all' ? 'Completo' : selectedBp}_${new Date().toLocaleDateString()}.xlsx`);
  };

  const COLORS = ['#070738', '#E30613', '#005f6a', '#4B0082', '#00BFFF'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-primary"><BarChart3 className="w-6 h-6"/> Performance Operacional Matriz</h2>
        <div className="flex gap-3 w-full md:w-auto">
          <Select value={selectedBp} onValueChange={setSelectedBp}>
            <SelectTrigger className="w-full md:w-[200px] bg-white"><SelectValue placeholder="Filtrar por Agente (BP)" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Agentes</SelectItem>
              {uniqueBps.map(bp => <SelectItem key={bp} value={bp}>BP: {bp}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={handleExportXlsx} variant="outline" className="gap-2 shadow-sm"><Download className="w-4 h-4" /> Exportar Planilha</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/50"><CardHeader className="pb-2"><CardDescription className="text-[10px] uppercase font-bold">Total Acionamentos</CardDescription><CardTitle className="text-3xl">{filteredCases.length}</CardTitle></CardHeader></Card>
        <Card className="border-l-4 border-l-green-500 bg-white/50"><CardHeader className="pb-2"><CardDescription className="text-[10px] uppercase font-bold">Autorizados</CardDescription><CardTitle className="text-3xl text-green-700">{filteredCases.filter(c => !c.finalResult.isNegative).length}</CardTitle></CardHeader></Card>
        <Card className="border-l-4 border-l-red-500 bg-white/50"><CardHeader className="pb-2"><CardDescription className="text-[10px] uppercase font-bold">Negativas</CardDescription><CardTitle className="text-3xl text-red-600">{filteredCases.filter(c => c.finalResult.isNegative).length}</CardTitle></CardHeader></Card>
        <Card className="bg-white/50"><CardHeader className="pb-2"><CardDescription className="text-[10px] uppercase font-bold">Fluxo mais usado</CardDescription><CardTitle className="text-xl truncate" title={flowUsageData[0]?.name}>{flowUsageData[0]?.name || '---'}</CardTitle></CardHeader></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Uso de Fluxos por Volume</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            {flowUsageData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={flowUsageData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={120} fontSize={10} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {flowUsageData.map((_, i) => <Cell key={`c-${i}`} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                    </BarChart>
                </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-muted-foreground italic">Sem dados registrados.</div>}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Ranking BPs mais Ativos</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            {agentActivityData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={agentActivityData} margin={{ bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="bp" fontSize={10} label={{ value: 'BP Agente', position: 'bottom', offset: 0 }} />
                        <YAxis fontSize={10} />
                        <Tooltip />
                        <Bar dataKey="total" fill="#E30613" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-muted-foreground italic">Sem dados registrados.</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
