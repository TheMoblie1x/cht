# ChartForge Flutter SDK

> Enterprise-grade Flutter SDK for embedding charts and dashboards in mobile applications.

## Features

- 🎨 **40+ Chart Types** - 2D CustomPainter and 3D WebView rendering
- 📊 **Dashboard Support** - Complete dashboard embedding
- 🎯 **Type-Safe** - Full Dart type support
- 📱 **Mobile-First** - Optimized for iOS and Android
- 🌙 **Theme Support** - Light and dark themes
- 🔄 **Real-time Updates** - Live data refresh
- 🚀 **High Performance** - Native rendering for 2D, WebGL for 3D

## Installation

Add to your `pubspec.yaml`:

```yaml
dependencies:
  chartforge_sdk:
    git: https://github.com/chartforge/flutter-sdk.git
    version: ^1.0.0
  
  # For 3D charts
  webview_flutter: ^4.0.0
```

Then run:

```bash
flutter pub get
```

## Quick Start

### 1. Import the SDK

```dart
import 'package:chartforge_sdk/models/chart_models.dart';
import 'package:chartforge_sdk/widgets/chart_widgets.dart';
```

### 2. Render a 2D Chart

```dart
ChartForgeChart(
  config: ChartConfig(
    id: 'revenue-chart',
    type: 'line',
    dimension: ChartDimension.twoD,
    bindings: ChartBindings(
      xAxis: 'month',
      yAxis: ['revenue', 'cost'],
    ),
    appearance: ChartAppearance(
      title: 'Revenue vs Cost',
      theme: 'light',
      colors: ChartColors(
        palette: ['#3b82f6', '#ef4444'],
      ),
      layout: ChartLayout(
        width: 600,
        height: 400,
        x: 0,
        y: 0,
        padding: ChartPadding(
          top: 20,
          right: 20,
          bottom: 40,
          left: 60,
        ),
        responsive: true,
      ),
    ),
  ),
  data: ChartData(
    columns: [
      ChartColumn(
        name: 'month',
        type: ColumnType.string,
        displayName: 'Month',
      ),
      ChartColumn(
        name: 'revenue',
        type: ColumnType.number,
        displayName: 'Revenue',
      ),
      ChartColumn(
        name: 'cost',
        type: ColumnType.number,
        displayName: 'Cost',
      ),
    ],
    rows: [
      {'month': 'Jan', 'revenue': 45000, 'cost': 32000},
      {'month': 'Feb', 'revenue': 52000, 'cost': 35000},
      {'month': 'Mar', 'revenue': 48000, 'cost': 33000},
      {'month': 'Apr', 'revenue': 61000, 'cost': 42000},
      {'month': 'May', 'revenue': 55000, 'cost': 38000},
    ],
    metadata: ChartDataMetadata(
      rowCount: 5,
      columnCount: 3,
      generatedAt: DateTime.now(),
      source: 'api',
    ),
),
)
```

### 3. Render a 3D Chart

```dart
ChartForgeChart(
  config: ChartConfig(
    id: 'surface-3d',
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
        padding: ChartPadding(
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        ),
        responsive: true,
      ),
    ),
  ),
  data: ChartData(...),
  height: 500, // 3D charts benefit from more height
)
```

### 4. Render a Complete Dashboard

```dart
ChartForgeDashboard(
  name: 'Executive Dashboard',
  charts: [
    ChartConfig(
      id: 'chart-1',
      type: 'line',
      dimension: ChartDimension.twoD,
      bindings: ChartBindings(xAxis: 'month', yAxis: ['revenue']),
      appearance: ChartAppearance(...),
    ),
    ChartConfig(
      id: 'chart-2',
      type: 'bar',
      dimension: ChartDimension.twoD,
      bindings: ChartBindings(xAxis: 'region', yAxis: ['sales']),
      appearance: ChartAppearance(...),
    ),
    // ... more charts
  ],
  dataProvider: (String chartId) {
    // Fetch chart data from your API
    return ChartData(...);
  },
  theme: 'light',
  showHeader: true,
  showFooter: true,
)
```

## Chart Types

### 2D Charts (CustomPainter)

The following chart types are rendered natively using Flutter's CustomPainter:

- Line, Bar, Area
- Pie, Doughnut
- Scatter, Bubble
- Heatmap, Treemap, Radar
- Candlestick, OHLC, Gauge
- And more...

**Advantages**:
- ✅ Native performance
- ✅ Small bundle size
- ✅ Full control over rendering
- ✅ Works offline

### 3D Charts (WebView + Three.js)

The following chart types are rendered using Three.js in a WebView:

- Surface Plot
- 3D Scatter
- 3D Bar
- 3D Line, 3D Area
- Volume rendering
- Globe, 3D Map
- And more...

**Advantages**:
- ✅ Powerful WebGL rendering
- ✅ Advanced 3D effects
- ✅ Consistent with web SDK
- ✅ Shared WebGL runtime

## Data Loading

### From API

```dart
Future<ChartData> loadChartData(String chartId) async {
  final response = await http.get(
    Uri.parse('$apiUrl/charts/$chartId/data'),
    headers: {'Authorization': 'Bearer $token'},
  );

  final json = jsonDecode(response.body);
  return ChartData.fromJson(json['data']);
}
```

### Integration with State Management

