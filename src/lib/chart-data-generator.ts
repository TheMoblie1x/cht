import { ChartData, ChartType } from '@/types/chart-forge';

/**
 * Generates realistic sample data for each chart type
 */
export function generateChartData(type: ChartType): ChartData {
  switch (type) {
    // Time Series
    case 'line':
    case 'area':
      return generateTimeSeriesData('Monthly Revenue', ['revenue', 'cost'], 12);

    // Bar Chart
    case 'bar':
      return generateCategoryData('Sales by Region', ['Q1', 'Q2', 'Q3', 'Q4']);

    // Pie & Doughnut
    case 'pie':
    case 'doughnut':
      return generatePieData('Market Share');

    // Scatter
    case 'scatter':
      return generateScatterData('Correlation Analysis', 30);

    // Bubble
    case 'bubble':
      return generateBubbleData('Company Performance', 15);

    // Heatmap
    case 'heatmap':
      return generateHeatmapData('Daily Activity', 7, 24);

    // Treemap
    case 'treemap':
      return generateTreemapData('Company Structure');

    // Radar
    case 'radar':
      return generateRadarData('Skills Assessment');

    // Financial
    case 'candlestick':
    case 'ohlc':
      return generateCandlestickData('Stock Price', 20);

    // Gauge
    case 'gauge':
      return generateGaugeData('Performance KPI');

    // Hierarchical
    case 'sunburst':
      return generateSunburstData('Organization');

    case 'icicle':
      return generateIcicleData('File System');

    case 'partition':
      return generatePartitionData('Data Distribution');

    // Special
    case 'parallel':
      return generateParallelData('Multi-variable Analysis');

    case 'waterfall':
      return generateWaterfallData('Quarterly Progression');

    // 3D Charts
    case 'surface':
      return generateSurfaceData('3D Surface', 10, 10);

    case 'scatter3d':
      return generateScatter3DData('3D Scatter', 20);

    case 'bar3d':
      return generateBar3DData('3D Bar Chart');

    case 'line3d':
      return generateLine3DData('3D Line');

    case 'area3d':
      return generateArea3DData('3D Area');

    case 'volume':
      return generateVolumeData('3D Volume');

    case 'globe':
      return generateGlobeData('World Sales');

    case 'map3d':
      return generateMap3DData('Geographic Data');

    case 'tube':
      return generateTubeData('3D Tube');

    case 'ribbon':
      return generateRibbonData('3D Ribbon');

    case 'cone':
    case 'cone3d':
      return generateConeData('3D Cone');

    case 'pyramid':
      return generatePyramidData('Hierarchical Pyramid');

    case 'scatterBubble3d':
      return generateScatterBubble3DData('3D Bubble', 20);

    case 'cylinder':
      return generateCylinderData('3D Cylinder');

    default:
      return generateTimeSeriesData('Sample Data', ['value'], 12);
  }
}

// ==================== Data Generators ====================

function generateTimeSeriesData(title: string, fields: string[], count: number): ChartData {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return {
    columns: [
      { name: 'month', type: 'string', displayName: 'Month' },
      ...fields.map(f => ({ name: f, type: 'number' as const, displayName: f.charAt(0).toUpperCase() + f.slice(1) })),
    ],
    rows: months.slice(0, count).map(month => ({
      month,
      ...Object.fromEntries(
        fields.map(f => [f, Math.floor(Math.random() * 100) + 20])
      ),
    })),
    metadata: {
      rowCount: count,
      columnCount: 1 + fields.length,
      generatedAt: new Date().toISOString(),
      source: title,
    },
  };
}

function generateCategoryData(title: string, categories: string[]): ChartData {
  const values = ['value1', 'value2', 'value3'];
  
  return {
    columns: [
      { name: 'category', type: 'string', displayName: 'Category' },
      ...values.map(v => ({ name: v, type: 'number' as const, displayName: v })),
    ],
    rows: categories.map(cat => ({
      category: cat,
      value1: Math.floor(Math.random() * 100) + 30,
      value2: Math.floor(Math.random() * 80) + 20,
      value3: Math.floor(Math.random() * 60) + 10,
    })),
    metadata: {
      rowCount: categories.length,
      columnCount: 4,
      generatedAt: new Date().toISOString(),
      source: title,
    },
  };
}

function generatePieData(title: string): ChartData {
  const categories = ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'];
  
  return {
    columns: [
      { name: 'name', type: 'string', displayName: 'Name' },
      { name: 'value', type: 'number', displayName: 'Value' },
    ],
    rows: categories.map(cat => ({
      name: cat,
      value: Math.floor(Math.random() * 50) + 10,
    })),
    metadata: {
      rowCount: categories.length,
      columnCount: 2,
      generatedAt: new Date().toISOString(),
      source: title,
    },
  };
}

