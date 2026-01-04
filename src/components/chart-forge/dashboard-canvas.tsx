'use client';

import React from 'react';
import { ChartConfig } from '@/types/chart-forge';
import ChartRenderer from './chart-renderer';
import { Plus } from 'lucide-react';

interface DashboardCanvasProps {
  charts: ChartConfig[];
  selectedChartId: string | null;
  liveMode: boolean;
  onSelectChart: (id: string) => void;
  onAddChart: (chart: ChartConfig) => void;
}

export default function DashboardCanvas({
  charts,
  selectedChartId,
  liveMode,
  onSelectChart,
  onAddChart,
}: DashboardCanvasProps) {
  if (charts.length === 0) {
    return (
      <div className="h-full flex items-center justify-center border-2 border-dashed rounded-lg">
        <div className="text-center">
          <Plus className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Start Building</h3>
          <p className="text-muted-foreground mb-4">
            Add your first chart to begin creating your dashboard
          </p>
          <button
            onClick={() => onAddChart({
              id: crypto.randomUUID(),
              type: 'bar',
              dimension: '2d',
              bindings: {
                xAxis: 'category',
                yAxis: ['value'],
              },
              appearance: {
                title: 'New Chart',
                theme: 'light',
                colors: {
                  palette: ['#3b82f6'],
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
                draggable: !liveMode,
                resizable: !liveMode,
                zoomable: true,
                pan: true,
                crosshair: true,
                selection: true,
              },
            })}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Add Chart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 auto-rows-[200px]">
      {charts.map((chart) => {
        const selected = selectedChartId === chart.id;
        return (
          <div
            key={chart.id}
            className={`relative rounded-lg border bg-card cursor-pointer transition-all ${selected ? 'ring-2 ring-primary' : 'hover:shadow-md'} ${liveMode ? 'cursor-default' : 'hover:border-primary'}`}
            onClick={() => !liveMode && onSelectChart(chart.id)}
            style={{
              gridColumn: `span ${chart.appearance.layout.width}`,
              gridRow: `span ${chart.appearance.layout.height}`,
            }}
          >
            <ChartRenderer config={chart} />
          </div>
        );
      })}
    </div>
  );
}
