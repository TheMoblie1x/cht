'use client';

import React from 'react';
import { ChartConfig, ChartData } from '@/types/chart-forge';
import { generateChartData } from '@/lib/chart-data-generator';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';

interface ChartRendererProps {
  config: ChartConfig;
  data?: ChartData;
  width?: number;
  height?: number;
}

// Theme configurations
const THEMES = {
  light: {
    bg: '#ffffff',
    gridColor: '#e2e8f0',
    axisColor: '#64748b',
    textColor: '#1f2937',
    gridOpacity: 0.6,
  },
  dark: {
    bg: '#1f2937',
    gridColor: '#374151',
    axisColor: '#9ca3af',
    textColor: '#f3f4f6',
    gridOpacity: 0.4,
  },
  minimal: {
    bg: '#fafafa',
    gridColor: '#f0f0f0',
    axisColor: '#666666',
    textColor: '#333333',
    gridOpacity: 0.3,
  },
};

// Helper to convert hex to rgba
function hexToRgba(hex: string, alpha: number = 1): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Helper: Project 3D point to 2D with rotation
function project3DToIsometric(
  x: number,
  y: number,
  z: number,
  centerX: number,
  centerY: number,
  scale: number = 1,
  rotationX: number = 0,
  rotationY: number = 0,
  rotationZ: number = 0
) {
  let px = x, py = y, pz = z;

  if (rotationX !== 0) {
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const newPy = py * cosX - pz * sinX;
    const newPz = py * sinX + pz * cosX;
    py = newPy;
    pz = newPz;
  }

  if (rotationY !== 0) {
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const newPx = px * cosY + pz * sinY;
    const newPz = -px * sinY + pz * cosY;
    px = newPx;
    pz = newPz;
  }

  if (rotationZ !== 0) {
    const cosZ = Math.cos(rotationZ);
    const sinZ = Math.sin(rotationZ);
    const newPx = px * cosZ - py * sinZ;
    const newPy = px * sinZ + py * cosZ;
    px = newPx;
    py = newPy;
  }

  const isometric = {
    x: (px - py) * (scale * 0.866),
    y: (px + py) * (scale * 0.5) - pz * (scale * 0.866),
  };
  return {
    x: centerX + isometric.x,
    y: centerY + isometric.y,
  };
}

// Helper: Get max Y value for scale calculation
function getMaxYValue(rows: any[], yAxis: string | string[] | undefined): number {
  if (!rows || rows.length === 0) return 100;
  const yField = Array.isArray(yAxis) ? yAxis[0] : (yAxis || 'value');
  const values = rows
    .map(row => {
      const v = row[yField];
      return typeof v === 'number' ? v : 0;
    })
    .filter(v => v > 0);
  return values.length > 0 ? Math.max(...values) : 100;
}

