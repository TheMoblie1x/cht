/**
 * ChartForge JavaScript/Web SDK
 * 
 * Enterprise-grade SDK for embedding charts and dashboards
 * Compatible with all modern browsers and frameworks (React, Vue, Angular, vanilla JS)
 * 
 * @version 1.0.0
 */

import {
  ChartConfig,
  ChartData,
  Dashboard,
  ChartRef,
  DashboardRef,
  SDKConfig,
  AuthProvider,
  ChartForgeSDK as ChartForgeSDKInterface,
} from '@/types/chart-forge';

/**
 * ChartForge SDK Main Class
 */
export class ChartForgeSDK implements ChartForgeSDKInterface {
  private config: SDKConfig;
  private isInitialized = false;
  private apiBaseUrl: string;
  private apiKey?: string;
  private authProvider?: AuthProvider;
  private chartInstances = new Map<string, ChartRefImpl>();
  private dashboardInstances = new Map<string, DashboardRefImpl>();

  /**
   * Create SDK instance
   */
  constructor(config: SDKConfig) {
    this.config = config;
    this.apiBaseUrl = config.apiURL.replace(/\/$/, '');
    this.apiKey = config.apiKey;
    this.authProvider = config.authProvider;
    
    if (config.debug) {
      console.log('[ChartForge SDK] Debug mode enabled');
      console.log('[ChartForge SDK] API URL:', this.apiBaseUrl);
    }
  }

