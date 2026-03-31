"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/lib/hooks';
import { 
  Search, 
  Workflow, 
  BookOpen, 
  Video, 
  ArrowRight, 
  Star, 
  Clock, 
  TrendingUp, 
  ChevronRight,
  Zap,
  ShieldCheck,
  Award,
  Bell,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FlowEngine } from '@/components/matriz/FlowEngine';
import SupabaseDemo from '@/components/SupabaseDemo';
import SupabaseDiagnostic from '@/components/SupabaseDiagnostic';
import { getPolicies, getFastLearningVideos, getAllRecognitions, siteContent } from '@/lib/data';
import { Policy, FastLearningVideo, Recognition } from '@/lib/types';
import { formatDate, getYouTubeVideoId } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function Home() {
  const { setSearchOpen } = useAppContext();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [videos, setVideos] = useState<FastLearningVideo[]>([]);
  const [recognitions, setRecognitions] = useState<Recognition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, v, r] = await Promise.all([
          getPolicies(),
          getFastLearningVideos(),
          getAllRecognitions()
        ]);
        setPolicies(p);
        setVideos(v);
        setRecognitions(r);
      } catch (error) {
        console.error("Erro ao carregar dados da home:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-red-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles className="w-3 h-3" /> Bem-vindo ao Hub LATAM
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black tracking-tighter leading-none"
          >
            {siteContent.homeTitle}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/80 font-medium max-w-xl"
          >
            {siteContent.homeSubtitle}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 font-bold h-14 px-8 rounded-2xl shadow-xl"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-5 h-5 mr-2" /> Pesquisar no Hub
            </Button>
            <Link to="/matriz">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/40 text-white hover:bg-white/10 font-bold h-14 px-8 rounded-2xl backdrop-blur-sm"
              >
                <Workflow className="w-5 h-5 mr-2" /> Abrir Matriz
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick Access Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-muted/50 p-1 rounded-2xl h-14">
            <TabsTrigger value="overview" className="rounded-xl px-6 h-12 data-[state=active]:bg-white data-[state=active]:shadow-md font-bold">Visão Geral</TabsTrigger>
            <TabsTrigger value="policies" className="rounded-xl px-6 h-12 data-[state=active]:bg-white data-[state=active]:shadow-md font-bold">Políticas</TabsTrigger>
            <TabsTrigger value="learning" className="rounded-xl px-6 h-12 data-[state=active]:bg-white data-[state=active]:shadow-md font-bold">Fast Learning</TabsTrigger>
            <TabsTrigger value="matriz" className="rounded-xl px-6 h-12 data-[state=active]:bg-white data-[state=active]:shadow-md font-bold">Matriz</TabsTrigger>
            <TabsTrigger value="supabase" className="rounded-xl px-6 h-12 data-[state=active]:bg-white data-[state=active]:shadow-md font-bold">Supabase</TabsTrigger>
          </TabsList>
          
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Clock className="w-4 h-4" /> Última atualização: {formatDate(new Date().toISOString())}
          </div>
        </div>

        <TabsContent value="overview" className="space-y-10 outline-none">
          {/* Featured Cards */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div variants={item}>
              <Card className="group hover:shadow-2xl transition-all duration-500 border-none bg-gradient-to-br from-blue-50 to-white overflow-hidden h-full">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl font-black tracking-tight">Políticas</CardTitle>
                  <CardDescription className="text-blue-600/70 font-bold uppercase text-[10px] tracking-widest">Procedimentos Oficiais</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">Acesse a base completa de diretrizes operacionais atualizadas em tempo real.</p>
                  <Link to="/politicas" className="inline-flex items-center text-primary font-bold text-sm group-hover:gap-2 transition-all">
                    Ver todas as políticas <ChevronRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="group hover:shadow-2xl transition-all duration-500 border-none bg-gradient-to-br from-red-50 to-white overflow-hidden h-full">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <Workflow className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl font-black tracking-tight">Matriz</CardTitle>
                  <CardDescription className="text-red-600/70 font-bold uppercase text-[10px] tracking-widest">Motor de Decisão</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">Utilize a inteligência da Matriz GSS para obter pareceres rápidos e precisos.</p>
                  <Link to="/matriz" className="inline-flex items-center text-primary font-bold text-sm group-hover:gap-2 transition-all">
                    Iniciar atendimento <ChevronRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="group hover:shadow-2xl transition-all duration-500 border-none bg-gradient-to-br from-amber-50 to-white overflow-hidden h-full">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <Video className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl font-black tracking-tight">Learning</CardTitle>
                  <CardDescription className="text-amber-600/70 font-bold uppercase text-[10px] tracking-widest">Vídeos Rápidos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">Aprenda novos processos em minutos com nossos vídeos de Fast Learning.</p>
                  <Link to="/fast-learning" className="inline-flex items-center text-primary font-bold text-sm group-hover:gap-2 transition-all">
                    Explorar vídeos <ChevronRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Updates and Recognitions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary" /> Atualizações Recentes
                </h3>
                <Button variant="ghost" className="font-bold text-primary">Ver histórico</Button>
              </div>
              
              <div className="space-y-4">
                {policies.slice(0, 4).map((policy) => (
                  <Card key={policy.id} className="hover:bg-muted/30 transition-colors border-muted/50">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{policy.title}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(policy.lastUpdated)}</p>
                        </div>
                      </div>
                      <Link to={`/politicas/${policy.id}`}>
                        <Button variant="ghost" size="icon" className="rounded-full"><ChevronRight className="w-5 h-5" /></Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" /> Reconhecimentos
              </h3>
              
              <div className="space-y-4">
                {recognitions.map((rec) => (
                  <Card key={rec.id} className="overflow-hidden border-none shadow-lg bg-white group">
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={rec.imageUrl} 
                        alt={rec.employeeName} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <p className="text-white font-black text-lg leading-none">{rec.employeeName}</p>
                        <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1">Destaque do Mês</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground italic">"{rec.description}"</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="policies" className="outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((policy) => (
              <Card key={policy.id} className="hover:shadow-xl transition-all border-muted/50 group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-none font-bold uppercase text-[9px]">{policy.scope}</Badge>
                    <Star className="w-4 h-4 text-muted-foreground hover:text-amber-500 cursor-pointer transition-colors" />
                  </div>
                  <CardTitle className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">{policy.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{policy.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between pt-4 border-t border-muted/50">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Atualizado em {formatDate(policy.lastUpdated)}</span>
                    <Link to={`/politicas/${policy.id}`}>
                      <Button variant="ghost" size="sm" className="font-bold text-primary group-hover:gap-2 transition-all">Ver Detalhes <ArrowRight className="w-4 h-4" /></Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="learning" className="outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden border-none shadow-lg group">
                <div className="relative aspect-video">
                  <img 
                    src={`https://img.youtube.com/vi/${getYouTubeVideoId(video.videoUrl)}/maxresdefault.jpg`} 
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                      <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-xl">
                        <ChevronRight className="w-8 h-8 fill-current ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg font-black tracking-tight">{video.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-xs">{video.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <span>{video.viewCount} visualizações</span>
                  <span>{formatDate(video.createdAt)}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="matriz" className="outline-none">
          <Card className="border-none shadow-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardHeader className="bg-primary text-white p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <Workflow className="w-8 h-8" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-black tracking-tighter">Matriz Inteligente GSS</CardTitle>
                  <CardDescription className="text-white/70 font-bold uppercase text-xs tracking-widest">Assistente de Decisão Operacional</CardDescription>
                </div>
              </div>
              <p className="text-white/80 max-w-2xl">A Matriz Inteligente ajuda você a tomar decisões rápidas sobre reacomodação, waivers e políticas especiais seguindo as diretrizes oficiais da LATAM.</p>
            </CardHeader>
            <CardContent className="p-8">
              <FlowEngine />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supabase" className="outline-none">
          <div className="max-w-2xl mx-auto space-y-6">
            <SupabaseDiagnostic />
            <SupabaseDemo />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
