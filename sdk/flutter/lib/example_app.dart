/// ChartForge Flutter Example App
/// 
/// Demonstrates how to use the ChartForge Flutter SDK

import 'package:flutter/material.dart';
import 'lib/models/chart_models.dart';
import 'lib/widgets/chart_widgets.dart';

void main() {
  runApp(const ChartForgeExampleApp());
}

class ChartForgeExampleApp extends StatelessWidget {
  const ChartForgeExampleApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ChartForge Flutter Examples',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: const DashboardPage(),
    );
  }
}

/// Main dashboard page
class DashboardPage extends StatefulWidget {
  const DashboardPage({Key? key}) : super(key: key);

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  int _selectedIndex = 0;

  final List<Widget> _pages = [
    const LineChartExample(),
    const BarChartExample(),
    const PieChartExample(),
    const ScatterChartExample(),
    const ThreeDSurfaceExample(),
    const ThreeDScatterExample(),
    const DashboardExample(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ChartForge Examples'),
        backgroundColor: Colors.blue.shade700,
        foregroundColor: Colors.white,
      ),
      body: _pages[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.show_chart),
            label: 'Line',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.bar_chart),
            label: 'Bar',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.pie_chart),
            label: 'Pie',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.scatter_plot),
            label: 'Scatter',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.view_in_ar),
            label: '3D Surface',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.threed_rotation),
            label: '3D Scatter',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
        ],
      ),
    );
  }
}

/// Line Chart Example
class LineChartExample extends StatelessWidget {
  const LineChartExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final chartConfig = ChartConfig(
      id: 'line-chart-1',
      type: 'line',
      dimension: ChartDimension.twoD,
      bindings: ChartBindings(
        xAxis: 'month',
        yAxis: ['revenue', 'cost'],
      ),
      appearance: ChartAppearance(
        title: 'Revenue vs Cost (2024)',
        theme: 'light',
        colors: ChartColors(
          palette: ['#3b82f6', '#ef4444'],
        ),
        layout: ChartLayout(
          width: 600,
          height: 400,
          x: 0,
          y: 0,
          padding: ChartPadding(top: 20, right: 20, bottom: 40, left: 60),
          responsive: true,
        ),
      ),
    );

    final chartData = ChartData(
      columns: [
        ChartColumn(name: 'month', type: ColumnType.string, displayName: 'Month'),
        ChartColumn(name: 'revenue', type: ColumnType.number, displayName: 'Revenue'),
        ChartColumn(name: 'cost', type: ColumnType.number, displayName: 'Cost'),
      ],
      rows: [
        {'month': 'Jan', 'revenue': 45000, 'cost': 32000},
        {'month': 'Feb', 'revenue': 52000, 'cost': 35000},
        {'month': 'Mar', 'revenue': 48000, 'cost': 33000},
        {'month': 'Apr', 'revenue': 61000, 'cost': 42000},
        {'month': 'May', 'revenue': 55000, 'cost': 38000},
        {'month': 'Jun', 'revenue': 67000, 'cost': 45000},
        {'month': 'Jul', 'revenue': 72000, 'cost': 48000},
        {'month': 'Aug', 'revenue': 69000, 'cost': 46000},
        {'month': 'Sep', 'revenue': 78000, 'cost': 52000},
        {'month': 'Oct', 'revenue': 82000, 'cost': 55000},
        {'month': 'Nov', 'revenue': 75000, 'cost': 50000},
        {'month': 'Dec', 'revenue': 91000, 'cost': 61000},
      ],
      metadata: ChartDataMetadata(
        rowCount: 12,
        columnCount: 3,
        generatedAt: DateTime.now(),
        source: 'example',
      ),
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Line Chart Example'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: ChartForgeChart(
          config: chartConfig,
          data: chartData,
        ),
      ),
    );
  }
}

/// Bar Chart Example
class BarChartExample extends StatelessWidget {
  const BarChartExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final chartConfig = ChartConfig(
      id: 'bar-chart-1',
      type: 'bar',
      dimension: ChartDimension.twoD,
      bindings: ChartBindings(
        xAxis: 'product',
        yAxis: ['sales'],
      ),
      appearance: ChartAppearance(
        title: 'Product Sales',
        theme: 'light',
        colors: ChartColors(
          palette: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
        ),
        layout: ChartLayout(
          width: 600,
          height: 400,
          x: 0,
          y: 0,
          padding: ChartPadding(top: 20, right: 20, bottom: 40, left: 60),
          responsive: true,
        ),
      ),
    );

