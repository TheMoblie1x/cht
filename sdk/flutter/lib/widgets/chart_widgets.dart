/// Unified Chart Widget for Flutter
/// 
/// Provides a single widget interface for rendering both 2D and 3D charts

import 'package:flutter/material.dart';
import '../models/chart_models.dart';
import '../renderers/chart_renderer_2d.dart';
import '../renderers/chart_renderer_3d.dart';

/// ChartForge Chart Widget
/// 
/// Main widget for rendering charts in Flutter applications
class ChartForgeChart extends StatefulWidget {
  final ChartConfig config;
  final ChartData data;
  final double? width;
  final double? height;
  final void Function(String, dynamic)? onChartClick;
  final void Function(String, dynamic)? onChartHover;

  const ChartForgeChart({
    Key? key,
    required this.config,
    required this.data,
    this.width,
    this.height,
    this.onChartClick,
    this.onChartHover,
  }) : super(key: key);

  @override
  State<ChartForgeChart> createState() => _ChartForgeChartState();
}

class _ChartForgeChartState extends State<ChartForgeChart> {
  @override
  Widget build(BuildContext context) {
    final config = widget.config;
    final is3D = config.dimension == ChartDimension.threeD;

    return GestureDetector(
      onTap: () {
        widget.onChartClick?.call(config.id, {
          'config': config.toJson(),
          'data': widget.data.toJson(),
        });
      },
      child: MouseRegion(
        onEnter: (event) {
          widget.onChartHover?.call(config.id, {
            'config': config.toJson(),
            'data': widget.data.toJson(),
            'position': event.position,
          });
        },
        child: Container(
          width: widget.width ?? double.infinity,
          height: widget.height ?? 400,
          decoration: BoxDecoration(
            color: _getBackgroundColor(config.appearance.theme),
            borderRadius: BorderRadius.circular(8),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 3,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: is3D
              ? ChartRenderer3D(
                  config: config,
                  data: widget.data,
                  width: widget.width,
                  height: widget.height,
                )
              : CustomPaint(
                  painter: ChartRenderer2D(
                    config: config,
                    data: widget.data,
                  ),
                  child: Container(),
                ),
        ),
      ),
    );
  }

  /// Get background color based on theme
  Color _getBackgroundColor(String theme) {
    switch (theme.toLowerCase()) {
      case 'dark':
        return const Color(0xFF1a1a2e);
      case 'light':
        return const Color(0xFFffffff);
      case 'auto':
        // In a real app, you'd use MediaQuery or Theme.of(context)
        return const Color(0xFFffffff);
      default:
        return const Color(0xFFffffff);
    }
  }
}

/// Dashboard Widget for Flutter
/// 
/// Renders a complete dashboard with multiple charts
class ChartForgeDashboard extends StatelessWidget {
  final String name;
  final List<ChartConfig> charts;
  final ChartData Function(String) dataProvider;
  final String theme;
  final bool showHeader;
  final bool showFooter;

  const ChartForgeDashboard({
    Key? key,
    required this.name,
    required this.charts,
    required this.dataProvider,
    this.theme = 'light',
    this.showHeader = true,
    this.showFooter = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _getBackgroundColor(theme),
      body: Column(
        children: [
          // Header
          if (showHeader)
            Container(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      name,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF0f172a),
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.refresh),
                    onPressed: () {
                      // Refresh all charts
                    },
                  ),
                  IconButton(
                    icon: const Icon(Icons.share),
                    onPressed: () {
                      // Share dashboard
                    },
                  ),
                ],
              ),
            ),
          
          // Charts grid
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: GridView.builder(
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  childAspectRatio: 1.5,
                ),
                itemCount: charts.length,
                itemBuilder: (context, index) {
                  final chart = charts[index];
                  final chartData = dataProvider(chart.id);
                  
                  if (chartData == null) {
                    return Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.grey.shade300),
                      ),
                      child: const Center(
                        child: CircularProgressIndicator(),
                      ),
                    );
                  }

                  return ChartForgeChart(
                    config: chart,
                    data: chartData,
                  );
                },
              ),
            ),
          ),
          
          // Footer
          if (showFooter)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                border: Border(top: BorderSide(color: Colors.grey.shade300)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Powered by ChartForge',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey.shade600,
                    ),
                  ),
                  Text(
                    '${charts.length} Charts',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey.shade600,
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  /// Get background color based on theme
  Color _getBackgroundColor(String theme) {
    switch (theme.toLowerCase()) {
      case 'dark':
        return const Color(0xFF1a1a2e);
      case 'light':
        return const Color(0xFFffffff);
      default:
        return const Color(0xFFffffff);
    }
  }
}
