'use client';

import React from 'react';
import { ChartConfig } from '@/types/chart-forge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Palette, Layout, Settings, Database, MousePointer2 } from 'lucide-react';

const CHART_TYPES = [
  { category: 'Basic 2D', types: ['line', 'bar', 'area', 'pie', 'doughnut'] },
  { category: 'Advanced 2D', types: ['scatter', 'bubble', 'heatmap', 'treemap', 'radar'] },
  { category: 'Financial', types: ['candlestick', 'ohlc', 'gauge'] },
  { category: 'Hierarchical', types: ['sunburst', 'icicle', 'treemap', 'partition'] },
  { category: '3D Charts', types: ['surface', 'scatter3d', 'bar3d', 'globe', 'volume'] },
] as const;

const CHART_COLORS = [
  ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'],
  ['#06b6d4', '#ec4899', '#84cc16', '#6366f1', '#f97316'],
  ['#0ea5e9', '#14b8a6', '#eab308', '#a855f7', '#f43f5e'],
  ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e'],
  ['#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9'],
];

interface PropertyPanelProps {
  chart: ChartConfig;
  onUpdate: (updates: Partial<ChartConfig>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function PropertyPanel({ chart, onUpdate, onDelete, onDuplicate }: PropertyPanelProps) {
  const handleUpdateAppearance = (field: string, value: any) => {
    onUpdate({
      appearance: {
        ...chart.appearance,
        [field]: value,
      },
    });
  };

  const handleUpdateLayout = (field: string, value: any) => {
    onUpdate({
      appearance: {
        ...chart.appearance,
        layout: {
          ...chart.appearance.layout,
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Chart Properties</h2>
        <p className="text-sm text-muted-foreground">{chart.appearance.title}</p>
      </div>

      <Tabs defaultValue="general" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
          <TabsTrigger value="general" className="text-xs">
            <Settings className="w-4 h-4 mr-1" />
            General
          </TabsTrigger>
          <TabsTrigger value="appearance" className="text-xs">
            <Palette className="w-4 h-4 mr-1" />
            Style
          </TabsTrigger>
          <TabsTrigger value="layout" className="text-xs">
            <Layout className="w-4 h-4 mr-1" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="data" className="text-xs">
            <Database className="w-4 h-4 mr-1" />
            Data
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto">
          <TabsContent value="general" className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Chart Title</Label>
              <Input
                value={chart.appearance.title}
                onChange={(e) => handleUpdateAppearance('title', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={chart.appearance.description || ''}
                onChange={(e) => handleUpdateAppearance('description', e.target.value)}
                placeholder="Add a description..."
              />
            </div>

            <div className="space-y-2">
              <Label>Chart Type</Label>
              <Select
                value={chart.type}
                onValueChange={(value) => onUpdate({ type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHART_TYPES.flatMap(group =>
                    group.types.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Dimension</Label>
              <Select
                value={chart.dimension}
                onValueChange={(value) => onUpdate({ dimension: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2d">2D</SelectItem>
                  <SelectItem value="3d">3D</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Theme</Label>
              <Select
                value={chart.appearance.theme}
                onValueChange={(value) => handleUpdateAppearance('theme', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Color Palette</Label>
              <div className="grid grid-cols-5 gap-2">
                {CHART_COLORS.map((palette, i) => (
                  <button
                    key={i}
                    onClick={() => handleUpdateAppearance('colors', { ...chart.appearance.colors, palette })}
                    className={`h-8 rounded transition-transform hover:scale-105 ${
                      JSON.stringify(chart.appearance.colors.palette) === JSON.stringify(palette)
                        ? 'ring-2 ring-primary'
                        : ''
                    }`}
                    style={{ background: `linear-gradient(to right, ${palette.join(', ')})` }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Background Color</Label>
              <Input
                type="color"
                value={chart.appearance.colors.background || '#ffffff'}
                onChange={(e) => handleUpdateAppearance('colors', {
                  ...chart.appearance.colors,
                  background: e.target.value,
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>Accent Color</Label>
              <Input
                type="color"
                value={chart.appearance.colors.accent || '#3b82f6'}
                onChange={(e) => handleUpdateAppearance('colors', {
                  ...chart.appearance.colors,
                  accent: e.target.value,
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gradient">Enable Gradient</Label>
              <Switch
                id="gradient"
                checked={chart.appearance.colors.gradient || false}
                onCheckedChange={(checked) => handleUpdateAppearance('colors', {
                  ...chart.appearance.colors,
                  gradient: checked,
                })}
              />
            </div>
          </TabsContent>

          <TabsContent value="layout" className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Width (Grid Columns: {chart.appearance.layout.width})</Label>
              <Slider
                value={[chart.appearance.layout.width]}
                onValueChange={([value]) => handleUpdateLayout('width', value)}
                min={1}
                max={12}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Height (Grid Rows: {chart.appearance.layout.height})</Label>
              <Slider
                value={[chart.appearance.layout.height]}
                onValueChange={([value]) => handleUpdateLayout('height', value)}
                min={2}
                max={8}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Padding Top</Label>
              <Input
                type="number"
                value={chart.appearance.layout.padding.top}
                onChange={(e) => handleUpdateLayout('padding', {
                  ...chart.appearance.layout.padding,
                  top: Number(e.target.value),
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>Padding Bottom</Label>
              <Input
                type="number"
                value={chart.appearance.layout.padding.bottom}
                onChange={(e) => handleUpdateLayout('padding', {
                  ...chart.appearance.layout.padding,
                  bottom: Number(e.target.value),
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>Padding Left</Label>
              <Input
                type="number"
                value={chart.appearance.layout.padding.left}
                onChange={(e) => handleUpdateLayout('padding', {
                  ...chart.appearance.layout.padding,
                  left: Number(e.target.value),
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>Padding Right</Label>
              <Input
                type="number"
                value={chart.appearance.layout.padding.right}
                onChange={(e) => handleUpdateLayout('padding', {
                  ...chart.appearance.layout.padding,
                  right: Number(e.target.value),
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsive">Responsive</Label>
              <Switch
                id="responsive"
                checked={chart.appearance.layout.responsive}
                onCheckedChange={(checked) => handleUpdateLayout('responsive', checked)}
              />
            </div>
          </TabsContent>

          <TabsContent value="data" className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>X-Axis Field</Label>
              <Input
                value={chart.bindings.xAxis || ''}
                onChange={(e) => onUpdate({
                  bindings: { ...chart.bindings, xAxis: e.target.value }
                })}
                placeholder="e.g., month, date, category"
              />
            </div>

            <div className="space-y-2">
              <Label>Y-Axis Fields</Label>
              <Input
                value={Array.isArray(chart.bindings.yAxis) ? chart.bindings.yAxis.join(', ') : chart.bindings.yAxis || ''}
                onChange={(e) => onUpdate({
                  bindings: {
                    ...chart.bindings,
                    yAxis: e.target.value.split(',').map(s => s.trim())
                  }
                })}
                placeholder="e.g., revenue, cost, profit"
              />
            </div>

            <div className="space-y-2">
              <Label>Color Field</Label>
              <Input
                value={chart.bindings.color || ''}
                onChange={(e) => onUpdate({
                  bindings: { ...chart.bindings, color: e.target.value }
                })}
                placeholder="e.g., category, region"
              />
            </div>

            <div className="space-y-2">
              <Label>Series Field</Label>
              <Input
                value={Array.isArray(chart.bindings.series) ? chart.bindings.series.join(', ') : chart.bindings.series || ''}
                onChange={(e) => onUpdate({
                  bindings: {
                    ...chart.bindings,
                    series: e.target.value.split(',').map(s => s.trim())
                  }
                })}
                placeholder="e.g., year, quarter"
              />
            </div>

            <div className="space-y-2">
              <Label>Data Source ID</Label>
              <Input
                value={chart.bindings.dataSourceId || ''}
                onChange={(e) => onUpdate({
                  bindings: { ...chart.bindings, dataSourceId: e.target.value }
                })}
                placeholder="Select a data source"
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <div className="p-4 border-t space-y-2">
        <div className="flex gap-2">
          <Button onClick={onDuplicate} variant="outline" className="flex-1">
            Duplicate
          </Button>
          <Button onClick={onDelete} variant="destructive" className="flex-1">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
