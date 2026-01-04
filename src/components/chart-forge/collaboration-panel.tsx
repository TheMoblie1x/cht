'use client';

import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, MessageSquare, Clock } from 'lucide-react';

const MOCK_COLLABORATORS = [
  { id: '1', name: 'Alice Chen', status: 'active', currentAction: 'Editing chart', color: '#3b82f6' },
  { id: '2', name: 'Bob Smith', status: 'idle', currentAction: 'Viewing dashboard', color: '#ef4444' },
  { id: '3', name: 'Carol White', status: 'away', currentAction: '', color: '#10b981' },
];

const MOCK_MESSAGES = [
  { id: '1', user: 'Alice Chen', content: 'I added a new line chart for Q4 data', time: '2 min ago' },
  { id: '2', user: 'Bob Smith', content: 'Looks great! Can we add a comparison with last year?', time: '5 min ago' },
  { id: '3', user: 'Carol White', content: 'I\'ll update the data source config', time: '8 min ago' },
];

export default function CollaborationPanel({ dashboardId }: { dashboardId: string }) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'away': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold flex items-center gap-2">
          <Users className="w-4 h-4" />
          Collaborators
        </h2>
        <p className="text-sm text-muted-foreground">{MOCK_COLLABORATORS.length} people viewing</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Active Users */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Now Viewing
            </h3>
            {MOCK_COLLABORATORS.map((user) => (
              <Card key={user.id} className="p-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback 
                        style={{ backgroundColor: user.color, color: 'white' }}
                      >
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.currentAction}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <MessageSquare className="w-3 h-3 inline mr-1" />
              Discussion
            </h3>
            <div className="space-y-3">
              {MOCK_MESSAGES.map((message) => (
                <div key={message.id} className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="w-5 h-5">
                      <AvatarFallback className="text-xs">
                        {getInitials(message.user)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{message.user}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {message.time}
                    </span>
                  </div>
                  <p className="text-muted-foreground pl-7">{message.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
