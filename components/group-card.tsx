'use client';

import { Group } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface GroupCardProps {
  group: Group;
  onDelete: (id: string) => void;
}

export function GroupCard({ group, onDelete }: GroupCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-balance">
          <span>{group.name}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(group.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{group.members.length} miembros</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Moneda base: </span>
            <span className="font-medium">{group.baseCurrency}</span>
          </div>
          <Link href={`/group/${group.id}`}>
            <Button className="w-full" variant="default">
              Ver detalles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
