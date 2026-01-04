/// ChartForge Flutter Models
/// 
/// Core data models for ChartForge chart rendering in Flutter
/// These models mirror the TypeScript type definitions from the main SDK

/// Chart dimension (2D or 3D)
enum ChartDimension {
  twoD,
  threeD,
}

/// Supported 2D chart types
enum ChartType2D {
  line,
  bar,
  pie,
  area,
  scatter,
  bubble,
  heatmap,
  treemap,
  candlestick,
  ohlc,
  radar,
  polarArea,
  doughnut,
  gauge,
  funnel,
  sankey,
  chord,
  streamgraph,
  histogram,
  boxplot,
  violin,
  waterfall,
  bullet,
  sunburst,
  icicle,
  partition,
  parallel,
  wordcloud,
}

/// Supported 3D chart types
enum ChartType3D {
  surface,
  scatter3D,
  bar3D,
  line3D,
  area3D,
  volume,
  globe,
  map3D,
  tube,
  ribbon,
  cone,
  pyramid,
  scatterBubble3D,
  cone3D,
  cylinder,
}

/// Column data type
enum ColumnType {
  string,
  number,
  boolean,
  date,
  datetime,
  timestamp,
  array,
  object,
}

/// Chart color palette
class ChartColors {
  final List<String> palette;
  final String? backgroundColor;
  final String? foregroundColor;
  final String? gridColor;
  final String? accentColor;
  final bool gradient;

  ChartColors({
    required this.palette,
    this.backgroundColor,
    this.foregroundColor,
    this.gridColor,
    this.accentColor,
    this.gradient = false,
  });

  Map<String, dynamic> toJson() {
    return {
      'palette': palette,
      'background': backgroundColor,
      'foreground': foregroundColor,
      'grid': gridColor,
      'accent': accentColor,
      'gradient': gradient,
    };
  }

  factory ChartColors.fromJson(Map<String, dynamic> json) {
    return ChartColors(
      palette: List<String>.from(json['palette'] ?? []),
      backgroundColor: json['background'] as String?,
      foregroundColor: json['foreground'] as String?,
      gridColor: json['grid'] as String?,
      accentColor: json['accent'] as String?,
      gradient: json['gradient'] as bool? ?? false,
    );
  }
}

/// Chart padding configuration
class ChartPadding {
  final double top;
  final double right;
  final double bottom;
  final double left;

  ChartPadding({
    required this.top,
    required this.right,
    required this.bottom,
    required this.left,
  });

  Map<String, dynamic> toJson() {
    return {
      'top': top,
      'right': right,
      'bottom': bottom,
      'left': left,
    };
  }
}

/// Chart layout configuration
class ChartLayout {
  final double width;
  final double height;
  final double x;
  final double y;
  final ChartPadding padding;
  final bool responsive;
  final double? aspectRatio;

  ChartLayout({
    required this.width,
    required this.height,
    required this.x,
    required this.y,
    required this.padding,
    this.responsive = true,
    this.aspectRatio,
  });

  Map<String, dynamic> toJson() {
    return {
      'width': width,
      'height': height,
      'x': x,
      'y': y,
      'padding': padding.toJson(),
      'responsive': responsive,
      'aspectRatio': aspectRatio,
    };
  }
}

/// Chart appearance configuration
class ChartAppearance {
  final String title;
  final String? description;
  final String theme; // 'light', 'dark', 'auto'
  final ChartColors colors;
  final ChartLayout layout;

  ChartAppearance({
    required this.title,
    this.description,
    required this.theme,
    required this.colors,
    required this.layout,
  });

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'description': description,
      'theme': theme,
      'colors': colors.toJson(),
      'layout': layout.toJson(),
    };
  }
}

/// Chart data binding configuration
class ChartBindings {
  final String? xAxis;
  final List<String>? yAxis;
  final String? zAxis;
  final String? color;
  final String? size;
  final String? label;
  final List<String>? series;