export default function ChartRenderer({ config, data, width, height }: ChartRendererProps) {
  const chartData = data || generateChartData(config.type);
  const { appearance, type, bindings } = config;

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [rotationX, setRotationX] = React.useState(0);
  const [rotationY, setRotationY] = React.useState(0);
  const [rotationZ, setRotationZ] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = React.useState({ w: 800, h: 400 });


  const is3DChart = ['surface', 'scatter3d', 'bar3d', 'line3d', 'area3d', 'volume', 'globe', 'map3d', 'tube', 'ribbon', 'cone', 'cone3d', 'pyramid', 'scatterBubble3d', 'cylinder'].includes(type);

  // Get theme from appearance or default to light
  const themeName = (appearance as any)?.colorTheme || 'light';
  const theme = THEMES[themeName as keyof typeof THEMES] || THEMES.light;

  // Check if grid should be shown
  const showGrid = (appearance as any)?.showGrid !== false;
  const showAxes = (appearance as any)?.showAxes !== false;
  const showAxisLabels = (appearance as any)?.showAxisLabels !== false;

  const drawChart = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const padding = appearance.layout.padding;
    const chartWidth = rect.width - padding.left - padding.right;
    const chartHeight = rect.height - padding.top - padding.bottom;

    // Draw background
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Enhanced grid and axes drawer
    const drawGridAndAxes = (showXLabel = true, showYLabel = true, xLabel = 'X Axis', yLabel = 'Y Axis') => {
      // Draw grid lines
      if (showGrid) {
        ctx.strokeStyle = hexToRgba(theme.gridColor, theme.gridOpacity);
        ctx.lineWidth = 1;
        
        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
          const y = padding.top + (chartHeight / 5) * i;
          ctx.beginPath();
          ctx.moveTo(padding.left, y);
          ctx.lineTo(padding.left + chartWidth, y);
          ctx.stroke();
        }

        // Vertical grid lines
        const xGridCount = Math.min(chartData.rows.length, 10);
        for (let i = 0; i <= xGridCount; i++) {
          const x = padding.left + (chartWidth / xGridCount) * i;
          ctx.beginPath();
          ctx.moveTo(x, padding.top);
          ctx.lineTo(x, padding.top + chartHeight);
          ctx.stroke();
        }
      }

      // Draw axes
      if (showAxes) {
        ctx.strokeStyle = theme.axisColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top);
        ctx.lineTo(padding.left, padding.top + chartHeight);
        ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
        ctx.stroke();
      }

      // Draw axis labels
      if (showAxisLabels) {
        ctx.fillStyle = theme.textColor;
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(xLabel, padding.left + chartWidth / 2, rect.height - 10);
        
        ctx.save();
        ctx.translate(10, padding.top + chartHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillText(yLabel, 0, 0);
        ctx.restore();
      }
    };

    // Line chart
    if (type === 'line') {
      drawGridAndAxes(true, true, (appearance.axes?.x?.title || 'Month'), (appearance.axes?.y?.title || 'Value'));
      const yValues = bindings.yAxis ? (Array.isArray(bindings.yAxis) ? bindings.yAxis : [bindings.yAxis]) : ['value'];
      
      yValues.forEach((yField, seriesIndex) => {
        const values = chartData.rows.map(row => {
          const v = row[yField];
          return typeof v === 'number' ? v : 0;
        });
        
        const validValues = values.filter(v => v > 0);
        const maxValue = validValues.length > 0 ? Math.max(...validValues) * 1.2 : 100;
        
        const color = appearance.colors.palette[seriesIndex % appearance.colors.palette.length];
        ctx.strokeStyle = color;
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
        
        values.forEach((value, index) => {
          const x = padding.left + stepX * index;
          const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      // Draw Y-axis scale labels
      if (showAxisLabels) {
        ctx.fillStyle = theme.textColor;
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'right';
        const maxYValue = getMaxYValue(chartData.rows, bindings.yAxis);
        const step = maxYValue / 5;
        for (let i = 0; i <= 5; i++) {
          const y = padding.top + (chartHeight / 5) * i;
          const value = Math.round((5 - i) * step);
          ctx.fillText(value.toString(), padding.left - 10, y + 3);
        }
      }
    }
    // Area chart
    else if (type === 'area') {
      drawGridAndAxes(true, true, (appearance.axes?.x?.title || 'Month'), (appearance.axes?.y?.title || 'Value'));
      const yValues = bindings.yAxis ? (Array.isArray(bindings.yAxis) ? bindings.yAxis : [bindings.yAxis]) : ['value'];
      
      yValues.forEach((yField, seriesIndex) => {
        const values = chartData.rows.map(row => {
          const v = row[yField];
          return typeof v === 'number' ? v : 0;
        });
        
        const validValues = values.filter(v => v > 0);
        const maxValue = validValues.length > 0 ? Math.max(...validValues) * 1.2 : 100;
        
        const color = appearance.colors.palette[seriesIndex % appearance.colors.palette.length];
        ctx.strokeStyle = color;
        ctx.fillStyle = hexToRgba(color, 0.3);
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const stepX = chartWidth / Math.max(1, values.length - 1);
        values.forEach((value, index) => {
          const x = padding.left + stepX * index;
          const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
          if (index === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        
        ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
        ctx.lineTo(padding.left, padding.top + chartHeight);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
    }
    // Bar chart
    else if (type === 'bar') {
      drawGridAndAxes(true, true, (appearance.axes?.x?.title || 'Category'), (appearance.axes?.y?.title || 'Value'));
      const yValues = bindings.yAxis ? (Array.isArray(bindings.yAxis) ? bindings.yAxis : [bindings.yAxis]) : ['value'];
      
      const allValues = chartData.rows.flatMap(row => 
        yValues.map(field => {
          const v = row[field];
          return typeof v === 'number' ? v : 0;
        })
      );
      
      const validValues = allValues.filter(v => v > 0);
      const maxValue = validValues.length > 0 ? Math.max(...validValues) * 1.2 : 100;
      
      const totalBars = chartData.rows.length * yValues.length + chartData.rows.length;
      const barWidth = chartWidth / Math.max(1, totalBars);
      
      yValues.forEach((yField, seriesIndex) => {
        chartData.rows.forEach((row, index) => {
          const value = typeof row[yField] === 'number' ? row[yField] : 0;
          const x = padding.left + (barWidth * (index * yValues.length + seriesIndex + index));
          const barHeight = (value / maxValue) * chartHeight;
          const y = padding.top + chartHeight - barHeight;
          
          const color = appearance.colors.palette[seriesIndex % appearance.colors.palette.length];
          ctx.fillStyle = color;
          ctx.fillRect(x, y, barWidth, barHeight);
        });
      });
    }
    // Pie chart
    else if (type === 'pie' || type === 'doughnut') {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const radius = Math.min(chartWidth, chartHeight) / 2 - 20;
      
      const valueField = bindings.yAxis && Array.isArray(bindings.yAxis) ? bindings.yAxis[0] : bindings.yAxis || 'value';
      const values = chartData.rows.map(row => {
        const v = row[valueField];
        return typeof v === 'number' ? v : 0;
      });
      
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
    }
    // Scatter chart
    else if (type === 'scatter') {
      drawGridAndAxes(true, true, (appearance.axes?.x?.title || 'X'), (appearance.axes?.y?.title || 'Y'));
      const xVals = chartData.rows.map(row => typeof row['x'] === 'number' ? row['x'] : 0);
      const yVals = chartData.rows.map(row => typeof row['y'] === 'number' ? row['y'] : 0);
      const maxX = Math.max(...xVals, 1);
      const maxY = Math.max(...yVals, 1);
      
      chartData.rows.forEach((row, index) => {
        const x = padding.left + (row['x'] / maxX) * chartWidth;
        const y = padding.top + chartHeight - (row['y'] / maxY) * chartHeight;
        const color = appearance.colors.palette[index % appearance.colors.palette.length];
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    // Bubble chart
    else if (type === 'bubble') {
      drawGridAndAxes(true, true, (appearance.axes?.x?.title || 'X'), (appearance.axes?.y?.title || 'Y'));
      const xVals = chartData.rows.map(row => typeof row['x'] === 'number' ? row['x'] : 0);
      const yVals = chartData.rows.map(row => typeof row['y'] === 'number' ? row['y'] : 0);
      const sizes = chartData.rows.map(row => typeof row['size'] === 'number' ? row['size'] : 0);
      const maxX = Math.max(...xVals, 1);
      const maxY = Math.max(...yVals, 1);
      const maxSize = Math.max(...sizes, 1);
      
      chartData.rows.forEach((row, index) => {
        const x = padding.left + (row['x'] / maxX) * chartWidth;
        const y = padding.top + chartHeight - (row['y'] / maxY) * chartHeight;
        const radius = (row['size'] / maxSize) * 15 + 3;
        const color = appearance.colors.palette[index % appearance.colors.palette.length];
        
        ctx.fillStyle = hexToRgba(color, 0.5);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }
    // Heatmap
    else if (type === 'heatmap') {
      const uniqueDays = [...new Set(chartData.rows.map(r => r['day']))];
      const cellHeight = chartHeight / uniqueDays.length;
      const cellWidth = chartWidth / 24;
      
      chartData.rows.forEach(row => {
        const dayIndex = uniqueDays.indexOf(row['day']);
        const hourIndex = parseInt(row['hour']?.toString().split(':')[0] || '0');
        const x = padding.left + hourIndex * cellWidth;
        const y = padding.top + dayIndex * cellHeight;
        const value = Math.min((row['value'] || 0) / 100, 1);
        
        ctx.fillStyle = `rgba(59, 130, 246, ${value})`;
        ctx.fillRect(x, y, cellWidth, cellHeight);
        ctx.strokeStyle = hexToRgba(theme.gridColor, 0.5);
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, cellWidth, cellHeight);
      });
    }
    // Radar chart
    else if (type === 'radar') {
      const categories = chartData.rows.map(r => r['axis'] || r['skill']);
      const seriesFields = chartData.columns.filter(c => c.name !== 'axis' && c.name !== 'skill').map(c => c.name);
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const radius = Math.min(chartWidth, chartHeight) / 2 - 20;
      const angleSlice = (Math.PI * 2) / categories.length;

      // Draw gridlines
      for (let level = 1; level <= 5; level++) {
        ctx.strokeStyle = hexToRgba(theme.gridColor, theme.gridOpacity);
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < categories.length; i++) {
          const angle = angleSlice * i - Math.PI / 2;
          const x = centerX + (radius * level / 5) * Math.cos(angle);
          const y = centerY + (radius * level / 5) * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Draw radial axes
      for (let i = 0; i < categories.length; i++) {
        const angle = angleSlice * i - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        ctx.strokeStyle = theme.axisColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      // Draw data series
      seriesFields.forEach((field, seriesIndex) => {
        const color = appearance.colors.palette[seriesIndex % appearance.colors.palette.length];
        ctx.strokeStyle = color;
        ctx.fillStyle = hexToRgba(color, 0.2);
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        categories.forEach((cat, i) => {
          const value = chartData.rows[i][field] || 0;
          const angle = angleSlice * i - Math.PI / 2;
          const x = centerX + (radius * (value / 100)) * Math.cos(angle);
          const y = centerY + (radius * (value / 100)) * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
    }
    // Gauge chart
    else if (type === 'gauge') {
      const value = Math.min((chartData.rows[0]?.value || 0) / 100, 1);
      const centerX = rect.width / 2;
      const centerY = rect.height * 0.7;
      const radius = Math.min(chartWidth, chartHeight) / 2 - 20;

      // Background arc
      ctx.strokeStyle = hexToRgba(theme.gridColor, 0.8);
      ctx.lineWidth = 15;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, Math.PI, Math.PI * 2);
      ctx.stroke();

      // Value arc
      const color = appearance.colors.palette[0];
      ctx.strokeStyle = color;
      ctx.lineWidth = 15;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, Math.PI, Math.PI + Math.PI * value);
      ctx.stroke();

      // Center circle
      ctx.fillStyle = theme.bg;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 20, 0, Math.PI * 2);
      ctx.fill();

      // Value text
      ctx.fillStyle = theme.textColor;
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round(value * 100)}%`, centerX, centerY - 10);
    }
    // Candlestick/OHLC chart
    else if (type === 'candlestick' || type === 'ohlc') {
      drawGridAndAxes(true, true, (appearance.axes?.x?.title || 'Date'), (appearance.axes?.y?.title || 'Price'));
      const maxHigh = Math.max(...chartData.rows.map(r => typeof r['high'] === 'number' ? r['high'] : 0));
      const minLow = Math.min(...chartData.rows.map(r => typeof r['low'] === 'number' ? r['low'] : 0));
      const range = maxHigh - minLow || 1;
      const candleWidth = chartWidth / chartData.rows.length * 0.6;

      chartData.rows.forEach((row, index) => {
        const open = typeof row['open'] === 'number' ? row['open'] : 0;
        const high = typeof row['high'] === 'number' ? row['high'] : 0;
        const low = typeof row['low'] === 'number' ? row['low'] : 0;
        const close = typeof row['close'] === 'number' ? row['close'] : 0;

        const x = padding.left + (chartWidth / chartData.rows.length) * (index + 0.5);
        const yHigh = padding.top + chartHeight - ((high - minLow) / range) * chartHeight;
        const yLow = padding.top + chartHeight - ((low - minLow) / range) * chartHeight;
        const yOpen = padding.top + chartHeight - ((open - minLow) / range) * chartHeight;
        const yClose = padding.top + chartHeight - ((close - minLow) / range) * chartHeight;

        // Wick
        ctx.strokeStyle = close >= open ? '#10b981' : '#ef4444';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        // Body
        ctx.fillStyle = close >= open ? '#10b981' : '#ef4444';
        ctx.fillRect(x - candleWidth / 2, Math.min(yOpen, yClose), candleWidth, Math.abs(yClose - yOpen));
      });
    }
    // Treemap
    else if (type === 'treemap') {
      const children = chartData.rows.filter(r => r['parent'] === 'root');
      const cellWidth = chartWidth / Math.max(children.length, 1);
      
      children.forEach((child, index) => {
        const x = padding.left + index * cellWidth;
        const y = padding.top;
        const h = chartHeight / 2;
        const color = appearance.colors.palette[index % appearance.colors.palette.length];
        
        ctx.fillStyle = color;
        ctx.fillRect(x, y, cellWidth, h);
        ctx.strokeStyle = theme.bg;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, cellWidth, h);
        ctx.fillStyle = theme.textColor;
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(child['id'] || 'Item', x + cellWidth / 2, y + h / 2);
      });
    }
    // Waterfall chart
    else if (type === 'waterfall') {
      drawGridAndAxes(true, true, (appearance.axes?.x?.title || 'Category'), (appearance.axes?.y?.title || 'Value'));
      const values = chartData.rows.map(row => {
        const v = row['value'];
        return typeof v === 'number' ? v : 0;
      });
      
      const maxVal = Math.max(...values.filter(v => v > 0)) * 1.2 || 100;
      const barWidth = chartWidth / chartData.rows.length * 0.6;
      let cumulative = 0;

      values.forEach((value, index) => {
        const x = padding.left + (chartWidth / chartData.rows.length) * (index + 0.5);
        if (value > 0) {
          const height = (value / maxVal) * chartHeight;
          ctx.fillStyle = appearance.colors.palette[0];
          ctx.fillRect(x - barWidth / 2, padding.top + chartHeight - height, barWidth, height);
          cumulative += value;
        } else if (value < 0) {
          const height = (-value / maxVal) * chartHeight;
          ctx.fillStyle = appearance.colors.palette[1];
          const yPos = padding.top + chartHeight - ((cumulative + value) / maxVal) * chartHeight;
          ctx.fillRect(x - barWidth / 2, yPos, barWidth, height);
          cumulative += value;
        }
      });
    }
    // 3D Surface Chart
    else if (type === 'surface') {
      const xSize = 10, ySize = 10;
      const rows = chartData.rows;
      const centerX = (padding.left + padding.left + chartWidth) / 2;
      const centerY = (padding.top + padding.top + chartHeight) / 2;
      const scale = Math.min(chartWidth, chartHeight) / 200;

      ctx.strokeStyle = hexToRgba(theme.gridColor, theme.gridOpacity);
      ctx.lineWidth = 0.5;
      for (let i = 0; i < xSize - 1; i++) {
        for (let j = 0; j < ySize - 1; j++) {
          const idx = i * ySize + j;
          if (idx + ySize < rows.length) {
            const p1 = project3DToIsometric(rows[idx].x || i, rows[idx].y || j, rows[idx].z || 0, centerX, centerY, scale, rotationX, rotationY, rotationZ);
            const p2 = project3DToIsometric(rows[idx + 1].x || i, rows[idx + 1].y || j, rows[idx + 1].z || 0, centerX, centerY, scale, rotationX, rotationY, rotationZ);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      const color = appearance.colors.palette[0];
      ctx.fillStyle = hexToRgba(color, 0.7);
      rows.forEach((row) => {
        const p = project3DToIsometric(row.x || 0, row.y || 0, row.z || 0, centerX, centerY, scale, rotationX, rotationY, rotationZ);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    // 3D Scatter Chart
    else if (type === 'scatter3d') {
      const rows = chartData.rows;
      const centerX = (padding.left + padding.left + chartWidth) / 2;
      const centerY = (padding.top + padding.top + chartHeight) / 2;
      const scale = Math.min(chartWidth, chartHeight) / 250;

      const validRows = rows.filter(r => typeof r.x === 'number' && typeof r.y === 'number' && typeof r.z === 'number');
      const maxX = Math.max(...validRows.map(r => r.x || 0), 1) || 100;
      const maxY = Math.max(...validRows.map(r => r.y || 0), 1) || 100;
      const maxZ = Math.max(...validRows.map(r => r.z || 0), 1) || 100;

      const color = appearance.colors.palette[0];
      validRows.forEach((row) => {
        const x = (row.x || 0) / maxX * 100;
        const y = (row.y || 0) / maxY * 100;
        const z = (row.z || 0) / maxZ * 100;
        const p = project3DToIsometric(x, y, z, centerX, centerY, scale, rotationX, rotationY, rotationZ);
        const size = Math.max(2, (row.size || 50) / 10);
        ctx.fillStyle = hexToRgba(color, 0.6);
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    // 3D Bar Chart
    else if (type === 'bar3d') {
      const rows = chartData.rows;
      const centerX = (padding.left + padding.left + chartWidth) / 2;
      const centerY = (padding.top + padding.top + chartHeight) / 2;
      const scale = Math.min(chartWidth, chartHeight) / 300;
      const barWidth = 8;

      rows.forEach((row, idx) => {
        const xPos = idx * 15;
        const yVal = Object.values(row).find(v => typeof v === 'number') || 0;
        const p = project3DToIsometric(xPos, 0, yVal as number, centerX, centerY, scale, rotationX, rotationY, rotationZ);
        const color = appearance.colors.palette[idx % appearance.colors.palette.length];
        ctx.fillStyle = hexToRgba(color, 0.8);
        ctx.fillRect(p.x - barWidth / 2, p.y, barWidth, 40);
      });
    }
    // 3D Line Chart
    else if (type === 'line3d') {
      const yValues = bindings.yAxis ? (Array.isArray(bindings.yAxis) ? bindings.yAxis : [bindings.yAxis]) : ['value'];
      const centerX = (padding.left + padding.left + chartWidth) / 2;
      const centerY = (padding.top + padding.top + chartHeight) / 2;
      const scale = Math.min(chartWidth, chartHeight) / 250;

      yValues.forEach((yField, seriesIndex) => {
        const values = chartData.rows.map(row => {
          const v = row[yField];
          return typeof v === 'number' ? v : 0;
        });

        const maxValue = Math.max(...values, 1) * 1.2 || 100;
        const color = appearance.colors.palette[seriesIndex % appearance.colors.palette.length];

        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();

        values.forEach((value, index) => {
          const x = index * 10;
          const y = seriesIndex * 20;
          const z = value / maxValue * 100;
          const p = project3DToIsometric(x, y, z, centerX, centerY, scale, rotationX, rotationY, rotationZ);
          if (index === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
      });
    }
    // 3D Area Chart
    else if (type === 'area3d') {
      const yValues = bindings.yAxis ? (Array.isArray(bindings.yAxis) ? bindings.yAxis : [bindings.yAxis]) : ['value'];
      const centerX = (padding.left + padding.left + chartWidth) / 2;
      const centerY = (padding.top + padding.top + chartHeight) / 2;
      const scale = Math.min(chartWidth, chartHeight) / 250;

      yValues.forEach((yField, seriesIndex) => {
        const values = chartData.rows.map(row => {
          const v = row[yField];
          return typeof v === 'number' ? v : 0;
        });

        const maxValue = Math.max(...values, 1) * 1.2 || 100;
        const color = appearance.colors.palette[seriesIndex % appearance.colors.palette.length];

        ctx.fillStyle = hexToRgba(color, 0.5);
        ctx.beginPath();

        values.forEach((value, index) => {
          const x = index * 10;
          const y = seriesIndex * 20;
          const z = value / maxValue * 100;
          const p = project3DToIsometric(x, y, z, centerX, centerY, scale, rotationX, rotationY, rotationZ);
          if (index === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });

        values.forEach((value, index) => {
          const x = index * 10;
          const y = seriesIndex * 20;
          const p = project3DToIsometric(x, y, 0, centerX, centerY, scale, rotationX, rotationY, rotationZ);
          if (index === values.length - 1) ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        values.forEach((value, index) => {
          const x = index * 10;
          const y = seriesIndex * 20;
          const z = value / maxValue * 100;
          const p = project3DToIsometric(x, y, z, centerX, centerY, scale, rotationX, rotationY, rotationZ);
          if (index === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
      });
    }
    // 3D Volume Chart
    else if (type === 'volume') {
      const rows = chartData.rows;
      const centerX = (padding.left + padding.left + chartWidth) / 2;
      const centerY = (padding.top + padding.top + chartHeight) / 2;
      const scale = Math.min(chartWidth, chartHeight) / 300;

      rows.slice(0, 20).forEach((row, idx) => {
        const xPos = idx * 12;
        const yVal = row.y || 0;
        const zVal = row.z || 0;
        const color = appearance.colors.palette[idx % appearance.colors.palette.length];
        const p = project3DToIsometric(xPos, yVal, zVal, centerX, centerY, scale, rotationX, rotationY, rotationZ);
        ctx.fillStyle = hexToRgba(color, 0.7);
        ctx.fillRect(p.x - 4, p.y - 4, 8, 8);
      });
    }
    // 3D Globe Chart
    else if (type === 'globe') {
      ctx.fillStyle = theme.bg;
      ctx.fillRect(padding.left, padding.top, chartWidth, chartHeight);

      const centerX = padding.left + chartWidth / 2;
      const centerY = padding.top + chartHeight / 2;
      const globeRadius = Math.min(chartWidth, chartHeight) / 2.5;

      ctx.strokeStyle = theme.axisColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
      ctx.stroke();

      const rows = chartData.rows;
      rows.forEach((row) => {
        const lat = row.lat || 0;
        const lng = row.lng || 0;
        const value = row.value || 0;

        const angle = ((lng + 180 + (rotationY * 180 / Math.PI)) / 360) * Math.PI * 2;
        const yPos = ((lat + 90) / 180) * Math.PI;
        const x = centerX + globeRadius * Math.cos(angle) * Math.sin(yPos);
        const y = centerY - globeRadius * Math.cos(yPos);

        const size = Math.max(2, (value / 300) * 8);
        ctx.fillStyle = hexToRgba(appearance.colors.palette[0], 0.8);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    // 3D Map Chart
    else if (type === 'map3d') {
      ctx.fillStyle = theme.bg;
      ctx.fillRect(padding.left, padding.top, chartWidth, chartHeight);

      const rows = chartData.rows;
      const centerX = padding.left + chartWidth / 2;
      const centerY = padding.top + chartHeight / 2;

      rows.forEach((row) => {
        const lat = row.lat || 0;
        const lng = row.lng || 0;
        const value = row.value || 0;

        const x = padding.left + ((lng + 180) / 360) * chartWidth;
        const y = padding.top + ((90 - lat) / 180) * chartHeight;

        const size = Math.max(3, (value / 300) * 10);
        ctx.fillStyle = hexToRgba(appearance.colors.palette[0], 0.7);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = appearance.colors.palette[0];
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }
    // 3D Tube Chart
    else if (type === 'tube') {
      const rows = chartData.rows;
      const centerX = (padding.left + padding.left + chartWidth) / 2;
      const centerY = (padding.top + padding.top + chartHeight) / 2;
      const scale = Math.min(chartWidth, chartHeight) / 250;
      const color = appearance.colors.palette[0];

      rows.forEach((row) => {
        const p = project3DToIsometric(row.x || 0, row.y || 0, row.z || 0, centerX, centerY, scale, rotationX, rotationY, rotationZ);
        const radius = Math.max(2, (row.radius || 10) / 2);
        ctx.fillStyle = hexToRgba(color, 0.6);
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }
    // 3D Ribbon Chart
    else if (type === 'ribbon') {
      const rows = chartData.rows;
      const centerX = (padding.left + padding.left + chartWidth) / 2;
      const centerY = (padding.top + padding.top + chartHeight) / 2;
      const scale = Math.min(chartWidth, chartHeight) / 250;
      const color = appearance.colors.palette[0];

      ctx.strokeStyle = hexToRgba(color, 0.8);
      ctx.lineWidth = 3;
      ctx.beginPath();

      rows.forEach((row, idx) => {
        const p = project3DToIsometric(row.x || 0, row.y || 0, row.z || 0, centerX, centerY, scale, rotationX, rotationY, rotationZ);
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      ctx.fillStyle = hexToRgba(color, 0.3);
      ctx.fill();
    }
    // 3D Cone Chart
    else if (type === 'cone') {
      const rows = chartData.rows;
      const centerX = (padding.left + padding.left + chartWidth) / 2;
      const centerY = (padding.top + padding.top + chartHeight) / 2;
      const scale = Math.min(chartWidth, chartHeight) / 250;

      rows.forEach((row, idx) => {
        const angle = row.angle || 0;
        const height = row.height || 0;
        const radius = row.radius || 20;
        const color = appearance.colors.palette[idx % appearance.colors.palette.length];

        const baseP = project3DToIsometric(Math.cos(angle) * radius, Math.sin(angle) * radius, 0, centerX, centerY, scale, rotationX, rotationY, rotationZ);
        const topP = project3DToIsometric(0, 0, height, centerX, centerY, scale, rotationX, rotationY, rotationZ);

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(baseP.x, baseP.y);
        ctx.lineTo(topP.x, topP.y);
        ctx.stroke();

        ctx.fillStyle = hexToRgba(color, 0.6);
        ctx.beginPath();
        ctx.arc(baseP.x, baseP.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    // 3D Pyramid Chart
    else if (type === 'pyramid') {
      const rows = chartData.rows;
      const centerX = (padding.left + padding.left + chartWidth) / 2;
      const centerY = (padding.top + padding.top + chartHeight) / 2;
      const scale = Math.min(chartWidth, chartHeight) / 300;

      const groupedByLevel = new Map();
      rows.forEach((row) => {
        const level = row.level || 0;
        if (!groupedByLevel.has(level)) groupedByLevel.set(level, []);
        groupedByLevel.get(level).push(row);
      });

      Array.from(groupedByLevel.entries())
        .sort((a, b) => a[0] - b[0])
        .forEach(([level, levelRows]) => {
          levelRows.forEach((row, idx) => {
            const x = row.x || 0;
            const y = row.y || 0;
            const z = row.z || 0;
            const color = appearance.colors.palette[level % appearance.colors.palette.length];
            const p = project3DToIsometric(x, y, z, centerX, centerY, scale, rotationX, rotationY, rotationZ);
            ctx.fillStyle = hexToRgba(color, 0.7);
            ctx.fillRect(p.x - 6, p.y - 6, 12, 12);
          });
        });
    }
    // 3D Scatter Bubble Chart
    else if (type === 'scatterBubble3d') {
      const rows = chartData.rows;
      const centerX = (padding.left + padding.left + chartWidth) / 2;
      const centerY = (padding.top + padding.top + chartHeight) / 2;
      const scale = Math.min(chartWidth, chartHeight) / 250;

      const categories = [...new Set(rows.map(r => r.category))];
      rows.forEach((row) => {
        const catIdx = categories.indexOf(row.category);
        const color = appearance.colors.palette[catIdx % appearance.colors.palette.length];
        const p = project3DToIsometric(row.x || 0, row.y || 0, row.z || 0, centerX, centerY, scale, rotationX, rotationY, rotationZ);
        const size = Math.max(3, (row.size || 100) / 20);
        ctx.fillStyle = hexToRgba(color, 0.6);
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    // 3D Cone (alias for cone3d)
    else if (type === 'cone3d') {
      const rows = chartData.rows;
      const centerX = (padding.left + padding.left + chartWidth) / 2;
      const centerY = (padding.top + padding.top + chartHeight) / 2;
      const scale = Math.min(chartWidth, chartHeight) / 250;

      rows.forEach((row, idx) => {
        const angle = row.angle || 0;
        const height = row.height || 0;
        const radius = row.radius || 20;
        const color = appearance.colors.palette[idx % appearance.colors.palette.length];

        const baseP = project3DToIsometric(Math.cos(angle) * radius, Math.sin(angle) * radius, 0, centerX, centerY, scale, rotationX, rotationY, rotationZ);
        const topP = project3DToIsometric(0, 0, height, centerX, centerY, scale, rotationX, rotationY, rotationZ);

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(baseP.x, baseP.y);
        ctx.lineTo(topP.x, topP.y);
        ctx.stroke();
      });
    }
    // 3D Cylinder Chart
    else if (type === 'cylinder') {
      const rows = chartData.rows;
      const centerX = (padding.left + padding.left + chartWidth) / 2;
      const centerY = (padding.top + padding.top + chartHeight) / 2;
      const scale = Math.min(chartWidth, chartHeight) / 250;

      rows.forEach((row, idx) => {
        const angle = row.angle || 0;
        const height = row.height || 0;
        const radius = row.radius || 20;
        const color = appearance.colors.palette[idx % appearance.colors.palette.length];

        const topAngle = angle + 0.2;
        const baseP = project3DToIsometric(Math.cos(angle) * radius, Math.sin(angle) * radius, 0, centerX, centerY, scale, rotationX, rotationY, rotationZ);
        const topP = project3DToIsometric(Math.cos(topAngle) * radius, Math.sin(topAngle) * radius, height, centerX, centerY, scale, rotationX, rotationY, rotationZ);

        ctx.strokeStyle = hexToRgba(color, 0.8);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(baseP.x, baseP.y);
        ctx.lineTo(topP.x, topP.y);
        ctx.stroke();
      });
    }
    // Default fallback
    else {
      ctx.fillStyle = theme.textColor;
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${type.charAt(0).toUpperCase() + type.slice(1)}`, rect.width / 2, rect.height / 2 - 20);
      ctx.font = '12px sans-serif';
      ctx.fillStyle = hexToRgba(theme.textColor, 0.6);
      ctx.fillText('(rendering not yet implemented)', rect.width / 2, rect.height / 2 + 20);
    }
  }, [chartData, appearance, type, bindings, rotationX, rotationY, rotationZ, theme, showGrid, showAxes, showAxisLabels]);

  // Mouse drag handler for 3D rotation
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!is3DChart) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !is3DChart) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setRotationY(prev => prev + deltaX * 0.01);
    setRotationX(prev => prev + deltaY * 0.01);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetRotation = () => {
    setRotationX(0);
    setRotationY(0);
    setRotationZ(0);
  };

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
    <div ref={containerRef} className="w-full h-full flex flex-col gap-2">
      {appearance.title && (
        <h3 className="text-sm font-semibold px-4 pt-4" style={{ color: theme.textColor }}>
          {appearance.title}
        </h3>
      )}
      
      <div className="flex-1 relative px-4 pb-4 min-h-0">
        <canvas
          ref={canvasRef}
          className="w-full h-full border border-gray-200"
          style={{ cursor: is3DChart ? 'grab' : 'default', display: 'block' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        {/* 3D Rotation Controls */}
        {is3DChart && (
          <div className="absolute top-4 right-4 flex gap-2 bg-white rounded shadow-md p-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetRotation}
              title="Reset rotation (drag canvas to rotate)"
              className="h-8 w-8 p-0"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {is3DChart && (
        <div className="px-4 pb-4 text-xs" style={{ color: theme.textColor }}>
          💡 Drag to rotate | Reset to default view
        </div>
      )}
    </div>
  );
}