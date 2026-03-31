import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  Users, 
  FileCheck, 
  AlertTriangle, 
  Clock, 
  Download,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { cases } = useApp();
  const [search, setSearch] = useState('');

  const filteredCases = cases.filter(c => 
    c.agentBp.toLowerCase().includes(search.toLowerCase()) ||
    c.protocol.toLowerCase().includes(search.toLowerCase()) ||
    c.locator.toLowerCase().includes(search.toLowerCase())
  );

  // Stats calculation
  const totalCases = cases.length;
  const negativeCases = cases.filter(c => c.finalResult.isNegative).length;
  const positiveCases = totalCases - negativeCases;
  const uniqueAgents = new Set(cases.map(c => c.agentBp)).size;

  const chartData = [
    { name: 'Positivos', value: positiveCases, color: '#10b981' },
    { name: 'Negativos', value: negativeCases, color: '#ef4444' },
  ];

  const flowStats = cases.reduce((acc: any, curr) => {
    acc[curr.flowTitle] = (acc[curr.flowTitle] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.keys(flowStats).map(key => ({
    name: key,
    count: flowStats[key]
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  const exportToCSV = () => {
    const headers = ['ID', 'Data', 'BP Agente', 'Protocolo', 'Localizador', 'Fluxo', 'Política', 'Resultado'];
    const rows = cases.map(c => [
      c.id,
      format(new Date(c.timestamp), 'dd/MM/yyyy HH:mm'),
      c.agentBp,
      c.protocol,
      c.locator,
      c.flowTitle,
      c.finalResult.policy,
      c.finalResult.isNegative ? 'Negativo' : 'Positivo'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_gss_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-[#1B0088] tracking-tight">Painel Administrativo</h1>
          <p className="text-slate-500 mt-1 font-medium">Monitoramento de performance e conformidade operacional.</p>
        </div>
        <Button onClick={exportToCSV} className="bg-[#1B0088] hover:bg-[#15006b] text-white rounded-xl shadow-lg shadow-blue-900/10">
          <Download className="w-4 h-4 mr-2" />
          Exportar Dados
        </Button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Atendimentos</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{totalCases}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <FileCheck className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Negativas Operacionais</p>
                <h3 className="text-3xl font-bold text-red-600 mt-1">{negativeCases}</h3>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Agentes Ativos</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{uniqueAgents}</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Taxa de Isenção</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">
                  {totalCases > 0 ? ((positiveCases / totalCases) * 100).toFixed(1) : 0}%
                </h3>
              </div>
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Volume por Fluxo (Top 5)</CardTitle>
            <CardDescription>Distribuição dos tipos de tratativas mais frequentes.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 40, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  width={120}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#1e293b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Perfil de Resultado</CardTitle>
            <CardDescription>Proporção de isenções vs negativas.</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Cases Table */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle className="text-lg">Histórico de Atendimentos</CardTitle>
            <CardDescription>Lista detalhada de todos os casos processados.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Filtrar por BP ou Protocolo..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 h-9 text-sm border-slate-200"
              />
            </div>
            <Button variant="outline" size="sm" className="h-9 border-slate-200">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest pl-6">Data/Hora</TableHead>
                <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Agente (BP)</TableHead>
                <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Protocolo</TableHead>
                <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Localizador</TableHead>
                <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Fluxo</TableHead>
                <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest pr-6 text-right">Resultado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.map((c) => (
                <TableRow key={c.id} className="hover:bg-slate-50/50">
                  <TableCell className="pl-6 text-slate-600 font-medium">
                    {format(new Date(c.timestamp), "dd MMM, HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">{c.agentBp}</TableCell>
                  <TableCell className="text-slate-500 text-xs font-mono">{c.protocol}</TableCell>
                  <TableCell className="font-bold text-slate-700 uppercase">{c.locator}</TableCell>
                  <TableCell className="text-slate-600">{c.flowTitle}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <Badge 
                      variant={c.finalResult.isNegative ? "destructive" : "secondary"}
                      className={cn(
                        "font-semibold",
                        !c.finalResult.isNegative && "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                      )}
                    >
                      {c.finalResult.isNegative ? "Negativo" : "Isento"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCases.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-400">
                    Nenhum registro encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
