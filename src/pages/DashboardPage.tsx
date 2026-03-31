import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Search, Info, Workflow, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'motion/react';

export default function DashboardPage() {
  const { flows, session } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');

  const filteredFlows = flows.filter(f => 
    f.active && (f.title.toLowerCase().includes(search.toLowerCase()) || 
    f.description.toLowerCase().includes(search.toLowerCase()))
  );

  if (!session) {
    navigate('/');
    return null;
  }

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <header className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-red-600 rounded-full" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Catálogo Operacional</p>
          </div>
          <h1 className="text-5xl font-black text-[#1B0088] tracking-tighter leading-none mb-4">
            Fluxos de <br />Atendimento
          </h1>
          <p className="text-slate-500 text-lg font-medium leading-relaxed">
            Selecione o fluxo correspondente à solicitação do passageiro para garantir a aplicação correta das políticas LATAM.
          </p>
        </div>
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
          <Input 
            placeholder="O que você está buscando?" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-14 pl-12 bg-white border-slate-100 rounded-2xl shadow-sm shadow-slate-200/50 text-slate-900 placeholder:text-slate-300 focus-visible:ring-[#1B0088]"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredFlows.map((flow, index) => (
          <motion.div
            key={flow.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="h-full flex flex-col border-none shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 rounded-[32px] overflow-hidden group bg-white">
              <CardHeader className="p-8 pb-4">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-red-50 transition-colors duration-500">
                    <Workflow className="w-6 h-6 text-slate-300 group-hover:text-red-600 transition-colors duration-500" />
                  </div>
                  <Badge variant="secondary" className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase tracking-widest px-3 py-1 border-none">
                    {Object.keys(flow.nodes).length} Etapas
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-black text-slate-900 group-hover:text-[#1B0088] transition-colors duration-500 leading-tight mb-3">
                  {flow.title}
                </CardTitle>
                <CardDescription className="text-slate-400 font-medium leading-relaxed line-clamp-3">
                  {flow.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 mt-auto">
                <Button 
                  onClick={() => navigate(`/fluxos/${flow.id}`)}
                  className="w-full h-14 bg-slate-900 hover:bg-[#1B0088] text-white font-bold rounded-2xl transition-all duration-500 group/btn shadow-lg shadow-slate-900/10"
                >
                  <Play className="w-4 h-4 mr-3 fill-current" />
                  Iniciar Fluxo
                  <ArrowRight className="ml-auto w-5 h-5 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all duration-500" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filteredFlows.length === 0 && (
          <div className="col-span-full py-32 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-50 rounded-full mb-6">
              <Search className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Nenhum fluxo encontrado</h3>
            <p className="text-slate-400 font-medium">Tente buscar por termos diferentes ou verifique a ortografia.</p>
          </div>
        )}
      </div>
    </div>
  );
}