function generateScatterData(title: string, count: number): ChartData {
  return {
    columns: [
      { name: 'x', type: 'number', displayName: 'X Axis' },
      { name: 'y', type: 'number', displayName: 'Y Axis' },
      { name: 'group', type: 'string', displayName: 'Group' },
    ],
    rows: Array.from({ length: count }, () => ({
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
      group: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
    })),
    metadata: {
      rowCount: count,
      columnCount: 3,
      generatedAt: new Date().toISOString(),
      source: title,
    },
  };
}

function generateBubbleData(title: string, count: number): ChartData {
  return {
    columns: [
      { name: 'x', type: 'number', displayName: 'X Axis' },
      { name: 'y', type: 'number', displayName: 'Y Axis' },
      { name: 'size', type: 'number', displayName: 'Size' },
      { name: 'company', type: 'string', displayName: 'Company' },
    ],
    rows: Array.from({ length: count }, (_, i) => ({
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
      size: Math.floor(Math.random() * 5000) + 500,
      company: `Company ${String.fromCharCode(65 + (i % 26))}`,
    })),
    metadata: {
      rowCount: count,
      columnCount: 4,
      generatedAt: new Date().toISOString(),
      source: title,
    },
  };
}

function generateHeatmapData(title: string, rows: number, cols: number): ChartData {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: cols }, (_, i) => `${i}:00`);

  return {
    columns: [
      { name: 'day', type: 'string', displayName: 'Day' },
      { name: 'hour', type: 'string', displayName: 'Hour' },
      { name: 'value', type: 'number', displayName: 'Activity' },
    ],
    rows: days.slice(0, rows).flatMap(day =>
      hours.map(hour => ({
        day,
        hour,
        value: Math.floor(Math.random() * 100),
      }))
    ),
    metadata: {
      rowCount: rows * cols,
      columnCount: 3,
      generatedAt: new Date().toISOString(),
      source: title,
    },
  };
}

function generateTreemapData(title: string): ChartData {
  return {
    columns: [
      { name: 'name', type: 'string', displayName: 'Name' },
      { name: 'parent', type: 'string', displayName: 'Parent' },
      { name: 'value', type: 'number', displayName: 'Value' },
    ],
    rows: [
      { name: 'Company', parent: '', value: 0 },
      { name: 'Engineering', parent: 'Company', value: 500 },
      { name: 'Sales', parent: 'Company', value: 300 },
      { name: 'Marketing', parent: 'Company', value: 200 },
      { name: 'Frontend', parent: 'Engineering', value: 250 },
      { name: 'Backend', parent: 'Engineering', value: 250 },
      { name: 'Enterprise', parent: 'Sales', value: 150 },
      { name: 'SMB', parent: 'Sales', value: 150 },
    ],
    metadata: {
      rowCount: 8,
      columnCount: 3,
      generatedAt: new Date().toISOString(),
      source: title,
    },
  };
}

function generateRadarData(title: string): ChartData {
  const skills = ['Communication', 'Problem Solving', 'Teamwork', 'Leadership', 'Technical', 'Creativity'];
  
  return {
    columns: [
      { name: 'skill', type: 'string', displayName: 'Skill' },
      { name: 'john', type: 'number', displayName: 'John' },
      { name: 'jane', type: 'number', displayName: 'Jane' },
    ],
    rows: skills.map(skill => ({
      skill,
      john: Math.floor(Math.random() * 100),
      jane: Math.floor(Math.random() * 100),
    })),
    metadata: {
      rowCount: skills.length,
      columnCount: 3,
      generatedAt: new Date().toISOString(),
      source: title,
    },
  };
}

function generateCandlestickData(title: string, count: number): ChartData {
  return {
    columns: [
      { name: 'date', type: 'string', displayName: 'Date' },
      { name: 'open', type: 'number', displayName: 'Open' },
      { name: 'high', type: 'number', displayName: 'High' },
      { name: 'low', type: 'number', displayName: 'Low' },
      { name: 'close', type: 'number', displayName: 'Close' },
    ],
    rows: Array.from({ length: count }, (_, i) => {
      const base = 100 + i;
      return {
        date: `Day ${i + 1}`,
        open: Math.round((base + Math.random() * 5) * 100) / 100,
        high: Math.round((base + Math.random() * 20) * 100) / 100,
        low: Math.round((base - Math.random() * 10) * 100) / 100,
        close: Math.round((base + Math.random() * 8) * 100) / 100,
      };
    }),
    metadata: {
      rowCount: count,
      columnCount: 5,
      generatedAt: new Date().toISOString(),
      source: title,
    },
  };
}

