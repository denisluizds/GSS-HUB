import React, { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SupabaseDemo() {
  const [avisos, setAvisos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAvisos() {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase.from('avisos').select();
        if (error) throw error;
        setAvisos(data || []);
      } catch (err: any) {
        console.error('Error fetching avisos:', err);
        setError(err.message || 'Erro ao carregar dados do Supabase.');
      } finally {
        setLoading(false);
      }
    }

    fetchAvisos();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border-2 border-red-200 rounded-2xl text-red-600 flex items-center gap-3">
        <AlertCircle className="w-6 h-6" />
        <p className="font-bold">{error}</p>
      </div>
    );
  }

  return (
    <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" /> Lista de Avisos (Supabase)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {avisos.length === 0 ? (
          <p className="text-muted-foreground italic">Nenhum aviso encontrado na tabela 'avisos'.</p>
        ) : (
          <ul className="space-y-3">
            {avisos.map((aviso) => (
              <li key={aviso.id} className="p-4 bg-white rounded-xl shadow-sm border border-muted/20 font-medium">
                {aviso.titulo || aviso.name || aviso.title || 'Aviso sem título'}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
