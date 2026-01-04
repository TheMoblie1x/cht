# ChartForge JavaScript/Web SDK

> Enterprise-grade SDK for embedding charts and dashboards in modern web applications.

## Features

- 🎨 **40+ Chart Types** - 2D Canvas and 3D WebGL rendering
- 📊 **Dashboard Support** - Complete dashboard embedding and management
- 🔄 **Real-time Updates** - Live data refresh and synchronization
- 🎯 **Type-Safe** - Full TypeScript support with comprehensive types
- 🔌 **Authentication** - OAuth 2.0, API Keys, Bearer tokens
- 📦 **Framework Agnostic** - Works with React, Vue, Angular, or vanilla JS
- 🚀 **High Performance** - Canvas-based rendering optimized for production
- 🌙 **Theme Support** - Light, dark, and auto theme detection
- 📱 **Responsive** - Automatically adapts to container size
- 🎯 **Event System** - Custom events for interaction tracking

## Installation

### NPM

```bash
npm install @chartforge/sdk
```

### Yarn

```bash
yarn add @chartforge/sdk
```

### CDN

```html
<script src="https://cdn.chartforge.io/sdk/latest/chart-forge-sdk.js"></script>
```

## Quick Start

### 1. Initialize the SDK

```typescript
import ChartForgeSDK from '@chartforge/sdk';

const sdk = new ChartForgeSDK({
  apiURL: 'https://api.chartforge.io',
  apiKey: 'your-api-key',
  debug: true, // Enable debug logging
});

// Initialize the SDK
await sdk.initialize();
```

### 2. Render a Chart

```typescript
// Get container element
const container = document.getElementById('chart-container');

// Define chart configuration
const chartConfig = {
  id: 'revenue-chart',
  type: 'line',
  dimension: '2d',
  bindings: {
    xAxis: 'month',
    yAxis: ['revenue', 'cost'],
  },
  appearance: {
    title: 'Revenue vs Cost',
    theme: 'light',
    colors: {
      palette: ['#3b82f6', '#ef4444'],
    },
    layout: {
      width: 600,
      height: 400,
      padding: { top: 20, right: 20, bottom: 40, left: 60 },
      responsive: true,
    },
  },
  interactions: {
    zoomable: true,
    pan: true,
    crosshair: true,
  },
};

// Define chart data
const chartData = {
  columns: [
    { name: 'month', type: 'string', displayName: 'Month' },
    { name: 'revenue', type: 'number', displayName: 'Revenue' },
    { name: 'cost', type: 'number', displayName: 'Cost' },
  ],
  rows: [
    { month: 'Jan', revenue: 10000, cost: 8000 },
    { month: 'Feb', revenue: 12000, cost: 9000 },
    { month: 'Mar', revenue: 15000, cost: 11000 },
    { month: 'Apr', revenue: 14000, cost: 10500 },
    { month: 'May', revenue: 18000, cost: 13000 },
  ],
  metadata: {
    rowCount: 5,
    columnCount: 3,
    generatedAt: new Date().toISOString(),
    source: 'custom',
  },
};

// Render the chart
const chart = sdk.renderChart(container, chartConfig, chartData);

// Listen to chart events
window.addEventListener('chartforge:chartClick', (event) => {
  console.log('Chart clicked:', event.detail);
});
```

### 3. Render a Dashboard

```typescript
// Get container element
const dashboardContainer = document.getElementById('dashboard-container');

// Define dashboard configuration
const dashboardConfig = {
  id: 'sales-dashboard',
  name: 'Sales Dashboard',
  workspaceId: 'workspace-1',
  charts: [
    {
      id: 'chart-1',
      type: 'bar',
      dimension: '2d',
      bindings: { xAxis: 'month', yAxis: ['sales'] },
      appearance: {
        title: 'Monthly Sales',
        theme: 'light',
        colors: { palette: ['#3b82f6'] },
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
      },
    },
    {
      id: 'chart-2',
      type: 'pie',
      dimension: '2d',
      bindings: { xAxis: 'category', yAxis: ['value'] },
      appearance: {
        title: 'Sales by Region',
        theme: 'light',
        colors: { palette: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'] },
        layout: {
          width: 6,
          height: 4,
          x: 6,
          y: 0,
          padding: { top: 20, right: 20, bottom: 40, left: 60 },
          responsive: true,
        },
      },
      interactions: {
        zoomable: true,
      },
    },
  ],
  layout: {
    type: 'grid',
    grid: {
      columns: 12,
      rowHeight: 100,
      margin: [16, 16],
      breakpoints: { xs: 1, sm: 6, md: 8, lg: 12, xl: 12, xxl: 12 },
    },
  },
  settings: {
    theme: 'light',
    showHeader: true,
    showFooter: true,
    exportEnabled: true,
  },
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 'user-1',
  updatedBy: 'user-1',
};

// Render the dashboard
const dashboard = await sdk.renderDashboard(dashboardContainer, dashboardConfig);
```

