"use client";

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/lib/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Workflow, 
  FileText, 
  Video, 
  Megaphone, 
  MessageSquare, 
  Award,
  LogOut,
  ShieldCheck,
  ArrowLeft,
  Users
} from 'lucide-react';
import { MatrizDashboard } from '@/components/matriz/MatrizDashboard';
import { FlowBuilder } from '@/components/matriz/FlowBuilder';
import { PolicyManager } from './PolicyManager';
import { BannerManager } from './BannerManager';
import { FastLearningManager } from './FastLearningManager';
import { FeedbackManager } from './FeedbackManager';
import { RecognitionManager } from './RecognitionManager';
import { UserManager } from './UserManager';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function AdminPanel() {
  const { isAdmin, logout, currentUser } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <div className="bg-slate-50/30">
      <main className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8">
        {/* Admin Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] border shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/10">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-black tracking-tighter text-slate-900">Painel Administrativo</h1>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold uppercase tracking-widest text-[10px]">Acesso Total</Badge>
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Centro de Comando GSS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <Button 
              variant="outline" 
              className="rounded-xl font-bold gap-2 border-slate-200 hover:bg-slate-50"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Início
            </Button>
            <Button 
              variant="destructive" 
              className="rounded-xl font-bold gap-2 shadow-lg shadow-red-900/10"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <TabsList className="bg-white border shadow-sm p-1 h-auto flex-wrap justify-start rounded-2xl">
              <TabsTrigger value="dashboard" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2 font-bold text-xs uppercase tracking-wider">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </TabsTrigger>
              <TabsTrigger value="matriz" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2 font-bold text-xs uppercase tracking-wider">
                <Workflow className="w-4 h-4" /> Matriz Inteligente
              </TabsTrigger>
              <TabsTrigger value="content" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2 font-bold text-xs uppercase tracking-wider">
                <FileText className="w-4 h-4" /> Conteúdo (CMS)
              </TabsTrigger>
              <TabsTrigger value="feedback" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2 font-bold text-xs uppercase tracking-wider">
                <MessageSquare className="w-4 h-4" /> Feedback
              </TabsTrigger>
              <TabsTrigger value="users" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2 font-bold text-xs uppercase tracking-wider">
                <Users className="w-4 h-4" /> Usuários
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Sincronizado com Servidor
            </div>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="dashboard" className="mt-0">
              <MatrizDashboard />
            </TabsContent>

            <TabsContent value="matriz" className="mt-0">
              <FlowBuilder />
            </TabsContent>

            <TabsContent value="content" className="mt-0 space-y-8">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <PolicyManager />
                <BannerManager />
                <FastLearningManager />
                <RecognitionManager />
              </div>
            </TabsContent>

            <TabsContent value="feedback" className="mt-0">
              <FeedbackManager />
            </TabsContent>

            <TabsContent value="users" className="mt-0">
              <UserManager />
            </TabsContent>
          </motion.div>
        </Tabs>
      </main>
    </div>
  );
}
