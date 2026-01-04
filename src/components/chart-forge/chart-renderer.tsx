'use client';

import React from 'react';
import { ChartConfig, ChartData } from '@/types/chart-forge';

interface ChartRendererProps {
  config: ChartConfig;
  data?: ChartData;
  width?: number;
  height?: number;
}

// Mock data generator for demo
function generateMockData(type: string): ChartData {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return {
    columns: [
      { name: 'month', type: 'string', displayName: 'Month' },
      { name: 'value', type: 'number', displayName: 'Value' },
      { name: 'target', type: 'number', displayName: 'Target' },
    ],
    rows: months.map(month => ({
      month,
      value: Math.floor(Math.random() * 100) + 20,
      target: Math.floor(Math.random() * 100) + 40,
    })),
    metadata: {
      rowCount: 12,
      columnCount: 3,
      generatedAt: new Date().toISOString(),
      source: 'mock',
    },
  };
}

export default function ChartRenderer({ config, data, width, height }: ChartRendererProps) {
  const chartData = data || generateMockData(config.type);
  const { appearance, type, bindings } = config;

  // Simple canvas-based 2D chart rendering with resize handling
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const drawChart = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const padding = appearance.layout.padding;
    const chartWidth = rect.width - padding.left - padding.right;
    const chartHeight = rect.height - padding.top - padding.bottom;

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Get data
    const xValues = chartData.rows.map(row => row[bindings.xAxis || 'month']);
    const yValues = bindings.yAxis
      ? (Array.isArray(bindings.yAxis) ? bindings.yAxis : [bindings.yAxis])
      : ['value'];

    // Draw grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    ctx.stroke();

    // Render simple line/bar/pie (kept concise for readability)
    if (type === 'line' || type === 'area') {
      yValues.forEach((yField, seriesIndex) => {
        const values = chartData.rows.map(row => row[yField] || 0);
        const maxValue = Math.max(...values, 1) * 1.2;

        ctx.strokeStyle = appearance.colors.palette[seriesIndex % appearance.colors.palette.length];
        ctx.lineWidth = 3;
        ctx.beginPath();

        const stepX = chartWidth / Math.max(1, values.length - 1);
        values.forEach((value, index) => {
          const x = padding.left + stepX * index;
          const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
          if (index === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      });
    } else if (type === 'bar') {
      const totalBars = chartData.rows.length * yValues.length + chartData.rows.length;
      const barWidth = chartWidth / Math.max(1, totalBars);
      const maxValue = Math.max(...chartData.rows.map(row => Math.max(...yValues.map(f => row[f] || 0))), 1) * 1.2;
      yValues.forEach((yField, seriesIndex) => {
        chartData.rows.forEach((row, index) => {
          const value = row[yField] || 0;
          const x = padding.left + (barWidth * (index * yValues.length + seriesIndex + index));
          const barHeight = (value / maxValue) * chartHeight;
          const y = padding.top + chartHeight - barHeight;
          ctx.fillStyle = appearance.colors.palette[seriesIndex % appearance.colors.palette.length];
          ctx.fillRect(x, y, barWidth, barHeight);
        });
      });
    } else if (type === 'pie') {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const radius = Math.min(chartWidth, chartHeight) / 2 - 20;
      const values = chartData.rows.map(row => row[bindings.yAxis?.[0] || 'value'] || 0);
      const total = values.reduce((a, b) => a + b, 0) || 1;
      let startAngle = -Math.PI / 2;
      values.forEach((value, index) => {
        const sliceAngle = (value / total) * Math.PI * 2;
        ctx.fillStyle = appearance.colors.palette[index % appearance.colors.palette.length];
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();
        startAngle += sliceAngle;
      });
    } else {
      ctx.fillStyle = '#64748b';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${type.charAt(0).toUpperCase() + type.slice(1)} Chart`, rect.width / 2, rect.height / 2);
    }
  }, [chartData, appearance, type, bindings]);

  React.useEffect(() => {
    drawChart();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      drawChart();
    });
    ro.observe(canvas);
    window.addEventListener('resize', drawChart);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', drawChart);
    };
  }, [drawChart]);

  return (
    <div className="w-full h-full p-4">
      {appearance.title && (
        <h3 className="text-sm font-semibold mb-2 text-foreground">{appearance.title}</h3>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ height: 'calc(100% - 24px)' }}
      />
    </div>
  );
}