function generateGaugeData(title: string): ChartData {
  return {
    columns: [
      { name: 'metric', type: 'string', displayName: 'Metric' },
      { name: 'value', type: 'number', displayName: 'Value' },
      { name: 'max', type: 'number', displayName: 'Max' },
    ],
    rows: [
      { metric: 'Performance', value: 75, max: 100 },
    ],
    metadata: {
      rowCount: 1,
      columnCount: 3,
      generatedAt: new Date().toISOString(),
      source: title,
    },
  };
}

function generateSunburstData(title: string): ChartData {
  return {
    columns: [
      { name: 'name', type: 'string', displayName: 'Name' },
      { name: 'parent', type: 'string', displayName: 'Parent' },
      { name: 'value', type: 'number', displayName: 'Value' },
    ],
    rows: [
      { name: 'Root', parent: '', value: 0 },
      { name: 'Branch 1', parent: 'Root', value: 100 },
      { name: 'Branch 2', parent: 'Root', value: 150 },
      { name: 'Branch 3', parent: 'Root', value: 120 },
      { name: 'Leaf 1', parent: 'Branch 1', value: 50 },
      { name: 'Leaf 2', parent: 'Branch 1', value: 50 },
      { name: 'Leaf 3', parent: 'Branch 2', value: 75 },
      { name: 'Leaf 4', parent: 'Branch 2', value: 75 },
      { name: 'Leaf 5', parent: 'Branch 3', value: 60 },
      { name: 'Leaf 6', parent: 'Branch 3', value: 60 },
    ],
    metadata: {
      rowCount: 10,
      columnCount: 3,
      generatedAt: new Date().toISOString(),
      source: title,
    },
  };
}

function generateIcicleData(title: string): ChartData {
  return generateSunburstData(title);
}

function generatePartitionData(title: string): ChartData {
  return generateSunburstData(title);
}

function generateParallelData(title: string): ChartData {
  return {
    columns: [
      { name: 'name', type: 'string', displayName: 'Name' },
      { name: 'var1', type: 'number', displayName: 'Variable 1' },
      { name: 'var2', type: 'number', displayName: 'Variable 2' },
      { name: 'var3', type: 'number', displayName: 'Variable 3' },
      { name: 'var4', type: 'number', displayName: 'Variable 4' },
    ],
    rows: Array.from({ length: 10 }, (_, i) => ({
      name: `Data ${i + 1}`,
      var1: Math.floor(Math.random() * 100),
      var2: Math.floor(Math.random() * 100),
      var3: Math.floor(Math.random() * 100),
      var4: Math.floor(Math.random() * 100),
    })),
    metadata: {
      rowCount: 10,
      columnCount: 5,
      generatedAt: new Date().toISOString(),
      source: title,
    },
  };
}

function generateWaterfallData(title: string): ChartData {
  return {
    columns: [
      { name: 'label', type: 'string', displayName: 'Label' },
      { name: 'value', type: 'number', displayName: 'Value' },
    ],
    rows: [
      { label: 'Starting', value: 1000 },
      { label: 'Revenue', value: 500 },
      { label: 'Expenses', value: -300 },
      { label: 'Investments', value: 200 },
      { label: 'Other', value: -100 },
      { label: 'Total', value: 1300 },
    ],
    metadata: {
      rowCount: 6,
      columnCount: 2,
      generatedAt: new Date().toISOString(),
      source: title,
    },
  };
}

function generateSurfaceData(title: string, xCount: number, yCount: number): ChartData {
  return {
    columns: [
      { name: 'x', type: 'number', displayName: 'X' },
      { name: 'y', type: 'number', displayName: 'Y' },
      { name: 'z', type: 'number', displayName: 'Z' },
    ],
    rows: Array.from({ length: xCount * yCount }, (_, i) => ({
      x: (i % xCount) * 10,
      y: Math.floor(i / xCount) * 10,
      z: Math.sin((i % xCount) * 0.5) * Math.cos(Math.floor(i / xCount) * 0.5) * 50 + 50,
    })),
    metadata: {
      rowCount: xCount * yCount,
      columnCount: 3,
      generatedAt: new Date().toISOString(),
      source: title,
    },
  };
}

function generateScatter3DData(title: string, count: number): ChartData {
  return {
    columns: [
      { name: 'x', type: 'number', displayName: 'X' },
      { name: 'y', type: 'number', displayName: 'Y' },
      { name: 'z', type: 'number', displayName: 'Z' },
    ],
    rows: Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 100,
    })),
    metadata: {
      rowCount: count,
      columnCount: 3,
      generatedAt: new Date().toISOString(),
      source: title,
    },
  };
}

