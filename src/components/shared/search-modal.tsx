"use client";

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/lib/hooks';
import { Search, X, Workflow, BookOpen, Video, ChevronRight, History, TrendingUp, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { getPolicies, getFastLearningVideos } from '@/lib/data';
import { Policy, FastLearningVideo, OperationalFlow } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

export function SearchModal() {
  const { isSearchOpen, setSearchOpen, flows } = useAppContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    policies: Policy[];
    videos: FastLearningVideo[];
    flows: OperationalFlow[];
  }>({ policies: [], videos: [], flows: [] });

  useEffect(() => {
    if (query.length < 2) {
      setResults({ policies: [], videos: [], flows: [] });
      return;
    }

    const search = async () => {
      const [p, v] = await Promise.all([getPolicies(), getFastLearningVideos()]);
      
      const filteredPolicies = p.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      
      const filteredVideos = v.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      
      const filteredFlows = flows.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.description.toLowerCase().includes(query.toLowerCase())
      );

      setResults({ policies: filteredPolicies, videos: filteredVideos, flows: filteredFlows });
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [query, flows]);

  const totalResults = results.policies.length + results.videos.length + results.flows.length;

  return (
    <Dialog open={isSearchOpen} onOpenChange={setSearchOpen}>
      <DialogContent className="w-[95vw] sm:max-w-3xl p-0 overflow-hidden border-none shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl">
        <DialogHeader className="p-4 md:p-6 border-b bg-muted/30">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-primary animate-pulse" />
            <Input 
              placeholder="O que você está procurando hoje?" 
              className="pl-12 md:pl-14 h-14 md:h-16 text-lg md:text-xl border-none bg-transparent focus-visible:ring-0 font-black tracking-tight"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full hover:bg-muted"
                onClick={() => setQuery('')}
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {query.length < 2 ? (
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" /> Sugestões de Pesquisa
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Con Waiver', 'Reacomodação', 'Waiver v.2', 'Upgrade', 'Reembolso', 'Bagagem'].map(tag => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="px-4 py-2 rounded-xl cursor-pointer hover:bg-primary hover:text-white transition-all font-bold text-xs"
                      onClick={() => setQuery(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <History className="w-3 h-3" /> Pesquisas Recentes
                </p>
                <div className="space-y-2">
                  {['Política de Upgrade', 'Fluxo de Contingência'].map(item => (
                    <div key={item} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 cursor-pointer group transition-all">
                      <div className="flex items-center gap-3">
                        <History className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">{item}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : totalResults > 0 ? (
            <div className="space-y-8">
              {results.flows.length > 0 && (
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <Workflow className="w-3 h-3" /> Matriz Inteligente ({results.flows.length})
                  </p>
                  <div className="space-y-2">
                    {results.flows.map(flow => (
                      <Link key={flow.id} to={`/matriz?flow=${flow.id}`} onClick={() => setSearchOpen(false)}>
                        <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-primary/5 border border-transparent hover:border-primary/20 group transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                              <Workflow className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-black text-sm">{flow.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{flow.description}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.policies.length > 0 && (
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                    <BookOpen className="w-3 h-3" /> Políticas e Procedimentos ({results.policies.length})
                  </p>
                  <div className="space-y-2">
                    {results.policies.map(policy => (
                      <Link key={policy.id} to={`/politicas/${policy.id}`} onClick={() => setSearchOpen(false)}>
                        <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-blue-50 border border-transparent hover:border-blue-200 group transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                              <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-black text-sm">{policy.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{policy.description}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.videos.length > 0 && (
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-2">
                    <Video className="w-3 h-3" /> Fast Learning ({results.videos.length})
                  </p>
                  <div className="space-y-2">
                    {results.videos.map(video => (
                      <Link key={video.id} to={`/fast-learning?video=${video.id}`} onClick={() => setSearchOpen(false)}>
                        <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-amber-50 border border-transparent hover:border-amber-200 group transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                              <Video className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-black text-sm">{video.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{video.description}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-amber-600 opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <X className="w-10 h-10" />
              </div>
              <div>
                <p className="text-xl font-black tracking-tight">Nenhum resultado encontrado</p>
                <p className="text-sm text-muted-foreground">Tente usar palavras-chave diferentes ou mais genéricas.</p>
              </div>
              <Button variant="outline" className="rounded-xl font-bold" onClick={() => setQuery('')}>Limpar Pesquisa</Button>
            </div>
          )}
        </div>

        <div className="p-4 bg-muted/30 border-t flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <Badge variant="outline" className="h-5 px-1.5 rounded bg-white font-mono text-[9px]">ESC</Badge> Fechar
             </div>
             <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <Badge variant="outline" className="h-5 px-1.5 rounded bg-white font-mono text-[9px]">↵</Badge> Selecionar
             </div>
          </div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5" /> Powered by LATAM AI
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
