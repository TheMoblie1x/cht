'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Database, Globe, Server, Zap, Link2, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DATA_SOURCE_TYPES = [
  { value: 'rest', label: 'REST API', icon: Globe, description: 'Connect to any RESTful API' },
  { value: 'graphql', label: 'GraphQL', icon: Link2, description: 'GraphQL endpoints' },
  { value: 'grpc', label: 'gRPC', icon: Server, description: 'gRPC services (via gRPC-Web)' },
  { value: 'sql', label: 'SQL Database', icon: Database, description: 'PostgreSQL, MySQL, Snowflake, BigQuery' },
  { value: 'streaming', label: 'Streaming', icon: Zap, description: 'WebSocket & Kafka streaming' },
] as const;

const MOCK_DATA_SOURCES = [
  {
    id: '1',
    name: 'Production Database',
    type: 'sql' as const,
    status: 'healthy' as const,
    lastSync: '2 min ago',
  },
  {
    id: '2',
    name: 'Analytics API',
    type: 'rest' as const,
    status: 'healthy' as const,
    lastSync: '5 min ago',
  },
  {
    id: '3',
    name: 'Real-time Events',
    type: 'streaming' as const,
    status: 'healthy' as const,
    lastSync: 'Live',
  },
];

export default function DataSourcePanel({ onSelect }: { onSelect?: (source: any) => void }) {
  const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing');
  const [selectedType, setSelectedType] = useState<string>('rest');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsConnecting(false);
    toast({
      title: 'Data source connected',
      description: 'Your data source has been configured successfully.',
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Data Sources</h2>
        <p className="text-sm text-muted-foreground">Manage your data connections</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 rounded-none m-0">
          <TabsTrigger value="existing" className="rounded-none">
            Existing
          </TabsTrigger>
          <TabsTrigger value="new" className="rounded-none">
            <Plus className="w-4 h-4 mr-1" />
            New Source
          </TabsTrigger>
        </TabsList>

        <TabsContent value="existing" className="flex-1 m-0 p-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {MOCK_DATA_SOURCES.map((source) => {
                const Icon = DATA_SOURCE_TYPES.find(t => t.value === source.type)?.icon || Database;
                return (
                  <Card key={source.id} className="p-4 cursor-pointer hover:border-primary transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        source.status === 'healthy' ? 'bg-green-500/10' : 'bg-yellow-500/10'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          source.status === 'healthy' ? 'text-green-500' : 'text-yellow-500'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">{source.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 capitalize">{source.type}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className={`w-2 h-2 rounded-full ${
                            source.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
                          }`} />
                          <span className="text-xs text-muted-foreground">{source.lastSync}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Connect
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="new" className="flex-1 m-0 p-4 overflow-auto">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Data Source Type</Label>
              <div className="grid grid-cols-1 gap-2">
                {DATA_SOURCE_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className={`p-3 text-left border rounded-lg transition-all ${
                        selectedType === type.value
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <div>
                          <p className="font-medium text-sm">{type.label}</p>
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source-name">Name</Label>
              <Input
                id="source-name"
                placeholder="My Data Source"
              />
            </div>

            {selectedType === 'rest' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="base-url">Base URL</Label>
                  <Input
                    id="base-url"
                    placeholder="https://api.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Authentication</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select auth type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="bearer">Bearer Token</SelectItem>
                      <SelectItem value="apiKey">API Key</SelectItem>
                      <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {selectedType === 'sql' && (
              <>
                <div className="space-y-2">
                  <Label>Database Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select database" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="postgres">PostgreSQL</SelectItem>
                      <SelectItem value="mysql">MySQL</SelectItem>
                      <SelectItem value="snowflake">Snowflake</SelectItem>
                      <SelectItem value="bigquery">BigQuery</SelectItem>
                      <SelectItem value="sqlite">SQLite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-host">Host</Label>
                  <Input
                    id="db-host"
                    placeholder="localhost"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-name">Database</Label>
                  <Input
                    id="db-name"
                    placeholder="my_database"
                  />
                </div>
              </>
            )}

            {selectedType === 'streaming' && (
              <>
                <div className="space-y-2">
                  <Label>Streaming Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="websocket">WebSocket</SelectItem>
                      <SelectItem value="kafka">Kafka</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stream-url">Endpoint URL</Label>
                  <Input
                    id="stream-url"
                    placeholder="wss://stream.example.com"
                  />
                </div>
              </>
            )}

            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? 'Connecting...' : 'Connect Data Source'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
