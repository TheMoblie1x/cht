/// 2D Chart Renderer for Flutter
/// 
/// Implements CustomPainter for rendering 2D charts using Flutter's Canvas API

import 'package:flutter/material.dart';
import 'package:flutter/painting.dart';
import '../models/chart_models.dart';

/// 2D Chart Renderer using CustomPainter
class ChartRenderer2D extends CustomPainter {
  final ChartConfig config;
  final ChartData data;

  ChartRenderer2D({
    required this.config,
    required this.data,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final bindings = config.bindings;
    final appearance = config.appearance;
    final layout = appearance.layout;
    final colors = appearance.colors;

    // Get canvas dimensions
    final width = size.width;
    final height = size.height;
    final padding = layout.padding;

    final chartWidth = width - padding.left - padding.right;
    final chartHeight = height - padding.top - padding.bottom;

    // Clear canvas
    final backgroundPaint = Paint()
      ..color = _parseColor(colors.backgroundColor ?? '#ffffff')
      ..style = PaintingStyle.fill;
    canvas.drawRect(
      Rect.fromLTWH(0, 0, width, height),
      backgroundPaint,
    );

    // Draw title
    if (appearance.title.isNotEmpty) {
      final titlePainter = TextPainter(
        text: TextSpan(
          text: appearance.title,
          style: TextStyle(
            color: _parseColor(colors.foregroundColor ?? '#000000'),
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        textDirection: TextDirection.ltr,
      )..layout();
      
      titlePainter.paint(
        canvas,
        Offset(width / 2 - titlePainter.width / 2, padding.top),
      );
    }

    // Render based on chart type
    switch (config.type) {
      case 'line':
        _renderLineChart(canvas, chartWidth, chartHeight, padding, bindings, colors);
        break;
      case 'bar':
        _renderBarChart(canvas, chartWidth, chartHeight, padding, bindings, colors);
        break;
      case 'pie':
      case 'doughnut':
        _renderPieChart(canvas, chartWidth, chartHeight, padding, bindings, colors, config.type == 'doughnut');
        break;
      default:
        _renderPlaceholder(canvas, chartWidth, chartHeight, config.type);
    }
  }

  /// Render line chart
  void _renderLineChart(
    Canvas canvas,
    double chartWidth,
    double chartHeight,
    ChartPadding padding,
    ChartBindings bindings,
    ChartColors colors,
  ) {
    final xField = bindings.xAxis ?? 'x';
    final yFields = bindings.yAxis ?? ['y'];

    // Extract data
    final xValues = data.rows.map((row) => row[xField]).toList();
    final ySeries = yFields.map((field) => 
      data.rows.map((row) => row[field] as double? ?? 0.0).toList()
    ).toList();

    // Find max value for scaling
    final allValues = ySeries.expand((e) => e).toList();
    final maxValue = allValues.reduce((a, b) => a > b ? a : b) * 1.2;

    final originX = padding.left;
    final originY = padding.top + chartHeight;

    // Draw grid
    final gridPaint = Paint()
      ..color = _parseColor(colors.gridColor ?? '#e2e8f0')
      ..strokeWidth = 1;

    for (int i = 0; i <= 5; i++) {
      final y = padding.top + (chartHeight / 5) * i;
      canvas.drawLine(
        Offset(originX, y),
        Offset(originX + chartWidth, y),
        gridPaint,
      );
    }

    // Draw axes
    final axisPaint = Paint()
      ..color = const Color(0xFF64748b)
      ..strokeWidth = 2;

    canvas.drawLine(
      Offset(originX, padding.top),
      Offset(originX, originY),
      axisPaint,
    );
    canvas.drawLine(
      Offset(originX, originY),
      Offset(originX + chartWidth, originY),
      axisPaint,
    );

    // Draw each series
    for (int seriesIndex = 0; seriesIndex < ySeries.length; seriesIndex++) {
      final values = ySeries[seriesIndex];
      final color = _parseColor(colors.palette[seriesIndex % colors.palette.length]);
      final linePaint = Paint()
        ..color = color
        ..strokeWidth = 2
        ..style = PaintingStyle.stroke;

      final path = Path();
      final stepX = chartWidth / (values.length - 1);

      for (int i = 0; i < values.length; i++) {
        final x = originX + stepX * i;
        final y = originY - (values[i] / maxValue) * chartHeight;

        if (i == 0) {
          path.moveTo(x, y);
        } else {
          path.lineTo(x, y);
        }
      }

      canvas.drawPath(path, linePaint);

      // Draw points
      final pointPaint = Paint()
        ..color = color
        ..style = PaintingStyle.fill;

      for (int i = 0; i < values.length; i++) {
        final x = originX + stepX * i;
        final y = originY - (values[i] / maxValue) * chartHeight;

        canvas.drawCircle(Offset(x, y), 4, pointPaint);
      }
    }
  }

  /// Render bar chart
  void _renderBarChart(
    Canvas canvas,
    double chartWidth,
    double chartHeight,
    ChartPadding padding,
    ChartBindings bindings,
    ChartColors colors,
  ) {
    final xField = bindings.xAxis ?? 'x';
    final yFields = bindings.yAxis ?? ['y'];

    final xValues = data.rows.map((row) => row[xField]).toList();
    final ySeries = yFields.map((field) => 
      data.rows.map((row) => row[field] as double? ?? 0.0).toList()
    ).toList();

    final allValues = ySeries.expand((e) => e).toList();
    final maxValue = allValues.reduce((a, b) => a > b ? a : b) * 1.2;

    final originX = padding.left;
    final originY = padding.top + chartHeight;

    final barWidth = chartWidth / (data.rows.length * ySeries.length + data.rows.length);

    for (int seriesIndex = 0; seriesIndex < ySeries.length; seriesIndex++) {
      final values = ySeries[seriesIndex];
      final color = _parseColor(colors.palette[seriesIndex % colors.palette.length]);
      final barPaint = Paint()
        ..color = color
        ..style = PaintingStyle.fill;

      for (int i = 0; i < values.length; i++) {
        final x = originX + barWidth * (i * ySeries.length + seriesIndex + i);
        final barHeight = (values[i] / maxValue) * chartHeight;
        final y = originY - barHeight;

        canvas.drawRect(
          Rect.fromLTWH(x, y, barWidth, barHeight),
          barPaint,
        );
      }
    }
  }

  /// Render pie chart
  void _renderPieChart(
    Canvas canvas,
    double chartWidth,
    double chartHeight,
    ChartPadding padding,
    ChartBindings bindings,
    ChartColors colors,
    bool isDoughnut,
  ) {
    final yField = bindings.yAxis?.isNotEmpty == true ? bindings.yAxis![0] : 'y';
    final values = data.rows.map((row) => row[yField] as double? ?? 0.0).toList();
    final total = values.reduce((a, b) => a + b);

    final centerX = padding.left + chartWidth / 2;
    final centerY = padding.top + chartHeight / 2;
    final radius = (chartWidth < chartHeight ? chartWidth : chartHeight) / 2 - 20;

    double startAngle = -pi / 2;

    for (int i = 0; i < values.length; i++) {
      final sliceAngle = (values[i] / total) * 2 * pi;
      final color = _parseColor(colors.palette[i % colors.palette.length]);

      final slicePaint = Paint()
        ..color = color
        ..style = PaintingStyle.fill;

      canvas.drawArc(
        Rect.fromCircle(center: Offset(centerX, centerY), radius: radius),
        startAngle,
        sliceAngle,
        true,
        slicePaint,
      );

      startAngle += sliceAngle;
    }

    // Draw center hole for doughnut
    if (isDoughnut) {
      final holePaint = Paint()
        ..color = colors.backgroundColor != null 
            ? _parseColor(colors.backgroundColor!)
            : const Color(0xFFFFFFFF)
        ..style = PaintingStyle.fill;

      canvas.drawCircle(
        Offset(centerX, centerY),
        radius * 0.5,
        holePaint,
      );
    }
  }

  /// Render placeholder for unsupported chart types
  void _renderPlaceholder(Canvas canvas, double width, double height, String type) {
    final painter = TextPainter(
      text: TextSpan(
        text: '${type.toUpperCase()} Chart\n(3D rendering via WebView)',
        style: const TextStyle(
          color: Color(0xFF64748b),
          fontSize: 14,
        ),
        textAlign: TextAlign.center,
      ),
      textDirection: TextDirection.ltr,
    )..layout();

    painter.paint(
      canvas,
      Offset(width / 2 - painter.width / 2, height / 2 - painter.height / 2),
    );
  }

  /// Parse hex color string to Color
  Color _parseColor(String hexColor) {
    final hex = hexColor.replaceAll('#', '');
    if (hex.length == 6) {
      return Color(
        int.parse('0xFF$hex'),
      );
    } else if (hex.length == 8) {
      return Color(
        int.parse(hex),
      );
    }
    return Colors.black;
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