## Advanced Usage

### Custom Authentication

```typescript
import ChartForgeSDK from '@chartforge/sdk';

// Define custom auth provider
const customAuthProvider = {
  async getToken(): Promise<string> {
    // Implement your token retrieval logic
    const token = localStorage.getItem('custom_token');
    if (!token) {
      throw new Error('No token found');
    }
    return token;
  },
  
  async refreshToken(): Promise<string> {
    // Implement token refresh logic
    const newToken = await fetchNewToken();
    localStorage.setItem('custom_token', newToken);
    return newToken;
  },
  
  async logout(): Promise<void> {
    // Implement logout logic
    localStorage.removeItem('custom_token');
  },
};

// Initialize SDK with custom auth
const sdk = new ChartForgeSDK({
  apiURL: 'https://api.chartforge.io',
  authProvider: customAuthProvider,
});

await sdk.initialize();
```

### Loading Dashboard from Server

```typescript
// Load dashboard by ID
const dashboard = await sdk.loadDashboard('dashboard-123');

// Render the loaded dashboard
const container = document.getElementById('dashboard-container');
await sdk.renderDashboard(container, dashboard);
```

### Updating Dashboard

```typescript
// Update dashboard configuration
const updatedDashboard = await sdk.updateDashboard('dashboard-123', {
  name: 'Updated Dashboard Name',
  charts: [
    // ... updated charts array
  ],
});
```

### Chart Interactions

```typescript
// Get chart reference
const chart = sdk.renderChart(container, chartConfig, chartData);

// Export chart as PNG
const pngBlob = await chart.getChartImage('png', 0.92);
const url = URL.createObjectURL(pngBlob);
window.open(url);

// Export chart data as CSV
const csvData = await chart.exportData('csv');
console.log(csvData);

// Refresh chart (re-render)
await chart.refresh();

// Destroy chart
chart.destroy();
```

### Dashboard Interactions

```typescript
// Get dashboard reference
const dashboard = await sdk.renderDashboard(container, dashboardConfig);

// Add a new chart to dashboard
const newChartConfig = {
  id: 'new-chart',
  type: 'line',
  dimension: '2d',
  // ... chart configuration
};
const chartId = await dashboard.addChart(newChartConfig, chartData);

// Update an existing chart
await dashboard.updateChart('chart-1', {
  appearance: {
    title: 'Updated Title',
  },
});

// Remove a chart
await dashboard.removeChart('chart-2');

// Get chart reference
const chart = dashboard.getChart('chart-1');
if (chart) {
  // Use chart methods
  await chart.refresh();
}

// Export entire dashboard as PNG
const pngBlob = await dashboard.export('png');
const url = URL.createObjectURL(pngBlob);
window.open(url);

// Refresh all charts
await dashboard.refresh();

// Destroy dashboard
dashboard.destroy();
```

## React Integration

```typescript
import { useEffect, useRef } from 'react';
import ChartForgeSDK from '@chartforge/sdk';

function ChartComponent({ config, data }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize SDK
    const sdk = new ChartForgeSDK({
      apiURL: process.env.NEXT_PUBLIC_CHARTFORGE_API_URL!,
    });

    // Render chart
    chartRef.current = sdk.renderChart(containerRef.current, config, data);

    // Cleanup
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [config, data]);

  return <div ref={containerRef} style={{ width: '100%', height: '400px' }} />;
}

export default ChartComponent;
```

## Vue Integration

```vue
<template>
  <div ref="chartContainer" style="width: 100%; height: 400px;"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import ChartForgeSDK from '@chartforge/sdk';

const props = defineProps<{
  config: ChartConfig;
  data: ChartData;
}>();

const chartContainer = ref<HTMLDivElement>();
let chartRef: any = null;

onMounted(async () => {
  const sdk = new ChartForgeSDK({
    apiURL: import.meta.env.VITE_CHARTFORGE_API_URL,
  });
  
  await sdk.initialize();
  chartRef = sdk.renderChart(chartContainer.value!, props.config, props.data);
});

onUnmounted(() => {
  if (chartRef) {
    chartRef.destroy();
  }
});
</script>
```

## Angular Integration

```typescript
import { Component, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import ChartForgeSDK from '@chartforge/sdk';

@Component({
  selector: 'app-chart',
  template: '<div #chartContainer style="width: 100%; height: 400px;"></div>',
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartContainer') chartContainer!: ElementRef<HTMLDivElement>;
  private chartRef: any = null;
  private sdk: ChartForgeSDK;

  constructor() {
    this.sdk = new ChartForgeSDK({
      apiURL: environment.chartForgeApiUrl,
    });
  }

  async ngAfterViewInit() {
    await this.sdk.initialize();
    this.chartRef = this.sdk.renderChart(
      this.chartContainer.nativeElement,
      this.config,
      this.data
    );
  }

  ngOnDestroy() {
    if (this.chartRef) {
      this.chartRef.destroy();
    }
  }

  @Input() config!: ChartConfig;
  @Input() data!: ChartData;
}
```