  /**
   * Initialize the SDK
   * Loads necessary resources and validates configuration
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.warn('[ChartForge SDK] Already initialized');
      return;
    }

    try {
      // Validate configuration
      if (!this.apiBaseUrl) {
        throw new Error('API URL is required');
      }

      // Load authentication token if auth provider is set
      if (this.authProvider) {
        await this.authProvider.getToken();
      }

      // Verify API connection
      await this.healthCheck();

      this.isInitialized = true;
      
      if (this.config.debug) {
        console.log('[ChartForge SDK] Initialized successfully');
      }
    } catch (error) {
      throw new Error(`Failed to initialize SDK: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Check API health
   */
  private async healthCheck(): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/health`, {
        method: 'GET',
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`API health check failed: ${response.status}`);
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[ChartForge SDK] Health check failed:', error);
      }
      throw error;
    }
  }

  /**
   * Get request headers
   */
  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    if (this.authProvider) {
      const token = await this.authProvider.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Render a single chart
   * 
   * @param container - DOM element to render chart into
   * @param config - Chart configuration
   * @param data - Chart data (optional, fetched from server if not provided)
   * @returns ChartRef for controlling the chart
   */
  renderChart(
    container: HTMLElement,
    config: ChartConfig,
    data?: ChartData
  ): ChartRef {
    if (!this.isInitialized) {
      throw new Error('SDK not initialized. Call initialize() first.');
    }

    // Clear container
    container.innerHTML = '';

    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    // Create chart instance
    const chartRef = new ChartRefImpl(container, canvas, config, data, {
      debug: this.config.debug,
      onClick: (data) => {
        if (this.config.debug) {
          console.log('[ChartForge SDK] Chart clicked:', data);
        }
        this.dispatchEvent('chartClick', { chartId: config.id, data });
      },
      onHover: (data) => {
        if (this.config.debug) {
          console.log('[ChartForge SDK] Chart hovered:', data);
        }
        this.dispatchEvent('chartHover', { chartId: config.id, data });
      },
    });

    this.chartInstances.set(config.id, chartRef);

    if (this.config.debug) {
      console.log('[ChartForge SDK] Chart rendered:', config.id);
    }

    return chartRef;
  }

  /**
   * Render a dashboard
   * 
   * @param container - DOM element to render dashboard into
   * @param dashboard - Dashboard configuration
   * @returns DashboardRef for controlling the dashboard
   */
  async renderDashboard(
    container: HTMLElement,
    dashboard: Dashboard
  ): Promise<DashboardRef> {
    if (!this.isInitialized) {
      throw new Error('SDK not initialized. Call initialize() first.');
    }

    // Clear container
    container.innerHTML = '';

    // Create dashboard wrapper
    const dashboardWrapper = document.createElement('div');
    dashboardWrapper.className = 'chartforge-dashboard';
    dashboardWrapper.style.cssText = `
      width: 100%;
      height: 100%;
      display: grid;
      gap: 16px;
      padding: 16px;
      grid-template-columns: repeat(${dashboard.layout.grid?.columns || 12}, 1fr);
      grid-auto-rows: ${dashboard.layout.grid?.rowHeight || 100}px;
    `;
    container.appendChild(dashboardWrapper);

    // Create dashboard instance
    const dashboardRef = new DashboardRefImpl(
      dashboardWrapper,
      dashboard,
      this
    );

    // Render each chart
    for (const chart of dashboard.charts) {
      const chartContainer = document.createElement('div');
      chartContainer.style.cssText = `
        grid-column: span ${chart.appearance.layout.width};
        grid-row: span ${chart.appearance.layout.height};
        position: relative;
        background: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        overflow: hidden;
      `;
      dashboardWrapper.appendChild(chartContainer);

      // Fetch chart data if not provided
      let chartData = chart.data as ChartData | undefined;
      if (!chartData) {
        try {
          chartData = await this.fetchChartData(chart.id);
        } catch (error) {
          console.error(`[ChartForge SDK] Failed to fetch data for chart ${chart.id}:`, error);
          continue;
        }
      }

      // Render chart
      this.renderChart(chartContainer, chart, chartData);
    }

    this.dashboardInstances.set(dashboard.id, dashboardRef);

    if (this.config.debug) {
      console.log('[ChartForge SDK] Dashboard rendered:', dashboard.id);
    }

    return dashboardRef;
  }

  /**
   * Load a dashboard from server
   */
  async loadDashboard(id: string): Promise<Dashboard> {
    if (!this.isInitialized) {
      throw new Error('SDK not initialized. Call initialize() first.');
    }

    const response = await fetch(`${this.apiBaseUrl}/api/dashboards/${id}`, {
      method: 'GET',
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to load dashboard: ${response.status}`);
    }

    const result = await response.json();
    return result.data as Dashboard;
  }

  /**
   * Update a dashboard on server
   */
  async updateDashboard(id: string, updates: Partial<Dashboard>): Promise<Dashboard> {
    if (!this.isInitialized) {
      throw new Error('SDK not initialized. Call initialize() first.');
    }

    const response = await fetch(`${this.apiBaseUrl}/api/dashboards/${id}`, {
      method: 'PUT',
      headers: await this.getHeaders(),
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update dashboard: ${response.status}`);
    }

    const result = await response.json();
    return result.data as Dashboard;
  }

  /**
   * Fetch chart data from server
   */
  private async fetchChartData(chartId: string): Promise<ChartData> {
    const response = await fetch(
      `${this.apiBaseUrl}/api/dashboards/charts/${chartId}/data`,
      {
        method: 'GET',
        headers: await this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch chart data: ${response.status}`);
    }

    const result = await response.json();
    return result.data as ChartData;
  }

  /**
   * Dispatch custom event
   */
  private dispatchEvent(name: string, detail: any) {
    const event = new CustomEvent(`chartforge:${name}`, { detail });
    window.dispatchEvent(event);
  }

  /**
   * Destroy all instances and cleanup
   */
  destroy(): void {
    // Destroy all charts
    this.chartInstances.forEach((chart) => chart.destroy());
    this.chartInstances.clear();

    // Destroy all dashboards
    this.dashboardInstances.forEach((dashboard) => dashboard.destroy());
    this.dashboardInstances.clear();

    this.isInitialized = false;

    if (this.config.debug) {
      console.log('[ChartForge SDK] Destroyed');
    }
  }
}

/**
 * Chart Reference Implementation
 * Provides methods to control a rendered chart
 */
class ChartRefImpl implements ChartRef {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private config: ChartConfig;
  private data?: ChartData;
  private options: any;
  private destroyed = false;

  constructor(
    container: HTMLElement,
    canvas: HTMLCanvasElement,
    config: ChartConfig,
    data?: ChartData,
    options?: any
  ) {
    this.container = container;
    this.canvas = canvas;
    this.config = config;
    this.data = data;
    this.options = options;
    
    // Initialize chart
    this.initChart();
  }