    final chartData = ChartData(
      columns: [
        ChartColumn(name: 'product', type: ColumnType.string, displayName: 'Product'),
        ChartColumn(name: 'sales', type: ColumnType.number, displayName: 'Sales'),
      ],
      rows: [
        {'product': 'Laptop', 'sales': 450},
        {'product': 'Phone', 'sales': 620},
        {'product': 'Tablet', 'sales': 380},
        {'product': 'Watch', 'sales': 290},
        {'product': 'Headphones', 'sales': 510},
        {'product': 'Speaker', 'sales': 340},
        {'product': 'Camera', 'sales': 270},
      ],
      metadata: ChartDataMetadata(
        rowCount: 7,
        columnCount: 2,
        generatedAt: DateTime.now(),
        source: 'example',
      ),
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Bar Chart Example'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: ChartForgeChart(
          config: chartConfig,
          data: chartData,
        ),
      ),
    );
  }
}

/// Pie Chart Example
class PieChartExample extends StatelessWidget {
  const PieChartExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final chartConfig = ChartConfig(
      id: 'pie-chart-1',
      type: 'pie',
      dimension: ChartDimension.twoD,
      bindings: ChartBindings(
        xAxis: 'region',
        yAxis: ['sales'],
      ),
      appearance: ChartAppearance(
        title: 'Sales by Region',
        theme: 'light',
        colors: ChartColors(
          palette: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
        ),
        layout: ChartLayout(
          width: 400,
          height: 400,
          x: 0,
          y: 0,
          padding: ChartPadding(top: 20, right: 20, bottom: 20, left: 20),
          responsive: true,
        ),
      ),
    );

    final chartData = ChartData(
      columns: [
        ChartColumn(name: 'region', type: ColumnType.string, displayName: 'Region'),
        ChartColumn(name: 'sales', type: ColumnType.number, displayName: 'Sales'),
      ],
      rows: [
        {'region': 'North America', 'sales': 35000},
        {'region': 'Europe', 'sales': 28000},
        {'region': 'Asia Pacific', 'sales': 42000},
        {'region': 'Latin America', 'sales': 18000},
        {'region': 'Middle East & Africa', 'sales': 12000},
      ],
      metadata: ChartDataMetadata(
        rowCount: 5,
        columnCount: 2,
        generatedAt: DateTime.now(),
        source: 'example',
      ),
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Pie Chart Example'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: ChartForgeChart(
          config: chartConfig,
          data: chartData,
        ),
      ),
    );
  }
}

/// Scatter Chart Example
class ScatterChartExample extends StatelessWidget {
  const ScatterChartExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final chartConfig = ChartConfig(
      id: 'scatter-chart-1',
      type: 'scatter',
      dimension: ChartDimension.twoD,
      bindings: ChartBindings(
        xAxis: 'advertising_spend',
        yAxis: ['revenue'],
      ),
      appearance: ChartAppearance(
        title: 'Advertising Spend vs Revenue',
        theme: 'light',
        colors: ChartColors(
          palette: ['#3b82f6'],
        ),
        layout: ChartLayout(
          width: 600,
          height: 400,
          x: 0,
          y: 0,
          padding: ChartPadding(top: 20, right: 20, bottom: 40, left: 60),
          responsive: true,
        ),
      ),
    );

