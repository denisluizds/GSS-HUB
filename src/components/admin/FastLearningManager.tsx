"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Video, Plus, Trash2, Edit2, Save, X, Search, PlayCircle } from 'lucide-react';
import { FastLearningVideo } from '@/lib/types';
import { getFastLearningVideos } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export function FastLearningManager() {
  const [videos, setVideos] = useState<FastLearningVideo[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Partial<FastLearningVideo>>({});
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    getFastLearningVideos().then(setVideos);
  }, []);

  const handleSave = () => {
    if (!currentVideo.title || !currentVideo.videoUrl) return;

    const newVideo: FastLearningVideo = {
      id: currentVideo.id || `video-${Date.now()}`,
      title: currentVideo.title || '',
      description: currentVideo.description || '',
      videoUrl: currentVideo.videoUrl || '',
      viewCount: currentVideo.viewCount || 0,
      createdAt: currentVideo.createdAt || new Date().toISOString().split('T')[0]
    };

    if (currentVideo.id) {
      setVideos(videos.map(v => v.id === currentVideo.id ? newVideo : v));
    } else {
      setVideos([newVideo, ...videos]);
    }

    setIsEditing(false);
    setCurrentVideo({});
    toast({
      title: "Vídeo Salvo",
      description: "O conteúdo de Fast Learning foi atualizado.",
    });
  };

  const handleDelete = (id: string) => {
    setVideos(videos.filter(v => v.id !== id));
    toast({
      title: "Vídeo Removido",
      description: "O conteúdo foi excluído do sistema.",
      variant: "destructive"
    });
  };

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(search.toLowerCase()) ||
    v.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b bg-muted/20">
        <div>
          <CardTitle className="text-lg flex items-center gap-2"><Video className="w-5 h-5 text-primary" /> Fast Learning</CardTitle>
          <CardDescription>Gerencie os vídeos curtos de treinamento.</CardDescription>
        </div>
        <Button size="sm" onClick={() => { setIsEditing(true); setCurrentVideo({}); }} className="rounded-xl font-bold">
          <Plus className="w-4 h-4 mr-1" /> Novo Vídeo
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        {isEditing ? (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest">Título do Vídeo</Label>
                <Input 
                  value={currentVideo.title || ''} 
                  onChange={e => setCurrentVideo({...currentVideo, title: e.target.value})}
                  placeholder="Ex: Como usar a Matriz Inteligente"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest">URL do Vídeo (YouTube Embed)</Label>
                <Input 
                  value={currentVideo.videoUrl || ''} 
                  onChange={e => setCurrentVideo({...currentVideo, videoUrl: e.target.value})}
                  placeholder="Ex: https://www.youtube.com/embed/..."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest">Descrição</Label>
                <Input 
                  value={currentVideo.description || ''} 
                  onChange={e => setCurrentVideo({...currentVideo, description: e.target.value})}
                  placeholder="Resumo do conteúdo do vídeo..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-xl font-bold"><X className="w-4 h-4 mr-1" /> Cancelar</Button>
              <Button onClick={handleSave} className="rounded-xl font-bold"><Save className="w-4 h-4 mr-1" /> Salvar Vídeo</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar vídeos..." 
                className="pl-10 h-10 rounded-xl"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              {filteredVideos.map(video => (
                <div key={video.id} className="flex items-center gap-4 p-3 rounded-xl border bg-muted/10 hover:bg-muted/20 transition-all group">
                  <div className="w-24 h-16 rounded-lg bg-slate-200 flex items-center justify-center relative overflow-hidden">
                    <PlayCircle className="w-6 h-6 text-primary z-10" />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-all" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground leading-tight">{video.title}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1 mt-1">{video.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{video.viewCount} visualizações</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{video.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setIsEditing(true); setCurrentVideo(video); }} className="h-8 w-8 text-primary">
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(video.id)} className="h-8 w-8 text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredVideos.length === 0 && (
                <div className="h-24 flex items-center justify-center text-muted-foreground italic border border-dashed rounded-xl">Nenhum vídeo encontrado.</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