  /**
   * Initialize chart rendering
   */
  private initChart(): void {
    if (!this.data) return;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    const { config, data } = this;
    const { bindings, appearance } = config;
    const { layout, colors, theme } = appearance;

    // Set canvas size
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    
    const scale = window.devicePixelRatio;
    ctx.scale(scale, scale);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Apply theme
    const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const backgroundColor = colors.background || (isDark ? '#1a1a2e' : '#ffffff');
    const foregroundColor = colors.foreground || (isDark ? '#e2e8f0' : '#0f172a');

    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw title
    if (appearance.title) {
      ctx.fillStyle = foregroundColor;
      ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(appearance.title, rect.width / 2, 30);
    }

    // Render based on chart type
    // This is a simplified implementation
    // In production, this would delegate to specialized renderers
    this.renderChartContent(ctx, rect, scale);
  }

  /**
   * Render chart content based on type
   */
  private renderChartContent(ctx: CanvasRenderingContext2D, rect: DOMRect, scale: number): void {
    const { bindings, appearance } = this.config;
    const { data } = this;
    const { colors } = appearance;

    if (!data || data.rows.length === 0) return;

    const padding = appearance.layout.padding;
    const chartWidth = rect.width - padding.left - padding.right;
    const chartHeight = rect.height - padding.top - padding.bottom - 40; // Account for title

    // Get data values
    const xValues = data.rows.map(r => r[bindings.xAxis || 'x']);
    const yFields = Array.isArray(bindings.yAxis) ? bindings.yAxis : [bindings.yAxis || 'y'];
    const ySeries = yFields.map(field => data.rows.map(r => r[field]));

    // Draw axes
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + 40);
    ctx.lineTo(padding.left, padding.top + 40 + chartHeight);
    ctx.lineTo(padding.left + chartWidth, padding.top + 40 + chartHeight);
    ctx.stroke();