    final chartData = ChartData(
      columns: [
        ChartColumn(name: 'advertising_spend', type: ColumnType.number, displayName: 'Ad Spend'),
        ChartColumn(name: 'revenue', type: ColumnType.number, displayName: 'Revenue'),
      ],
      rows: [
        {'advertising_spend': 5000, 'revenue': 45000},
        {'advertising_spend': 7000, 'revenue': 52000},
        {'advertising_spend': 3000, 'revenue': 38000},
        {'advertising_spend': 9000, 'revenue': 61000},
        {'advertising_spend': 6000, 'revenue': 55000},
        {'advertising_spend': 12000, 'revenue': 67000},
        {'advertising_spend': 8000, 'revenue': 72000},
        {'advertising_spend': 10000, 'revenue': 69000},
        {'advertising_spend': 15000, 'revenue': 78000},
        {'advertising_spend': 11000, 'revenue': 82000},
      ],
      metadata: ChartDataMetadata(
        rowCount: 10,
        columnCount: 2,
        generatedAt: DateTime.now(),
        source: 'example',
      ),
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Scatter Plot Example'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: ChartForgeChart(
          config: chartConfig,
          data: chartData,
        ),
      ),
    );
  }
}

/// 3D Surface Chart Example
class ThreeDSurfaceExample extends StatelessWidget {
  const ThreeDSurfaceExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final chartConfig = ChartConfig(
      id: 'surface-3d-1',
      type: 'surface',
      dimension: ChartDimension.threeD,
      bindings: ChartBindings(
        xAxis: 'x',
        yAxis: ['y'],
        zAxis: 'z',
      ),
      appearance: ChartAppearance(
        title: '3D Surface Plot',
        theme: 'light',
        colors: ChartColors(
          palette: ['#3b82f6', '#ef4444'],
        ),
        layout: ChartLayout(
          width: 600,
          height: 400,
          x: 0,
          y: 0,
          padding: ChartPadding(top: 20, right: 20, bottom: 20, left: 20),
          responsive: true,
        ),
      ),
    );

    // Generate 3D surface data
    final rows = <Map<String, dynamic>>[];
    for (int i = -5; i <= 5; i++) {
      for (int j = -5; j <= 5; j++) {
        final x = i / 5;
        final z = j / 5;
        final y = (x * x + z * z).toDouble(); // Surface function
        rows.add({'x': x.toString(), 'y': y.toString(), 'z': z.toString()});
      }
    }

    final chartData = ChartData(
      columns: [
        ChartColumn(name: 'x', type: ColumnType.number, displayName: 'X'),
        ChartColumn(name: 'y', type: ColumnType.number, displayName: 'Y'),
        ChartColumn(name: 'z', type: ColumnType.number, displayName: 'Z'),
      ],
      rows: rows,
      metadata: ChartDataMetadata(
        rowCount: rows.length,
        columnCount: 3,
        generatedAt: DateTime.now(),
        source: 'example',
      ),
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('3D Surface Plot Example'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: ChartForgeChart(
          config: chartConfig,
          data: chartData,
          height: 500,
        ),
      ),
    );
  }
}

/// 3D Scatter Chart Example
class ThreeDScatterExample extends StatelessWidget {
  const ThreeDScatterExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final chartConfig = ChartConfig(
      id: 'scatter-3d-1',
      type: 'scatter3d',
      dimension: ChartDimension.threeD,
      bindings: ChartBindings(
        xAxis: 'x',
        yAxis: ['y'],
        zAxis: 'z',
      ),
      appearance: ChartAppearance(
        title: '3D Scatter Plot',
        theme: 'light',
        colors: ChartColors(
          palette: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
        ),
        layout: ChartLayout(
          width: 600,
          height: 400,
          x: 0,
          y: 0,
          padding: ChartPadding(top: 20, right: 20, bottom: 20, left: 20),
          responsive: true,
        ),
      ),
    );

    final chartData = ChartData(
      columns: [
        ChartColumn(name: 'x', type: ColumnType.number, displayName: 'X'),
        ChartColumn(name: 'y', type: ColumnType.number, displayName: 'Y'),
        ChartColumn(name: 'z', type: ColumnType.number, displayName: 'Z'),
      ],
      rows: [
        {'x': '1.5', 'y': '2.3', 'z': '3.1'},
        {'x': '2.1', 'y': '1.8', 'z': '2.7'},
        {'x': '3.4', 'y': '2.9', 'z': '1.4'},
        {'x': '1.2', 'y': '3.5', 'z': '2.3'},
        {'x': '2.8', 'y': '1.9', 'z': '3.6'},
        {'x': '3.2', 'y': '2.4', 'z': '1.8'},
        {'x': '1.7', 'y': '3.1', 'z': '2.5'},
        {'x': '2.5', 'y': '1.6', 'z': '3.4'},
        {'x': '3.7', 'y': '2.8', 'z': '1.2'},
        {'x': '1.9', 'y': '3.3', 'z': '2.6'},
      ],
      metadata: ChartDataMetadata(
        rowCount: 10,
        columnCount: 3,
        generatedAt: DateTime.now(),
        source: 'example',
      ),
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('3D Scatter Plot Example'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: ChartForgeChart(
          config: chartConfig,
          data: chartData,
          height: 500,
        ),
      ),
    );
  }
}

