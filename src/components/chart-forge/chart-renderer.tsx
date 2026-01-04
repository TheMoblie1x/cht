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

  // Simple canvas-based 2D chart rendering
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

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

    // Draw chart based on type
    if (type === 'line' || type === 'area') {
      yValues.forEach((yField, seriesIndex) => {
        const values = chartData.rows.map(row => row[yField]);
        const maxValue = Math.max(...values) * 1.2;

        ctx.strokeStyle = appearance.colors.palette[seriesIndex % appearance.colors.palette.length];
        ctx.lineWidth = 3;
        ctx.beginPath();

        const stepX = chartWidth / (values.length - 1);

        values.forEach((value, index) => {
          const x = padding.left + stepX * index;
          const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
          
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });

        ctx.stroke();

        if (type === 'area') {
          ctx.fillStyle = `${appearance.colors.palette[seriesIndex % appearance.colors.palette.length]}20`;
          ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
          ctx.lineTo(padding.left, padding.top + chartHeight);
          ctx.closePath();
          ctx.fill();
        }

        // Draw points
        values.forEach((value, index) => {
          const x = padding.left + stepX * index;
          const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
          
          ctx.fillStyle = appearance.colors.palette[seriesIndex % appearance.colors.palette.length];
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      });
    } else if (type === 'bar') {
      const barWidth = chartWidth / (chartData.rows.length * yValues.length + chartData.rows.length);
      const maxValue = Math.max(...chartData.rows.map(row => 
        Math.max(...yValues.map(field => row[field] || 0))
      )) * 1.2;

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
      const values = chartData.rows.map(row => row[bindings.yAxis?.[0] || 'value']);
      const total = values.reduce((a, b) => a + b, 0);
      
      let startAngle = -Math.PI / 2;
      values.forEach((value, index) => {
        const sliceAngle = (value / total) * Math.PI * 2;
        const color = appearance.colors.palette[index % appearance.colors.palette.length];
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();

        startAngle += sliceAngle;
      });
    } else {
      // Default text for unsupported types
      ctx.fillStyle = '#64748b';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
        rect.width / 2,
        rect.height / 2
      );
    }

    // Draw axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    // X-axis labels
    const stepX = chartWidth / (xValues.length - 1 || 1);
    xValues.forEach((value, index) => {
      const x = padding.left + stepX * index;
      ctx.fillText(String(value), x, padding.top + chartHeight + 20);
    });

    // Y-axis labels
    ctx.textAlign = 'right';
    const maxValue = Math.max(...chartData.rows.map(row => 
      Math.max(...yValues.map(field => row[field] || 0))
    )) * 1.2;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      const value = Math.round((maxValue / 5) * (5 - i));
      ctx.fillText(String(value), padding.left - 10, y + 4);
    }

  }, [config, chartData, appearance, type, bindings]);

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
