'use client';

import { useEffect, useState } from 'react';
import { Group } from '@/types';
import { GroupCard } from '@/components/group-card';
import { CreateGroupDialog } from '@/components/create-group-dialog';
import { Wallet } from 'lucide-react';
import { getGroups, saveGroup, deleteGroup } from '@/lib/client-storage';
import { AuthGuard } from '@/components/auth-guard';
import { Navbar } from '@/components/navbar';

export default function HomePage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load groups from localStorage
    const loadedGroups = getGroups();
    setGroups(loadedGroups);
    setLoading(false);
  }, []);

  const handleCreateGroup = (group: Group) => {
    saveGroup(group);
    setGroups(getGroups());
  };

  const handleDeleteGroup = (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este grupo?')) return;
    
    deleteGroup(id);
    setGroups(getGroups());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando grupos...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                  <Wallet className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-balance">Gastos Compartidos</h1>
                  <p className="text-sm text-muted-foreground">Gestiona tus gastos en grupo fácilmente</p>
                </div>
              </div>
              <CreateGroupDialog onCreateGroup={handleCreateGroup} />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {groups.length === 0 ? (
            <div className="text-center py-16">
              <Wallet className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No hay grupos todavía</h2>
              <p className="text-muted-foreground mb-6">Crea tu primer grupo para empezar a gestionar gastos</p>
              <CreateGroupDialog onCreateGroup={handleCreateGroup} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onDelete={handleDeleteGroup}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