    // Draw data
    ySeries.forEach((values, seriesIndex) => {
      const color = colors.palette[seriesIndex % colors.palette.length];
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2;

      ctx.beginPath();

      const maxValue = Math.max(...values) * 1.2;
      const stepX = chartWidth / (values.length - 1);

      values.forEach((value, index) => {
        const x = padding.left + stepX * index;
        const y = padding.top + 40 + chartHeight - (value / maxValue) * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw points
      values.forEach((value, index) => {
        const x = padding.left + stepX * index;
        const y = padding.top + 40 + chartHeight - (value / maxValue) * chartHeight;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  }

  /**
   * Get chart as image
   */
  async getChartImage(format: 'png' | 'jpeg' | 'svg', quality = 0.92): Promise<Blob | string> {
    if (this.destroyed) {
      throw new Error('Chart has been destroyed');
    }

    if (format === 'svg') {
      // Return SVG representation
      return this.toSVG();
    } else {
      // Return PNG/JPEG blob
      return new Promise((resolve, reject) => {
        this.canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create image blob'));
            }
          },
          `image/${format}`,
          quality
        );
      });
    }
  }

  /**
   * Convert chart to SVG
   */
  private toSVG(): string {
    // Simplified SVG representation
    // In production, this would generate proper SVG from chart data
    const { width, height } = this.canvas.getBoundingClientRect();
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${this.config.appearance.colors.background || '#ffffff'}"/>
      <text x="50%" y="20" text-anchor="middle" font-family="sans-serif">
        ${this.config.appearance.title}
      </text>
      <!-- Chart data would be rendered here -->
    </svg>`;
  }

  /**
   * Export chart data
   */
  async exportData(format: 'csv' | 'json' | 'excel'): Promise<Blob | string> {
    if (this.destroyed || !this.data) {
      throw new Error('Chart has been destroyed or has no data');
    }

    if (format === 'json') {
      return JSON.stringify(this.data, null, 2);
    } else if (format === 'csv') {
      return this.toCSV();
    } else if (format === 'excel') {
      // Excel export would use a library like xlsx
      return this.toCSV(); // Fallback to CSV
    } else {
      throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Convert data to CSV
   */
  private toCSV(): string {
    if (!this.data) return '';

    const { columns, rows } = this.data;
    
    // Header row
    const header = columns.map(col => col.displayName || col.name).join(',');
    
    // Data rows
    const dataRows = rows.map(row => {
      return columns.map(col => {
        const value = row[col.name];
        // Escape CSV special characters
        const stringValue = String(value ?? '');
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',');
    });

    return [header, ...dataRows].join('\n');
  }

  /**
   * Refresh chart
   */
  async refresh(): Promise<void> {
    if (this.destroyed) {
      throw new Error('Chart has been destroyed');
    }

    // Re-render chart
    this.initChart();

    // Trigger refresh event
    if (this.options?.onRefresh) {
      this.options.onRefresh();
    }
  }

  /**
   * Destroy chart and cleanup
   */
  destroy(): void {
    this.destroyed = true;

    // Clear canvas
    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Remove canvas from DOM
    this.canvas.remove();

    if (this.options?.debug) {
      console.log('[ChartForge SDK] Chart destroyed:', this.config.id);
    }
  }
}

/**
 * Dashboard Reference Implementation
 * Provides methods to control a rendered dashboard
 */
class DashboardRefImpl implements DashboardRef {
  private container: HTMLElement;
  private dashboard: Dashboard;
  private sdk: ChartForgeSDK;
  private charts = new Map<string, ChartRefImpl>();

  constructor(
    container: HTMLElement,
    dashboard: Dashboard,
    sdk: ChartForgeSDK
  ) {
    this.container = container;
    this.dashboard = dashboard;
    this.sdk = sdk;
  }

  /**
   * Add a new chart to the dashboard
   */
  async addChart(chart: ChartConfig, data?: ChartData): Promise<string> {
    // Add to dashboard configuration
    this.dashboard.charts.push(chart);

    // Render chart
    const chartContainer = document.createElement('div');
    chartContainer.style.cssText = `
      grid-column: span ${chart.appearance.layout.width};
      grid-row: span ${chart.appearance.layout.height};
    `;
    this.container.appendChild(chartContainer);

    const chartRef = this.sdk['renderChart'](chartContainer, chart, data);
    this.charts.set(chart.id, chartRef);

    return chart.id;
  }

  /**
   * Update an existing chart
   */
  async updateChart(id: string, updates: Partial<ChartConfig>): Promise<void> {
    const chartIndex = this.dashboard.charts.findIndex(c => c.id === id);
    if (chartIndex === -1) {
      throw new Error(`Chart not found: ${id}`);
    }

    // Update configuration
    this.dashboard.charts[chartIndex] = {
      ...this.dashboard.charts[chartIndex],
      ...updates,
    };

    // Re-render chart
    const chartRef = this.charts.get(id);
    if (chartRef) {
      // In production, implement partial updates
      chartRef['config'] = {
        ...chartRef['config'],
        ...updates,
      };
      await chartRef.refresh();
    }
  }

  /**
   * Remove a chart from the dashboard
   */
  async removeChart(id: string): Promise<void> {
    const chartIndex = this.dashboard.charts.findIndex(c => c.id === id);
    if (chartIndex === -1) {
      throw new Error(`Chart not found: ${id}`);
    }

    // Remove from dashboard
    this.dashboard.charts.splice(chartIndex, 1);

    // Destroy and remove chart
    const chartRef = this.charts.get(id);
    if (chartRef) {
      chartRef.destroy();
      this.charts.delete(id);
    }
  }

  /**
   * Get a chart reference
   */
  getChart(id: string): ChartRef | null {
    return this.charts.get(id) || null;
  }

  /**
   * Export dashboard as image
   */
  async export(format: 'png' | 'pdf'): Promise<Blob | string> {
    if (format === 'png') {
      // Create canvas and render all charts
      const canvas = document.createElement('canvas');
      const rect = this.container.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');

      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, rect.width, rect.height);

      // In production, would use html2canvas library
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob as Blob);
        }, 'image/png');
      });
    } else if (format === 'pdf') {
      // PDF export would use a library like jsPDF
      throw new Error('PDF export not implemented - use jsPDF library');
    } else {
      throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Refresh all charts
   */
  async refresh(): Promise<void> {
    const refreshPromises = Array.from(this.charts.values()).map(chart => chart.refresh());
    await Promise.all(refreshPromises);
  }

  /**
   * Destroy dashboard and cleanup
   */
  destroy(): void {
    this.charts.forEach((chart) => chart.destroy());
    this.charts.clear();
    this.container.innerHTML = '';
  }
}

/**
 * Default export
 */
export default ChartForgeSDK;

/**
 * Export types for TypeScript users
 */
export type {
  ChartConfig,
  ChartData,
  Dashboard,
  ChartRef,
  DashboardRef,
  SDKConfig,
  AuthProvider,
};
