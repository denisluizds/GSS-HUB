import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, ShieldCheck, ArrowRight, User, Hash, Ticket } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
  const { startSession, loginAdmin } = useApp();
  const navigate = useNavigate();
  const [bp, setBp] = useState('');
  const [protocol, setProtocol] = useState('');
  const [locator, setLocator] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bp || !protocol || !locator) return;
    
    startSession({
      bp,
      protocol,
      locator,
      startTime: new Date().toISOString()
    });
    navigate('/dashboard');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(adminPass)) {
      navigate('/admin');
    } else {
      alert('Senha incorreta');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#1B0088]" />
      <div className="absolute top-1 left-0 w-full h-1 bg-red-600" />
      
      <div className="w-full max-w-[440px] relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-xl shadow-blue-900/5 mb-6 border border-slate-100">
            <Plane className="text-[#1B0088] w-10 h-10 -rotate-45" />
          </div>
          <h1 className="text-4xl font-black text-[#1B0088] tracking-tighter mb-2">Matriz GSS</h1>
          <p className="text-slate-400 font-medium text-sm uppercase tracking-[0.2em]">Governança LATAM Airlines</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {!showAdmin ? (
            <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white rounded-[32px] overflow-hidden">
              <CardHeader className="pt-10 px-10 pb-6 text-center">
                <CardTitle className="text-2xl font-bold text-slate-900">Início de Atendimento</CardTitle>
                <CardDescription className="text-slate-400 mt-2">
                  Preencha os dados do agente e do passageiro para acessar os fluxos.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleStart}>
                <CardContent className="px-10 space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="bp" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">BP do Agente</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <Input 
                        id="bp" 
                        placeholder="Ex: BP123456" 
                        value={bp} 
                        onChange={e => setBp(e.target.value)}
                        className="h-14 pl-12 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-300 focus-visible:ring-[#1B0088]"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="protocol" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Protocolo / Caso</Label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <Input 
                        id="protocol" 
                        placeholder="Ex: CAS-12345-X" 
                        value={protocol} 
                        onChange={e => setProtocol(e.target.value)}
                        className="h-14 pl-12 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-300 focus-visible:ring-[#1B0088]"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="locator" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Localizador / TKT</Label>
                    <div className="relative">
                      <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <Input 
                        id="locator" 
                        placeholder="Ex: ABCDEF" 
                        value={locator} 
                        onChange={e => setLocator(e.target.value)}
                        className="h-14 pl-12 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-300 focus-visible:ring-[#1B0088] uppercase"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="px-10 pb-10 pt-6 flex flex-col gap-4">
                  <Button type="submit" className="w-full bg-[#1B0088] hover:bg-[#15006b] text-white font-bold h-14 rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]">
                    Acessar Matriz
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setShowAdmin(true)}
                    className="text-slate-400 hover:text-[#1B0088] hover:bg-slate-50 w-full text-[10px] font-bold uppercase tracking-widest"
                  >
                    <ShieldCheck className="mr-2 w-4 h-4" />
                    Acesso Administrativo
                  </Button>
                </CardFooter>
              </form>
            </Card>
          ) : (
            <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white rounded-[32px] overflow-hidden">
              <CardHeader className="pt-10 px-10 pb-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                    <ShieldCheck className="text-red-600 w-6 h-6" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900">Área Administrativa</CardTitle>
                <CardDescription className="text-slate-400 mt-2">
                  Acesso restrito para supervisores e gestores da Matriz GSS.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleAdminLogin}>
                <CardContent className="px-10 space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="pass" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Senha de Acesso</Label>
                    <Input 
                      id="pass" 
                      type="password" 
                      placeholder="••••••••" 
                      value={adminPass} 
                      onChange={e => setAdminPass(e.target.value)}
                      className="h-14 px-6 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-300 focus-visible:ring-red-600"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="px-10 pb-10 pt-6 flex flex-col gap-4">
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-14 rounded-2xl shadow-lg shadow-red-900/20 transition-all active:scale-[0.98]">
                    Entrar no Painel
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setShowAdmin(false)}
                    className="text-slate-400 hover:text-slate-900 hover:bg-slate-50 w-full text-[10px] font-bold uppercase tracking-widest"
                  >
                    Voltar ao Atendimento
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}
        </motion.div>
        
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 opacity-30 grayscale">
            <img src="https://picsum.photos/seed/latam/100/40" alt="LATAM" className="h-4" referrerPolicy="no-referrer" />
          </div>
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">
            LATAM Airlines Group © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