  ChartBindings({
    this.xAxis,
    this.yAxis,
    this.zAxis,
    this.color,
    this.size,
    this.label,
    this.series,
  });

  Map<String, dynamic> toJson() {
    return {
      'xAxis': xAxis,
      'yAxis': yAxis,
      'zAxis': zAxis,
      'color': color,
      'size': size,
      'label': label,
      'series': series,
    };
  }
}

/// Chart column definition
class ChartColumn {
  final String name;
  final ColumnType type;
  final String? displayName;
  final String? format;
  final bool? nullable;

  ChartColumn({
    required this.name,
    required this.type,
    this.displayName,
    this.format,
    this.nullable,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'type': type.name,
      'displayName': displayName,
      'format': format,
      'nullable': nullable,
    };
  }

  factory ChartColumn.fromJson(Map<String, dynamic> json) {
    return ChartColumn(
      name: json['name'] as String,
      type: ColumnType.values.firstWhere(
        (e) => e.name == json['type'],
        orElse: () => ColumnType.string,
      ),
      displayName: json['displayName'] as String?,
      format: json['format'] as String?,
      nullable: json['nullable'] as bool?,
    );
  }
}

/// Chart metadata
class ChartDataMetadata {
  final int rowCount;
  final int columnCount;
  final DateTime generatedAt;
  final String source;
  final String? cacheKey;

  ChartDataMetadata({
    required this.rowCount,
    required this.columnCount,
    required this.generatedAt,
    required this.source,
    this.cacheKey,
  });

  Map<String, dynamic> toJson() {
    return {
      'rowCount': rowCount,
      'columnCount': columnCount,
      'generatedAt': generatedAt.toIso8601String(),
      'source': source,
      'cacheKey': cacheKey,
    };
  }
}

/// Chart data
class ChartData {
  final List<ChartColumn> columns;
  final List<Map<String, dynamic>> rows;
  final ChartDataMetadata metadata;

  ChartData({
    required this.columns,
    required this.rows,
    required this.metadata,
  });

  Map<String, dynamic> toJson() {
    return {
      'columns': columns.map((c) => c.toJson()).toList(),
      'rows': rows,
      'metadata': metadata.toJson(),
    };
  }

  factory ChartData.fromJson(Map<String, dynamic> json) {
    return ChartData(
      columns: (json['columns'] as List)
          .map((c) => ChartColumn.fromJson(c as Map<String, dynamic>))
          .toList(),
      rows: List<Map<String, dynamic>>.from(json['rows'] ?? []),
      metadata: ChartDataMetadata(
        rowCount: json['metadata']['rowCount'] as int,
        columnCount: json['metadata']['columnCount'] as int,
        generatedAt: DateTime.parse(json['metadata']['generatedAt'] as String),
        source: json['metadata']['source'] as String,
        cacheKey: json['metadata']['cacheKey'] as String?,
      ),
    );
  }
}

/// Chart configuration
class ChartConfig {
  final String id;
  final String type; // Union of ChartType2D and ChartType3D
  final ChartDimension dimension;
  final ChartBindings bindings;
  final ChartAppearance appearance;

  ChartConfig({
    required this.id,
    required this.type,
    required this.dimension,
    required this.bindings,
    required this.appearance,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'dimension': dimension.name,
      'bindings': bindings.toJson(),
      'appearance': appearance.toJson(),
    };
  }

  factory ChartConfig.fromJson(Map<String, dynamic> json) {
    return ChartConfig(
      id: json['id'] as String,
      type: json['type'] as String,
      dimension: ChartDimension.values.firstWhere(
        (e) => e.name == json['dimension'],
        orElse: () => ChartDimension.twoD,
      ),
      bindings: ChartBindings.fromJson(json['bindings'] as Map<String, dynamic>),
      appearance: ChartAppearance.fromJson(json['appearance'] as Map<String, dynamic>),
    );
  }
}
