/// 3D Chart Renderer for Flutter
/// 
/// Uses WebView to render 3D charts with Three.js or shared WebGL runtime

import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import '../models/chart_models.dart';

/// 3D Chart Renderer using WebView
class ChartRenderer3D extends StatelessWidget {
  final ChartConfig config;
  final ChartData data;
  final double? width;
  final double? height;

  const ChartRenderer3D({
    Key? key,
    required this.config,
    required this.data,
    this.width,
    this.height,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width ?? double.infinity,
      height: height ?? 400,
      child: WebView(
        initialUrl: 'about:blank',
        javascriptMode: JavascriptMode.unrestricted,
        onWebViewCreated: (WebViewController webViewController) {
          _loadChart(webViewController);
        },
        debuggingEnabled: false,
      ),
    );
  }

  /// Load chart into WebView
  void _loadChart(WebViewController controller) {
    final html = _generateChartHTML();
    controller.loadHtml(html);
  }

  /// Generate HTML content for 3D chart
  String _generateChartHTML() {
    final bindings = config.bindings;
    final appearance = config.appearance;
    final colors = appearance.colors;

    // Convert chart data to JSON
    final chartDataJson = _convertDataToJson();

    return '''
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Chart</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        #chart-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        #chart-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            text-align: center;
            color: ${colors.foregroundColor ?? '#0f172a'};
        }
        #chart-canvas {
            width: 100%;
            height: calc(100% - 50px);
        }
    </style>
    <!-- Three.js CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</head>
<body>
    <div id="chart-container">
        <div id="chart-title">${appearance.title}</div>
        <div id="chart-canvas"></div>
    </div>
    <script>
        // Chart data
        const chartData = $chartDataJson;
        const chartConfig = ${_convertConfigToJson()};
        const chartType = '${config.type}';

        // Initialize Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight - 50);
        renderer.setClearColor('${colors.backgroundColor ?? '#ffffff'}');
        document.getElementById('chart-canvas').appendChild(renderer.domElement);

        // Chart rendering based on type
        if (chartType === 'surface' || chartType === 'surface3d') {
            renderSurfaceChart(scene, camera, renderer, chartData, chartConfig);
        } else if (chartType === 'scatter3d') {
            renderScatter3DChart(scene, camera, renderer, chartData, chartConfig);
        } else if (chartType === 'bar3d') {
            renderBar3DChart(scene, camera, renderer, chartData, chartConfig);
        } else if (chartType === 'line3d') {
            renderLine3DChart(scene, camera, renderer, chartData, chartConfig);
        } else if (chartType === 'volume') {
            renderVolumeChart(scene, camera, renderer, chartData, chartConfig);
        } else if (chartType === 'globe') {
            renderGlobeChart(scene, camera, renderer, chartData, chartConfig);
        } else {
            renderGeneric3DChart(scene, camera, renderer, chartData, chartConfig);
        }

        // Camera positioning
        camera.position.z = 5;
        camera.lookAt(0, 0, 0);

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();

        // Handle resize
        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight - 50;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });

        // Chart rendering functions
        function renderSurfaceChart(scene, camera, renderer, data, config) {
            // Surface plot implementation
            const xValues = data.rows.map(r => parseFloat(r.x || 0));
            const yValues = data.rows.map(r => parseFloat(r.y || 0));
            const zValues = data.rows.map(r => parseFloat(r.z || 0));

            const geometry = new THREE.BufferGeometry();
            const vertices = [];
            const indices = [];
            const colors = [];

            const palette = ${_convertPaletteToJson()};
            
            // Create surface mesh
            for (let i = 0; i < data.rows.length; i++) {
                for (let j = 0; j < data.rows.length; j++) {
                    const index = i * data.rows.length + j;
                    vertices.push(xValues[i], zValues[j], yValues[index]);
                    colors.push(palette[index % palette.length]);
                }
            }

            // Add indices for triangles
            for (let i = 0; i < data.rows.length - 1; i++) {
                for (let j = 0; j < data.rows.length - 1; j++) {
                    const a = i * data.rows.length + j;
                    const b = a + 1;
                    const c = a + data.rows.length;
                    const d = c + 1;
                    indices.push(a, b, d, a, d, c);
                }
            }

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            geometry.setIndex(indices);

            const material = new THREE.MeshPhongMaterial({
                vertexColors: true,
                side: THREE.DoubleSide,
                shininess: 100,
            });

            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(1, 1, 1);
            scene.add(directionalLight);
        }

        function renderScatter3DChart(scene, camera, renderer, data, config) {
            // 3D scatter plot implementation
            const palette = ${_convertPaletteToJson()};
            
            data.rows.forEach((row, index) => {
                const geometry = new THREE.SphereGeometry(0.1, 32, 32);
                const material = new THREE.MeshPhongMaterial({
                    color: palette[index % palette.length],
                    shininess: 100,
                });
                const sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(
                    parseFloat(row.x || 0),
                    parseFloat(row.y || 0),
                    parseFloat(row.z || 0)
                );
                scene.add(sphere);
            });

            // Grid helper
            const gridHelper = new THREE.GridHelper(10, 10);
            scene.add(gridHelper);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(5, 10, 7);
            scene.add(directionalLight);
        }

        function renderBar3DChart(scene, camera, renderer, data, config) {
            // 3D bar chart implementation
            const palette = ${_convertPaletteToJson()};
            
            data.rows.forEach((row, index) => {
                const height = parseFloat(row.y || 1);
                const geometry = new THREE.BoxGeometry(0.3, height, 0.3);
                const material = new THREE.MeshPhongMaterial({
                    color: palette[index % palette.length],
                    shininess: 100,
                });
                const bar = new THREE.Mesh(geometry, material);
                bar.position.set(
                    parseFloat(row.x || 0),
                    height / 2,
                    parseFloat(row.z || 0)
                );
                scene.add(bar);
            });

            // Base plane
            const planeGeometry = new THREE.PlaneGeometry(10, 10);
            const planeMaterial = new THREE.MeshPhongMaterial({
                color: 0xcccccc,
                side: THREE.DoubleSide,
            });
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.rotation.x = -Math.PI / 2;
            plane.position.y = -0.01;
            scene.add(plane);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(5, 10, 7);
            scene.add(directionalLight);
        }

        function renderGeneric3DChart(scene, camera, renderer, data, config) {
            // Generic 3D chart placeholder
            const geometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
            const material = new THREE.MeshPhongMaterial({
                color: '${colors.palette[0]}',
                shininess: 100,
            });
            const torus = new THREE.Mesh(geometry, material);
            scene.add(torus);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(5, 5, 5);
            scene.add(directionalLight);
        }

        function renderGlobeChart(scene, camera, renderer, data, config) {
            // Globe implementation
            const geometry = new THREE.SphereGeometry(2, 64, 64);
            const material = new THREE.MeshPhongMaterial({
                color: '${colors.palette[0]}',
                shininess: 100,
                wireframe: false,
            });
            const globe = new THREE.Mesh(geometry, material);
            scene.add(globe);

            // Data points on globe
            data.rows.forEach((row) => {
                const lat = parseFloat(row.lat || 0) * (Math.PI / 180);
                const lon = -parseFloat(row.lon || 0) * (Math.PI / 180);
                const radius = 2 + (parseFloat(row.value || 0) / 100);

                const pointGeometry = new THREE.SphereGeometry(0.05, 16, 16);
                const pointMaterial = new THREE.MeshBasicMaterial({
                    color: '${colors.palette[1]}',
                });
                const point = new THREE.Mesh(pointGeometry, pointMaterial);
                point.position.setFromSphericalCoords(radius, lat, lon);
                scene.add(point);
            });

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(5, 5, 5);
            scene.add(directionalLight);
        }
    </script>
</body>
</html>
    ''';
  }

  /// Convert chart data to JSON string
  String _convertDataToJson() {
    final dataMap = {
      'rows': data.rows,
      'columns': data.columns.map((c) => c.toJson()).toList(),
      'metadata': data.metadata.toJson(),
    };
    return _escapeJson(dataMap);
  }

  /// Convert config to JSON string
  String _convertConfigToJson() {
    final configMap = {
      'type': config.type,
      'dimension': config.dimension.name,
      'bindings': config.bindings.toJson(),
      'appearance': config.appearance.toJson(),
    };
    return _escapeJson(configMap);
  }

  /// Convert palette to JSON string
  String _convertPaletteToJson() {
    return _escapeJson(config.appearance.colors.palette);
  }

  /// Escape JSON for JavaScript
  String _escapeJson(dynamic data) {
    return data.toString().replaceAll("'", "\\'");
  }
}
