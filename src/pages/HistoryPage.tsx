import React from 'react';
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
import { 
  History, 
  Search, 
  ExternalLink,
  ChevronRight,
  User,
  Calendar
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function HistoryPage() {
  const { cases, session } = useApp();
  const [search, setSearch] = React.useState('');

  const myCases = cases.filter(c => c.agentBp === session?.bp);
  const filteredCases = myCases.filter(c => 
    c.protocol.toLowerCase().includes(search.toLowerCase()) ||
    c.locator.toLowerCase().includes(search.toLowerCase()) ||
    c.flowTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1B0088] tracking-tight">Meu Histórico</h1>
          <p className="text-slate-500 mt-1 font-medium">Consulte seus atendimentos realizados nesta sessão.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Buscar por protocolo ou localizador..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-white border-slate-200 rounded-xl h-11"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Total de Casos</CardDescription>
            <CardTitle className="text-3xl font-bold text-slate-900">{myCases.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Agente Logado</CardDescription>
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-red-600" />
              {session?.bp}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Início do Turno</CardDescription>
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              {session?.startTime ? format(new Date(session.startTime), 'HH:mm') : '--:--'}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest pl-6">Data/Hora</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Protocolo</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Localizador</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Fluxo Utilizado</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Resultado</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest pr-6 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCases.map((c) => (
              <TableRow key={c.id} className="hover:bg-slate-50/50 group">
                <TableCell className="pl-6 text-slate-600 font-medium">
                  {format(new Date(c.timestamp), "dd MMM, HH:mm", { locale: ptBR })}
                </TableCell>
                <TableCell className="text-slate-500 text-xs font-mono">{c.protocol}</TableCell>
                <TableCell className="font-bold text-slate-700 uppercase">{c.locator}</TableCell>
                <TableCell className="text-slate-600">{c.flowTitle}</TableCell>
                <TableCell>
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
                <TableCell className="pr-6 text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredCases.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <History className="w-8 h-8 mb-2 opacity-20" />
                    <p>Nenhum atendimento registrado ainda.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