## Chart Types

### 2D Charts (25+)

- **Basic**: Line, Bar, Area, Pie, Doughnut
- **Advanced**: Scatter, Bubble, Heatmap, Treemap, Radar
- **Financial**: Candlestick, OHLC, Gauge
- **Hierarchical**: Sunburst, Icicle, Treemap, Partition
- **Network**: Sankey, Chord
- **Flow**: Funnel, Streamgraph
- **Statistical**: Histogram, Boxplot, Violin
- **Special**: Waterfall, Bullet, Wordcloud, Parallel Coordinates

### 3D Charts (15+)

- **Surface**: Surface Plot
- **Scatter**: 3D Scatter, Scatter Bubble 3D
- **Bar**: 3D Bar
- **Line**: 3D Line
- **Area**: 3D Area
- **Volume**: Volume rendering
- **Geospatial**: Globe, 3D Map
- **Custom**: Tube, Ribbon, Cone, Pyramid, Cylinder, Cone 3D

## Events

The SDK dispatches custom events that you can listen to:

### chartClick
Fired when a user clicks on a chart element.

```typescript
window.addEventListener('chartforge:chartClick', (event) => {
  console.log('Chart clicked:', event.detail.chartId, event.detail.data);
});
```

### chartHover
Fired when a user hovers over a chart element.

```typescript
window.addEventListener('chartforge:chartHover', (event) => {
  console.log('Chart hovered:', event.detail.chartId, event.detail.data);
});
```

## API Reference

### ChartForgeSDK

#### Constructor
```typescript
new ChartForgeSDK(config: SDKConfig)
```

#### Methods

- `initialize(): Promise<void>` - Initialize the SDK
- `renderChart(container, config, data?): ChartRef` - Render a single chart
- `renderDashboard(container, dashboard): Promise<DashboardRef>` - Render a dashboard
- `loadDashboard(id): Promise<Dashboard>` - Load dashboard from server
- `updateDashboard(id, updates): Promise<Dashboard>` - Update dashboard
- `destroy(): void` - Destroy all instances

### ChartRef

#### Methods

- `getChartImage(format?, quality?): Promise<Blob | string>` - Export chart as image
- `exportData(format): Promise<Blob | string>` - Export chart data
- `refresh(): Promise<void>` - Re-render chart
- `destroy(): void` - Destroy chart

### DashboardRef

#### Methods

- `addChart(chart, data?): Promise<string>` - Add new chart
- `updateChart(id, updates): Promise<void>` - Update chart
- `removeChart(id): Promise<void>` - Remove chart
- `getChart(id): ChartRef | null` - Get chart reference
- `export(format): Promise<Blob | string>` - Export dashboard
- `refresh(): Promise<void>` - Refresh all charts
- `destroy(): void` - Destroy dashboard

## Configuration

### SDKConfig

```typescript
interface SDKConfig {
  apiURL: string;           // Required: API base URL
  apiKey?: string;          // Optional: API key for authentication
  authProvider?: AuthProvider; // Optional: Custom authentication provider
  theme?: 'light' | 'dark'; // Optional: Default theme
  locale?: string;           // Optional: Default locale
  debug?: boolean;           // Optional: Enable debug logging (default: false)
}
```

### ChartConfig

See [ChartForge Type Documentation](https://chartforge.io/docs/types) for complete chart configuration options.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Tips

1. **Lazy Loading**: Load charts on demand when they come into viewport
2. **Data Pagination**: Use server-side pagination for large datasets
3. **Chart Caching**: Enable caching for frequently accessed charts
4. **Debounce Resize**: Debounce window resize events
5. **Optimize Data**: Pre-aggregate data on server when possible

## Troubleshooting

### Chart not rendering

1. Check that the container element exists and has dimensions
2. Verify that `initialize()` has been called and resolved
3. Check browser console for error messages
4. Ensure data is properly formatted

### Authentication errors

1. Verify API key is valid and has required permissions
2. Check that API URL is correct
3. Ensure CORS is configured for your domain
4. Verify auth provider implementation (if using custom auth)

### Performance issues

1. Reduce number of data points
2. Disable animations for large datasets
3. Use server-side aggregation
4. Enable debug mode to identify bottlenecks

## License

Proprietary - All rights reserved. Contact ChartForge for licensing information.

## Support

- Documentation: https://chartforge.io/docs
- GitHub Issues: https://github.com/chartforge/sdk/issues
- Email: support@chartforge.io
- Status Page: https://status.chartforge.io

## Changelog

### 1.0.0 (2024-01-XX)
- Initial release
- Support for 40+ chart types
- Dashboard embedding
- Custom authentication
- Event system
- Export functionality
- TypeScript support
