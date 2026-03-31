"use client";

import React, { useState } from 'react';
import { useAppContext } from '@/lib/hooks';
import { User, UserRole } from '@/lib/types';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Shield, 
  User as UserIcon, 
  Search,
  Plus,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

export function UserManager() {
  const { users, addUser, deleteUser, currentUser } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();

  // New User Form State
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('gss');

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUsername || !newPassword) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    if (users.some(u => u.username === newUsername)) {
      toast({
        title: "Erro",
        description: "Usuário já existe.",
        variant: "destructive"
      });
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: newUsername,
      password: newPassword,
      role: newRole,
      createdAt: new Date().toISOString()
    };

    addUser(newUser);
    setIsAddModalOpen(false);
    setNewUsername('');
    setNewPassword('');
    setNewRole('gss');

    toast({
      title: "Sucesso",
      description: `Usuário ${newUsername} criado com sucesso.`,
    });
  };

  const handleDeleteUser = (id: string, username: string) => {
    const protectedUsernames = ['admin', 'admgss', 'administrador'];
    if (id === currentUser?.id || id === '1' || id === 'master' || protectedUsernames.includes(username)) {
      toast({
        title: "Ação Negada",
        description: "Você não pode excluir este usuário do sistema.",
        variant: "destructive"
      });
      return;
    }

    deleteUser(id);
    toast({
      title: "Usuário Excluído",
      description: `O usuário ${username} foi removido.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" /> Gerenciamento de Usuários
          </h2>
          <p className="text-muted-foreground text-sm font-medium">Crie e gerencie acessos ao sistema.</p>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl font-bold gap-2 shadow-lg shadow-primary/20">
              <UserPlus className="w-4 h-4" /> Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px] rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight">Criar Usuário</DialogTitle>
              <DialogDescription className="font-medium">Defina as credenciais e o nível de acesso.</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-username">Nome de Usuário</Label>
                <Input 
                  id="new-username" 
                  value={newUsername} 
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Ex: joao.silva"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Senha</Label>
                <Input 
                  id="new-password" 
                  type="password"
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-role">Nível de Acesso</Label>
                <Select value={newRole} onValueChange={(value: UserRole) => setNewRole(value)}>
                  <SelectTrigger id="new-role" className="rounded-xl">
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador (Acesso Total)</SelectItem>
                    <SelectItem value="gss">GSS (Acesso Padrão)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="rounded-xl font-bold">Cancelar</Button>
              <Button onClick={handleAddUser} className="rounded-xl font-bold">Criar Usuário</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm rounded-3xl overflow-hidden">
        <CardHeader className="border-b border-muted/50 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar usuários..." 
              className="pl-10 h-11 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/30 text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                  <th className="px-6 py-4">Usuário</th>
                  <th className="px-6 py-4">Cargo</th>
                  <th className="px-6 py-4">Criado em</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/30">
                <AnimatePresence mode="popLayout">
                  {filteredUsers.map((user) => (
                    <motion.tr 
                      key={user.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-primary/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                            {user.username.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-bold text-sm">{user.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.role === 'admin' ? (
                          <Badge className="bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 border-none rounded-lg font-bold gap-1">
                            <Shield className="w-3 h-3" /> Administrador
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="rounded-lg font-bold gap-1">
                            <UserIcon className="w-3 h-3" /> GSS
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          disabled={user.id === currentUser?.id || user.id === '1' || user.id === 'master'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground font-medium">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
