"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Megaphone, Plus, Trash2, Edit2, Save, X, AlertCircle } from 'lucide-react';
import { Banner } from '@/lib/types';
import { getBanners } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<Partial<Banner>>({});
  const { toast } = useToast();

  useEffect(() => {
    getBanners().then(setBanners);
  }, []);

  const handleSave = () => {
    if (!currentBanner.message) return;

    const newBanner: Banner = {
      id: currentBanner.id || `banner-${Date.now()}`,
      message: currentBanner.message || '',
      isActive: currentBanner.isActive ?? true,
      lastUpdated: new Date().toISOString().split('T')[0],
      duration: currentBanner.duration || null,
      activatedAt: currentBanner.activatedAt || new Date().toISOString()
    };

    if (currentBanner.id) {
      setBanners(banners.map(b => b.id === currentBanner.id ? newBanner : b));
    } else {
      setBanners([newBanner, ...banners]);
    }

    setIsEditing(false);
    setCurrentBanner({});
    toast({
      title: "Banner Salvo",
      description: "O alerta foi atualizado com sucesso no Hub.",
    });
  };

  const handleDelete = (id: string) => {
    setBanners(banners.filter(b => b.id !== id));
    toast({
      title: "Banner Removido",
      description: "O alerta foi excluído do sistema.",
      variant: "destructive"
    });
  };

  const handleToggle = (id: string) => {
    setBanners(banners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
    const banner = banners.find(b => b.id === id);
    toast({
      title: banner?.isActive ? "Banner Desativado" : "Banner Ativado",
      description: `O alerta foi ${banner?.isActive ? 'desativado' : 'ativado'}.`,
    });
  };

  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b bg-muted/20">
        <div>
          <CardTitle className="text-lg flex items-center gap-2"><Megaphone className="w-5 h-5 text-primary" /> Banners de Alerta</CardTitle>
          <CardDescription>Gerencie as mensagens de destaque no topo do Hub.</CardDescription>
        </div>
        <Button size="sm" onClick={() => { setIsEditing(true); setCurrentBanner({ isActive: true }); }} className="rounded-xl font-bold">
          <Plus className="w-4 h-4 mr-1" /> Novo Banner
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        {isEditing ? (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Mensagem do Alerta</Label>
              <Input 
                value={currentBanner.message || ''} 
                onChange={e => setCurrentBanner({...currentBanner, message: e.target.value})}
                placeholder="Ex: Atenção: Nova atualização na política de Waiver v.2 já disponível!"
                className="h-12 text-sm font-bold"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs font-bold text-foreground">Exibir Imediatamente</p>
                  <p className="text-[10px] text-muted-foreground">O banner ficará visível para todos os agentes.</p>
                </div>
              </div>
              <Switch 
                checked={currentBanner.isActive ?? true} 
                onCheckedChange={(val) => setCurrentBanner({...currentBanner, isActive: val})}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-xl font-bold"><X className="w-4 h-4 mr-1" /> Cancelar</Button>
              <Button onClick={handleSave} className="rounded-xl font-bold"><Save className="w-4 h-4 mr-1" /> Salvar Banner</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {banners.map(banner => (
              <div key={banner.id} className={`p-4 rounded-xl border transition-all ${banner.isActive ? 'bg-primary/5 border-primary/20' : 'bg-muted/20 opacity-60'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground leading-tight">{banner.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                        {banner.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Atualizado em: {banner.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleToggle(banner.id)} className="h-8 w-8 text-primary">
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(banner.id)} className="h-8 w-8 text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {banners.length === 0 && (
              <div className="h-24 flex items-center justify-center text-muted-foreground italic border border-dashed rounded-xl">Nenhum banner ativo.</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
