import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/store';
import { 
  Workflow, 
  Settings, 
  FileText, 
  LayoutDashboard, 
  LogOut, 
  User, 
  ShieldCheck,
  ChevronRight,
  Plane,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function Sidebar() {
  const { session, endSession, isAdmin, logoutAdmin, setAdminLoginOpen } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    endSession();
    navigate('/');
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  const menuItems = [
    { 
      title: 'Atendimento', 
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, show: !!session },
        { label: 'Histórico', path: '/history', icon: FileText, show: !!session },
      ]
    },
    { 
      title: 'Administração', 
      items: [
        { label: 'Painel Admin', path: '/admin', icon: ShieldCheck, show: isAdmin },
        { label: 'Configurações', path: '#', icon: Settings, show: true, onClick: () => !isAdmin && setAdminLoginOpen(true) },
      ]
    }
  ];

  return (
    <div className="w-72 h-screen bg-white flex flex-col border-r border-slate-100 shadow-sm z-20">
      {/* Brand Header */}
      <div className="p-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-[#1B0088] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/10">
          <Plane className="text-white w-7 h-7 -rotate-45" />
        </div>
        <div>
          <h1 className="font-black text-xl text-[#1B0088] tracking-tighter leading-none">Matriz GSS</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mt-1">LATAM Airlines</p>
        </div>
      </div>

      <Separator className="bg-slate-50 mx-8 w-auto" />

      {/* Navigation */}
      <div className="flex-1 px-4 py-8 overflow-y-auto">
        {menuItems.map((section, sIdx) => {
          const visibleItems = section.items.filter(i => i.show);
          if (visibleItems.length === 0) return null;

          return (
            <div key={sIdx} className="mb-8 last:mb-0">
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">
                {section.title}
              </p>
              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const content = (
                    <>
                      {location.pathname === item.path && (
                        <div className="absolute left-0 w-1 h-6 bg-red-600 rounded-r-full" />
                      )}
                      <item.icon className={cn(
                        "w-5 h-5 transition-colors",
                        location.pathname === item.path ? "text-red-600" : "text-slate-400 group-hover:text-slate-600"
                      )} />
                      <span className="text-sm">{item.label}</span>
                      {location.pathname === item.path && (
                        <ChevronRight className="ml-auto w-4 h-4 text-slate-300" />
                      )}
                    </>
                  );

                  const className = cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative w-full text-left",
                    location.pathname === item.path 
                      ? "bg-slate-50 text-[#1B0088] font-bold" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
                  );

                  if (item.onClick) {
                    return (
                      <button key={item.label} onClick={item.onClick} className={className}>
                        {content}
                      </button>
                    );
                  }

                  return (
                    <Link key={item.path} to={item.path} className={className}>
                      {content}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* User / Session Info */}
      <div className="p-6 mt-auto">
        {session && (
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                <User className="w-5 h-5 text-slate-400" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate">{session.bp}</p>
                <p className="text-[10px] text-slate-500 font-medium truncate uppercase tracking-wider">{session.locator}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="w-full justify-start text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 h-9 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Encerrar Sessão
            </Button>
          </div>
        )}

        {isAdmin && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAdminLogout}
              className="w-full border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 h-10 rounded-xl text-xs font-bold"
            >
              <ShieldCheck className="w-4 h-4 mr-2 text-red-600" />
              Sair do Modo Admin
            </Button>
          </div>
        )}
        
        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-300 font-bold uppercase tracking-widest">
          <HelpCircle className="w-3 h-3" />
          Suporte GSS
        </div>
      </div>
    </div>
  );
}