```dart
class ChartProvider extends ChangeNotifier {
  ChartData? _chartData;

  ChartData? get chartData => _chartData;

  Future<void> loadChart(String chartId) async {
    _chartData = await loadChartData(chartId);
    notifyListeners();
  }
}

// In your widget
Consumer<ChartProvider>(
  builder: (context, provider, child) {
    return ChartForgeChart(
      config: widget.config,
      data: provider.chartData ?? _loadingPlaceholder(),
    );
  },
)
```

## Customization

### Custom Colors

```dart
ChartColors(
  palette: [
    '#3b82f6',  // Blue
    '#ef4444',  // Red
    '#10b981',  // Green
    '#f59e0b',  // Yellow
    '#8b5cf6',  // Purple
  ],
  backgroundColor: '#ffffff',
  foregroundColor: '#0f172a',
  gridColor: '#e2e8f0',
  accentColor: '#3b82f6',
  gradient: true,
)
```

### Custom Themes

```dart
// Light theme
ChartAppearance(
  theme: 'light',
  // ... other config
)

// Dark theme
ChartAppearance(
  theme: 'dark',
  // ... other config
)

// Auto (follows system)
ChartAppearance(
  theme: 'auto',
  // ... other config
)
```

## Event Handling

```dart
ChartForgeChart(
  config: config,
  data: data,
  onChartClick: (String chartId, dynamic data) {
    print('Chart clicked: $chartId');
    print('Data: $data');
    
    // Navigate to detail view
    Navigator.pushNamed(context, '/chart/$chartId');
  },
  onChartHover: (String chartId, dynamic data) {
    print('Chart hovered: $chartId');
    
    // Show tooltip
    _showTooltip(data);
  },
)
```

## Responsive Design

The SDK automatically adapts to container size:

```dart
Container(
  width: double.infinity,
  height: 400,
  child: ChartForgeChart(
    config: config,
    data: data,
  ),
)

// Or with flexible height
Expanded(
  child: ChartForgeChart(
    config: config,
    data: data,
  ),
)
```

## Platform Support

| Platform | 2D Charts | 3D Charts | Notes |
|----------|-----------|-----------|-------|
| iOS      | ✅ Native | ✅ WebView | Full support |
| Android  | ✅ Native | ✅ WebView | Full support |
| Web      | ✅ Native | ✅ WebView | Full support |
| Desktop  | ✅ Native | ✅ WebView | Full support |

## Performance Tips

1. **Use Responsive Layout**: Let charts adapt to available space
2. **Limit Data Points**: Use pagination for large datasets
3. **Avoid Rebuilds**: Use const constructors and cached data
4. **Lazy Loading**: Load charts as they come into viewport
5. **Prefer 2D**: Use 2D charts when 3D is not required

## Examples

Complete examples are available in `lib/example_app.dart`:

- Line Chart Example
- Bar Chart Example
- Pie Chart Example
- Scatter Chart Example
- 3D Surface Plot Example
- 3D Scatter Plot Example
- Complete Dashboard Example

Run the example app:

```bash
cd sdk/flutter
flutter run
```

## API Reference

### ChartForgeChart

Main widget for rendering individual charts.

**Parameters**:
- `config: ChartConfig` - Chart configuration
- `data: ChartData` - Chart data
- `width: double?` - Optional width
- `height: double?` - Optional height
- `onChartClick: Function(String, dynamic)?` - Click callback
- `onChartHover: Function(String, dynamic)?` - Hover callback

### ChartForgeDashboard

Widget for rendering complete dashboards.

**Parameters**:
- `name: String` - Dashboard name
- `charts: List<ChartConfig>` - List of chart configurations
- `dataProvider: ChartData Function(String)` - Data provider function
- `theme: String` - 'light' or 'dark'
- `showHeader: bool` - Show header bar
- `showFooter: bool` - Show footer bar

### Models

Complete model definitions in `lib/models/chart_models.dart`:

- `ChartConfig` - Chart configuration
- `ChartData` - Chart data with metadata
- `ChartAppearance` - Visual appearance settings
- `ChartLayout` - Layout and padding
- `ChartColors` - Color palette
- `ChartBindings` - Data field bindings
- And more...

## Troubleshooting

### 3D Chart Not Rendering

1. Ensure `webview_flutter` is added to `pubspec.yaml`
2. Check internet connection (Three.js loaded from CDN)
3. Verify data format matches expected schema
4. Check WebView debugging in logs

### Performance Issues

1. Reduce chart dimensions
2. Limit data points
3. Use 2D charts instead of 3D when possible
4. Profile with `flutter dev --profile`

### Build Errors

1. Run `flutter clean`
2. Run `flutter pub get`
3. Check Flutter version compatibility
4. Review Dart analyzer output

## Browser Embedding

For embedding Flutter charts in web browsers, the Flutter SDK can be compiled to WebAssembly and used alongside the JavaScript SDK.

## License

Proprietary - All rights reserved. Contact ChartForge for licensing information.

## Support

- Documentation: https://chartforge.io/docs/flutter
- GitHub Issues: https://github.com/chartforge/flutter-sdk/issues
- Email: support@chartforge.io
- Discord: https://discord.gg/chartforge

## Changelog

### 1.0.0 (2024-01-XX)
- Initial release
- 40+ chart types supported
- 2D CustomPainter rendering
- 3D WebView + Three.js rendering
- Dashboard widget
- Type-safe models
- Example application
- iOS and Android support