function generateBar3DData(title: string): ChartData {
  const categories = ['Product A', 'Product B', 'Product C', 'Product D'];
  
  return {
    columns: [
      { name: 'product', type: 'string', displayName: 'Product' },
      { name: 'q1', type: 'number', displayName: 'Q1' },
      { name: 'q2', type: 'number', displayName: 'Q2' },
      { name: 'q3', type: 'number', displayName: 'Q3' },
    ],
    rows: categories.map(product => ({
      product,
      q1: Math.floor(Math.random() * 100) + 30,
      q2: Math.floor(Math.random() * 100) + 30,
      q3: Math.floor(Math.random() * 100) + 30,
    })),
    metadata: {
      rowCount: categories.length,
      columnCount: 4,
      generatedAt: new Date().toISOString(),
      source: title,
    },
  };
}

function generateLine3DData(title: string): ChartData {
  return generateTimeSeriesData('3D Line Data', ['series1', 'series2'], 12);
}

function generateArea3DData(title: string): ChartData {
  return generateTimeSeriesData('3D Area Data', ['area1', 'area2'], 12);
}

function generateVolumeData(title: string): ChartData {
  return {
    columns: [
      { name: 'x', type: 'number', displayName: 'X' },
      { name: 'y', type: 'number', displayName: 'Y' },
      { name: 'z', type: 'number', displayName: 'Z' },
    ],
    rows: Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 100,
    })),
    metadata: {
      rowCount: 50,
      columnCount: 3,
      generatedAt: new Date().toISOString(),
      source: title,
    },
  };
}

function generateGlobeData(title: string): ChartData {
  return {
    columns: [
      { name: 'country', type: 'string', displayName: 'Country' },
      { name: 'lat', type: 'number', displayName: 'Latitude' },
      { name: 'lng', type: 'number', displayName: 'Longitude' },
      { name: 'value', type: 'number', displayName: 'Sales' },
    ],
    rows: [
      { country: 'USA', lat: 37.0902, lng: -95.7129, value: 150 },
      { country: 'Europe', lat: 54.5260, lng: 15.2551, value: 120 },
      { country: 'Asia', lat: 34.0479, lng: 100.6197, value: 180 },
      { country: 'Brazil', lat: -14.2350, lng: -51.9253, value: 80 },
      { country: 'Australia', lat: -25.2744, lng: 133.7751, value: 60 },
    ],
    metadata: {
      rowCount: 5,
      columnCount: 4,
      generatedAt: new Date().toISOString(),
      source: title,
    },
  };
}

function generateMap3DData(title: string): ChartData {
  return generateGlobeData(title);
}

function generateTubeData(title: string): ChartData {
  return generateScatter3DData('3D Tube', 30);
}

function generateRibbonData(title: string): ChartData {
  return generateSurfaceData('3D Ribbon', 15, 8);
}

function generateConeData(title: string): ChartData {
  const categories = ['Cone A', 'Cone B', 'Cone C'];
  
  return {
    columns: [
      { name: 'name', type: 'string', displayName: 'Name' },
      { name: 'value', type: 'number', displayName: 'Value' },
    ],
    rows: categories.map((name, i) => ({
      name,
      value: Math.floor(Math.random() * 100) + 20,
    })),
    metadata: {
      rowCount: categories.length,
      columnCount: 2,
      generatedAt: new Date().toISOString(),
      source: title,
    },
  };
}

function generatePyramidData(title: string): ChartData {
  return {
    columns: [
      { name: 'level', type: 'string', displayName: 'Level' },
      { name: 'value', type: 'number', displayName: 'Value' },
    ],
    rows: [
      { level: 'Executive', value: 10 },
      { level: 'Management', value: 50 },
      { level: 'Staff', value: 200 },
      { level: 'Entry Level', value: 500 },
    ],
    metadata: {
      rowCount: 4,
      columnCount: 2,
      generatedAt: new Date().toISOString(),
      source: title,
    },
  };
}

function generateScatterBubble3DData(title: string, count: number): ChartData {
  return {
    columns: [
      { name: 'x', type: 'number', displayName: 'X' },
      { name: 'y', type: 'number', displayName: 'Y' },
      { name: 'z', type: 'number', displayName: 'Z' },
      { name: 'size', type: 'number', displayName: 'Size' },
    ],
    rows: Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 100,
      size: Math.floor(Math.random() * 5000) + 500,
    })),
    metadata: {
      rowCount: count,
      columnCount: 4,
      generatedAt: new Date().toISOString(),
      source: title,
    },
  };
}

function generateCylinderData(title: string): ChartData {
  const categories = ['Cylinder A', 'Cylinder B', 'Cylinder C', 'Cylinder D'];
  
  return {
    columns: [
      { name: 'name', type: 'string', displayName: 'Name' },
      { name: 'value', type: 'number', displayName: 'Value' },
    ],
    rows: categories.map(name => ({
      name,
      value: Math.floor(Math.random() * 100) + 20,
    })),
    metadata: {
      rowCount: categories.length,
      columnCount: 2,
      generatedAt: new Date().toISOString(),
      source: title,
    },
  };
}