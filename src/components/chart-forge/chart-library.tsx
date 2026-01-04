'use client';

import React, { useState } from 'react';
import { ChartConfig, ChartType } from '@/types/chart-forge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart3, LineChart, PieChart, Scatter, 
  Activity, TrendingUp, Globe, Layers, Map 
} from 'lucide-react';
import { motion } from 'framer-motion';

const CHART_CATEGORIES = [
  {
    name: 'Basic 2D',
    icon: BarChart3,
    charts: [
      { type: 'line', name: 'Line Chart', description: 'Trends over time' },
      { type: 'bar', name: 'Bar Chart', description: 'Categorical comparison' },
      { type: 'pie', name: 'Pie Chart', description: 'Part-to-whole' },
      { type: 'area', name: 'Area Chart', description: 'Volume over time' },
      { type: 'doughnut', name: 'Doughnut', description: 'Part-to-whole with center' },
    ],
  },
  {
    name: 'Advanced 2D',
    icon: TrendingUp,
    charts: [
      { type: 'scatter', name: 'Scatter Plot', description: 'Correlation analysis' },
      { type: 'bubble', name: 'Bubble Chart', description: 'Multi-dimensional data' },
      { type: 'heatmap', name: 'Heatmap', description: 'Density visualization' },
      { type: 'treemap', name: 'Treemap', description: 'Hierarchical data' },
      { type: 'radar', name: 'Radar Chart', description: 'Multi-variable comparison' },
    ],
  },
  {
    name: 'Financial',
    icon: Activity,
    charts: [
      { type: 'candlestick', name: 'Candlestick', description: 'Price movements' },
      { type: 'ohlc', name: 'OHLC', description: 'Open-High-Low-Close' },
      { type: 'gauge', name: 'Gauge', description: 'KPI metrics' },
    ],
  },
  {
    name: '3D Charts',
    icon: Globe,
    charts: [
      { type: 'surface', name: 'Surface Plot', description: '3D surface data' },
      { type: 'scatter3d', name: '3D Scatter', description: 'Three-dimensional points' },
      { type: 'bar3d', name: '3D Bar', description: '3D bars' },
      { type: 'globe', name: 'Globe', description: 'Geospatial data' },
      { type: 'volume', name: 'Volume', description: '3D volume rendering' },
    ],
  },
] as const;

interface ChartLibraryProps {
  onAddChart: (chart: ChartConfig) => void;
}

export default function ChartLibrary({ onAddChart }: ChartLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);

  const handleAddChart = (type: ChartType) => {
    const newChart: ChartConfig = {
      id: crypto.randomUUID(),
      type,
      dimension: type.includes('3d') ? '3d' : '2d',
      bindings: {
        xAxis: 'category',
        yAxis: ['value'],
      },
      appearance: {
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
        theme: 'light',
        colors: {
          palette: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'],
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
    };

    onAddChart(newChart);
  };

  const filteredCharts = CHART_CATEGORIES[selectedCategory].charts.filter(chart =>
    chart.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chart.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b space-y-3">
        <h2 className="font-semibold">Chart Library</h2>
        <Input
          placeholder="Search charts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex border-b">
        {CHART_CATEGORIES.map((category, index) => {
          const Icon = category.icon;
          return (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(index)}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
                selectedCategory === index
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4 mx-auto mb-1" />
              {category.name}
            </button>
          );
        })}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredCharts.map((chart) => {
            const Icon = getChartIcon(chart.type);
            return (
              <motion.div
                key={chart.type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="p-4 cursor-pointer hover:border-primary hover:shadow-md transition-all">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{chart.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{chart.description}</p>
                    </div>
                    <button
                      onClick={() => handleAddChart(chart.type)}
                      className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                      Add
                    </button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

function getChartIcon(type: ChartType) {
  const icons = {
    line: LineChart,
    bar: BarChart3,
    pie: PieChart,
    area: Activity,
    doughnut: PieChart,
    scatter: Activity,
    bubble: Activity,
    heatmap: Layers,
    treemap: Map,
    radar: Activity,
    candlestick: TrendingUp,
    ohlc: TrendingUp,
    gauge: Activity,
    surface: Globe,
    scatter3d: Globe,
    bar3d: BarChart3,
    globe: Globe,
    volume: Layers,
    default: BarChart3,
  } as const;
  
  return icons[type as keyof typeof icons] || icons.default;
}