/// Complete Dashboard Example
class DashboardExample extends StatelessWidget {
  const DashboardExample({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final charts = [
      ChartConfig(
        id: 'dashboard-chart-1',
        type: 'line',
        dimension: ChartDimension.twoD,
        bindings: ChartBindings(xAxis: 'month', yAxis: ['revenue']),
        appearance: ChartAppearance(
          title: 'Monthly Revenue',
          theme: 'light',
          colors: ChartColors(palette: ['#3b82f6']),
          layout: ChartLayout(
            width: 600,
            height: 300,
            x: 0,
            y: 0,
            padding: ChartPadding(top: 20, right: 20, bottom: 40, left: 60),
            responsive: true,
          ),
        ),
      ),
      ChartConfig(
        id: 'dashboard-chart-2',
        type: 'bar',
        dimension: ChartDimension.twoD,
        bindings: ChartBindings(xAxis: 'region', yAxis: ['sales']),
        appearance: ChartAppearance(
          title: 'Sales by Region',
          theme: 'light',
          colors: ChartColors(palette: ['#10b981', '#f59e0b', '#ef4444']),
          layout: ChartLayout(
            width: 600,
            height: 300,
            x: 0,
            y: 0,
            padding: ChartPadding(top: 20, right: 20, bottom: 40, left: 60),
            responsive: true,
          ),
        ),
      ),
      ChartConfig(
        id: 'dashboard-chart-3',
        type: 'pie',
        dimension: ChartDimension.twoD,
        bindings: ChartBindings(xAxis: 'category', yAxis: ['value']),
        appearance: ChartAppearance(
          title: 'Category Distribution',
          theme: 'light',
          colors: ChartColors(palette: ['#8b5cf6', '#ec4899', '#6366f1']),
          layout: ChartLayout(
            width: 300,
            height: 300,
            x: 0,
            y: 0,
            padding: ChartPadding(top: 20, right: 20, bottom: 20, left: 20),
            responsive: true,
          ),
        ),
      ),
      ChartConfig(
        id: 'dashboard-chart-4',
        type: 'scatter3d',
        dimension: ChartDimension.threeD,
        bindings: ChartBindings(
          xAxis: 'x',
          yAxis: ['y'],
          zAxis: 'z',
        ),
        appearance: ChartAppearance(
          title: '3D Performance Metrics',
          theme: 'light',
          colors: ChartColors(palette: ['#3b82f6']),
          layout: ChartLayout(
            width: 600,
            height: 300,
            x: 0,
            y: 0,
            padding: ChartPadding(top: 20, right: 20, bottom: 20, left: 20),
            responsive: true,
          ),
        ),
      ),
    ];

    final dataProvider = (String chartId) {
      // In a real app, this would fetch data from API
      return ChartData(
        columns: [
          ChartColumn(name: 'x', type: ColumnType.number, displayName: 'X'),
          ChartColumn(name: 'y', type: ColumnType.number, displayName: 'Y'),
        ],
        rows: [
          {'x': '1', 'y': '10'},
          {'x': '2', 'y': '20'},
          {'x': '3', 'y': '30'},
          {'x': '4', 'y': '25'},
          {'x': '5', 'y': '40'},
        ],
        metadata: ChartDataMetadata(
          rowCount: 5,
          columnCount: 2,
          generatedAt: DateTime.now(),
          source: 'example',
        ),
      );
    };

    return ChartForgeDashboard(
      name: 'Executive Dashboard',
      charts: charts,
      dataProvider: dataProvider,
      theme: 'light',
      showHeader: true,
      showFooter: true,
    );
  }
}
