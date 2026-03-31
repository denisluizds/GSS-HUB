import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function SupabaseDiagnostic() {
  const envVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_URL: import.meta.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  };

  const mask = (str: string | undefined) => {
    if (!str) return 'NÃO DEFINIDO';
    if (str.length < 10) return 'VALOR MUITO CURTO';
    return `${str.substring(0, 8)}...${str.substring(str.length - 4)}`;
  };

  const isUrlValid = (url: string | undefined) => url?.startsWith('http');
  const isKeyValid = (key: string | undefined) => key && (key.startsWith('eyJ') || key.startsWith('sb_'));

  const activeUrl = envVars.VITE_SUPABASE_URL || envVars.NEXT_PUBLIC_SUPABASE_URL;
  const activeKey = envVars.VITE_SUPABASE_ANON_KEY || envVars.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  return (
    <Card className="border-2 border-amber-200 bg-amber-50/50">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-amber-800">
          <ShieldAlert className="w-5 h-5" /> Diagnóstico de Conexão Supabase
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid grid-cols-1 gap-3">
          <div className="p-3 bg-white rounded-lg border border-amber-200">
            <p className="font-bold text-amber-900 mb-1">URL Ativa:</p>
            <div className="flex items-center gap-2">
              {isUrlValid(activeUrl) ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              <code className="bg-slate-100 px-2 py-1 rounded">{mask(activeUrl)}</code>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-amber-200">
            <p className="font-bold text-amber-900 mb-1">Chave Ativa:</p>
            <div className="flex items-center gap-2">
              {isKeyValid(activeKey) ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              <code className="bg-slate-100 px-2 py-1 rounded">{mask(activeKey)}</code>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-900">
          <p className="font-bold mb-2">Como corrigir:</p>
          <ol className="list-decimal list-inside space-y-1 opacity-90">
            <li>Vá em <b>Settings &gt; Secrets</b> no AI Studio.</li>
            <li>Adicione <code>VITE_SUPABASE_URL</code> com sua URL.</li>
            <li>Adicione <code>VITE_SUPABASE_ANON_KEY</code> com sua chave.</li>
            <li>Certifique-se de que não há espaços ou aspas extras.</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
