'use client';

import React, { useState } from 'react';
import { ChartConfig } from '@/types/chart-forge';
import DashboardCanvas from '@/components/chart-forge/dashboard-canvas';
import PropertyPanel from '@/components/chart-forge/property-panel';
import ChartLibrary from '@/components/chart-forge/chart-library';
import DataSourcePanel from '@/components/chart-forge/data-source-panel';
import CollaborationPanel from '@/components/chart-forge/collaboration-panel';
import { Button } from '@/components/ui/button';
import { Save, Play, Users, Database, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DashboardEditorProps {
  onAddChart?: (chart: ChartConfig) => void;
}

const INITIAL_CHARTS: ChartConfig[] = [
  {
    id: 'demo-line-chart',
    type: 'line',
    dimension: '2d',
    bindings: {
      xAxis: 'month',
      yAxis: ['revenue', 'cost'],
      series: ['revenue', 'cost'],
    },
    appearance: {
      title: 'Revenue vs Cost',
      theme: 'light',
      colors: {
        palette: ['#3b82f6', '#ef4444'],
      },
      layout: {
        width: 6,
        height: 4,
        x: 0,
        y: 0,
        padding: { top: 20, right: 20, bottom: 40, left: 60 },
        responsive: true,
      },
    },
    interactions: {
      draggable: true,
      resizable: true,
      zoomable: true,
      pan: true,
      crosshair: true,
      selection: true,
    },
  },
];

export default function DashboardEditor({ onAddChart }: DashboardEditorProps) {
  const [charts, setCharts] = useState<ChartConfig[]>(INITIAL_CHARTS);
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<'chart-library' | 'data-sources' | 'collaboration' | 'none'>('none');
  const [isSaving, setIsSaving] = useState(false);
  const [liveMode, setLiveMode] = useState(false);

  const selectedChart = charts.find((c) => c.id === selectedChartId);

  const handleAddChartInternal = (chart: ChartConfig) => {
    console.log('Adding chart:', chart);
    setCharts((prev) => [...prev, chart]);
    setSelectedChartId(chart.id);
    toast({
      title: 'Chart added',
      description: `${chart.appearance.title} has been added.`,
    });
    onAddChart?.(chart);
  };

  const handleUpdateChart = (id: string, updates: Partial<ChartConfig>) => {
    console.log('Updating chart:', id, updates);
    setCharts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const handleDeleteChart = (id: string) => {
    console.log('Deleting chart:', id);
    setCharts((prev) => prev.filter((c) => c.id !== id));
    if (selectedChartId === id) {
      setSelectedChartId(null);
    }
    toast({
      title: 'Chart deleted',
      description: 'The chart has been removed.',
    });
  };

  const handleDuplicateChart = (id: string) => {
    const chart = charts.find((c) => c.id === id);
    if (chart) {
      const newChart: ChartConfig = {
        ...chart,
        id: crypto.randomUUID(),
        appearance: {
          ...chart.appearance,
          title: `${chart.appearance.title} (Copy)`,
        },
      };
      handleAddChartInternal(newChart);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({
        title: 'Dashboard saved',
        description: 'Your dashboard has been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Save failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">ChartForge Dashboard</h1>
          <span className="text-xs text-muted-foreground">
            {charts.length} chart{charts.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLiveMode(!liveMode)}
            className={liveMode ? 'bg-primary text-primary-foreground' : ''}
          >
            <Play className="w-4 h-4 mr-2" />
            {liveMode ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 p-4 overflow-auto">
          <DashboardCanvas
            charts={charts}
            selectedChartId={selectedChartId}
            liveMode={liveMode}
            onSelectChart={setSelectedChartId}
            onAddChart={handleAddChartInternal}
          />
        </div>

        {/* Right Panel */}
        <aside className="w-96 border-l bg-card flex flex-col overflow-hidden">
          {/* Panel Tabs */}
          <div className="flex border-b shrink-0">
            <button
              onClick={() => setActivePanel(activePanel === 'chart-library' ? 'none' : 'chart-library')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activePanel === 'chart-library'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <Plus className="w-4 h-4 mr-1 inline" />
              Charts
            </button>
            <button
              onClick={() => setActivePanel(activePanel === 'data-sources' ? 'none' : 'data-sources')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activePanel === 'data-sources'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <Database className="w-4 h-4 mr-1 inline" />
              Data
            </button>
            <button
              onClick={() => setActivePanel(activePanel === 'collaboration' ? 'none' : 'collaboration')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activePanel === 'collaboration'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <Users className="w-4 h-4 mr-1 inline" />
              Team
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {activePanel === 'chart-library' && (
              <ChartLibrary onAddChart={handleAddChartInternal} />
            )}
            {activePanel === 'data-sources' && (
              <DataSourcePanel />
            )}
            {activePanel === 'collaboration' && (
              <CollaborationPanel dashboardId="demo" />
            )}
            {activePanel === 'none' && selectedChart && (
              <PropertyPanel
                chart={selectedChart}
                onUpdate={(updates) => handleUpdateChart(selectedChart.id, updates)}
                onDelete={() => handleDeleteChart(selectedChart.id)}
                onDuplicate={() => handleDuplicateChart(selectedChart.id)}
              />
            )}
            {activePanel === 'none' && !selectedChart && (
              <div className="flex-1 flex items-center justify-center text-center p-4 text-muted-foreground">
                <div>
                  <p className="text-sm">Select a chart to edit its properties</p>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
