# ChartForge - Enterprise Analytics SaaS System Documentation

## Overview

ChartForge is a developer-first, enterprise-grade analytics platform that enables teams to build, collaborate on, and embed interactive dashboards with 40+ chart types. This document provides a complete overview of the system architecture, implementation details, and usage guidelines.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Core Technologies](#core-technologies)
3. [Project Structure](#project-structure)
4. [Key Features](#key-features)
5. [Type System](#type-system)
6. [Analytics Engine](#analytics-engine)
7. [Data Source System](#data-source-system)
8. [Chart Rendering](#chart-rendering)
9. [Authentication & RBAC](#authentication--rbac)
10. [Real-time Collaboration](#real-time-collaboration)
11. [API Routes](#api-routes)
12. [SDK Integration](#sdk-integration)
13. [Security Considerations](#security-considerations)
14. [Deployment Guide](#deployment-guide)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                         │
│                  (Next.js 15 + React)                      │
├─────────────────────────────────────────────────────────────┤
│  • Dashboard Editor (WYSIWYG)                              │
│  • Property Panel (No-Code Configuration)                   │
│  • Chart Library (40+ Chart Types)                          │
│  • SQL Query Builder (No-Code)                              │
│  • Collaboration Manager (WebSocket)                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    API Routes Layer                         │
│                  (Next.js API Routes)                       │
├─────────────────────────────────────────────────────────────┤
│  • Authentication Middleware                              │
│  • RBAC Middleware                                         │
│  • Dashboard API                                           │
│  • Data Source API                                         │
│  • Analytics API                                           │
│  • Collaboration API                                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                             │
│                 (Prisma + SQLite)                          │
├─────────────────────────────────────────────────────────────┤
│  • Workspaces                                              │
│  • Teams                                                   │
│  • Users                                                   │
│  • Dashboards                                              │
│  • Data Sources                                            │
│  • Audit Logs                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Mini Services (Independent)                     │
├─────────────────────────────────────────────────────────────┤
│  • Collaboration Service (Port 3003) - Socket.io            │
└─────────────────────────────────────────────────────────────┘
```

### Component Interactions

```
User → Dashboard Editor → Chart Config → Analytics Engine → Data
                                    ↓
                              Chart Renderer → Canvas/WebGL
                                    ↓
                              Property Panel (No-Code)
                                    ↓
                              Backend API → Database
```

---

## Core Technologies

### Frontend Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **State Management**: Zustand for client state
- **Data Fetching**: TanStack Query
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend Stack
- **Framework**: Next.js API Routes (server-side)
- **ORM**: Prisma
- **Database**: SQLite (upgradable to PostgreSQL/MySQL)
- **Real-time**: Socket.io
- **Authentication**: NextAuth.js v4

### Chart Rendering
- **2D Charts**: HTML5 Canvas API
- **3D Charts**: Three.js / WebGL
- **Data Visualization**: Custom rendering engine

---

## Project Structure

```
/home/z/my-project/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Main dashboard page
│   │   ├── layout.tsx                  # Root layout
│   │   ├── api/                        # API routes
│   │   └── globals.css                 # Global styles
│   ├── components/
│   │   ├── ui/                         # shadcn/ui components
│   │   └── chart-forge/                # ChartForge specific components
│   │       ├── dashboard-editor.tsx    # Main WYSIWYG editor
│   │       ├── dashboard-canvas.tsx    # Canvas area
│   │       ├── chart-renderer.tsx      # Chart rendering engine
│   │       ├── chart-library.tsx       # Chart type library
│   │       ├── property-panel.tsx      # Property configuration panel
│   │       ├── data-source-panel.tsx   # Data source manager
│   │       └── collaboration-panel.tsx # Real-time collaboration
│   ├── lib/
│   │   ├── analytics/                 # Analytics engine
│   │   ├── data-sources/              # Data source connectors
│   │   ├── rbac/                      # Role-based access control
│   │   └── db.ts                      # Database client
│   ├── types/
│   │   └── chart-forge.ts             # Core type definitions
│   └── hooks/                         # React hooks
├── prisma/
│   └── schema.prisma                  # Database schema
├── mini-services/                     # Independent services
│   └── collaboration/                 # WebSocket service
├── sdk/                              # SDK for external use
│   ├── js/                           # JavaScript/Web SDK
│   └── flutter/                       # Flutter renderer
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── ARCHITECTURE.md                   # Detailed architecture doc
```

---

## Key Features

### 1. WYSIWYG Dashboard Editor

**Location**: `src/components/chart-forge/dashboard-editor.tsx`

**Features**:
- Drag-and-drop chart positioning
- Real-time chart preview
- Property panel for no-code configuration
- Live/edit mode toggle
- Save and share functionality
- Multi-user collaboration support

**Usage**:
```tsx
import DashboardEditor from '@/components/chart-forge/dashboard-editor';

export default function DashboardPage() {
  return <DashboardEditor />;
}
```

### 2. Chart Rendering Engine

**Location**: `src/components/chart-forge/chart-renderer.tsx`

**Supported Chart Types** (40+ total):

**2D Charts (25+)**:
- Basic: Line, Bar, Area, Pie, Doughnut
- Advanced: Scatter, Bubble, Heatmap, Treemap, Radar
- Financial: Candlestick, OHLC, Gauge
- Hierarchical: Sunburst, Icicle, Treemap, Partition
- Special: Funnel, Sankey, Chord, Streamgraph, Wordcloud

**3D Charts (15+)**:
- Surface, Scatter3D, Bar3D, Line3D, Area3D
- Volume, Globe, Map3D, Tube, Ribbon, Cone, Pyramid

**Rendering Approach**:
- 2D: HTML5 Canvas API for performance
- 3D: Three.js for WebGL acceleration
- Unified JSON schema for all chart types

### 3. Analytics Engine

**Location**: `src/lib/analytics/analytics-engine.ts`

**Capabilities**:
- **Filtering**: Complex filter expressions with logical operators
- **Grouping**: Multi-level data grouping
- **Aggregation**: Sum, avg, min, max, count, stddev, median, mode
- **Sorting**: Multi-field sorting with null handling
- **Time Operations**: Moving averages, cumulative sums, time bucketing
- **Pivot**: Transform rows into columns
- **Calculations**: Computed fields from expressions

**Example Usage**:
```typescript
import { AnalyticsEngine } from '@/lib/analytics/analytics-engine';
import { AnalyticsRule } from '@/types/chart-forge';

const rules: AnalyticsRule[] = [
  {
    id: '1',
    type: 'filter',
    config: {
      filters: [
        { field: 'date', operator: 'after', value: '2024-01-01' },
        { field: 'status', operator: 'eq', value: 'active' },
      ],
    },
  },
  {
    id: '2',
    type: 'aggregate',
    config: {
      aggregations: [
        { field: 'revenue', function: 'sum', alias: 'total_revenue' },
        { field: 'orders', function: 'count', alias: 'order_count' },
      ],
    },
  },
];

const processedData = AnalyticsEngine.processData(rawData, rules);
```

### 4. Data Source System

**Supported Data Sources**:
- **REST APIs**: HTTP/HTTPS endpoints with authentication
- **GraphQL**: Query, mutation, subscription support
- **gRPC**: gRPC-Web support
- **SOAP**: SOAP 1.1/1.2
- **SQL Databases**: PostgreSQL, MySQL, Snowflake, BigQuery, SQLite
- **Streaming**: WebSocket, Kafka-ready abstraction

**Authentication Methods**:
- OAuth 2.0 (authorization code, client credentials)
- API Keys (header or query)
- Bearer Tokens
- Basic Auth
- Custom authentication

**Example Configuration**:
```typescript
const dataSource: DataSource = {
  id: '1',
  name: 'Production Database',
  type: 'sql',
  workspaceId: 'workspace-1',
  config: {
    sql: {
      databaseType: 'postgres',
      host: 'db.example.com',
      port: 5432,
      database: 'analytics',
    },
  },
  auth: {
    type: 'basic',
    config: {
      basic: {
        username: 'analytics_user',
        password: 'secure_password',
      },
    },
  },
};
```

### 5. No-Code SQL Query Builder

**Features**:
- Visual table and column selection
- Drag-and-drop filter builder
- Grouping and aggregation UI
- SQL generated server-side
- Query result preview
- Auto-complete for schemas

### 6. Real-time Collaboration

**Location**: `mini-services/collaboration/`

**Features**:
- Multi-user dashboard editing
- Cursor presence indicators
- Live updates via WebSocket
- Chat functionality
- Conflict resolution (LWW - Last Write Wins, upgradeable to CRDT)

**Events**:
- cursor_move, chart_add, chart_update, chart_delete
- chart_move, chart_resize, selection_change, property_change
- user_join, user_leave, chat_message

---

## Type System

The entire system is built on a comprehensive TypeScript type system defined in `src/types/chart-forge.ts`.

### Core Types

**Chart Configuration**:
```typescript
interface ChartConfig {
  id: string;
  bindings: ChartBindings;      // Data field bindings
  appearance: ChartAppearance;  // Visual configuration
  interactions: ChartInteractions; // User interactions
  meta?: ChartMeta;
}
```

**Dashboard**:
```typescript
interface Dashboard {
  id: string;
  name: string;
  workspaceId: string;
  charts: ChartConfig[];
  layout: DashboardLayout;
  settings: DashboardSettings;
  version: number;
  // ... timestamps, etc.
}
```

**Data Sources**:
```typescript
interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  workspaceId: string;
  config: DataSourceConfig;  // Type-specific config
  auth?: DataSourceAuth;
  health?: DataSourceHealth;
}
```

### Analytics Types

**Analytics Rule**:
```typescript
interface AnalyticsRule {
  id: string;
  type: AnalyticsRuleType;
  config: AnalyticsConfig;
}

type AnalyticsRuleType =
  | 'filter'
  | 'group'
  | 'aggregate'
  | 'sort'
  | 'limit'
  | 'calculate'
  | 'movingAverage'
  | 'cumulativeSum'
  | 'pivot';
```

### RBAC Types

**Roles and Permissions**:
```typescript
type WorkspaceRole = 'owner' | 'admin' | 'editor' | 'viewer';

interface Permission {
  resource: ResourceType;
  action: PermissionAction;
  scope: PermissionScope;
}
```

---

## Authentication & RBAC

### Authentication Flow

1. **OAuth 2.0 Integration**:
   - User clicks "Sign in with OAuth"
   - Redirect to OAuth provider
   - Receive callback with authorization code
   - Exchange for access token
   - Create session in database

2. **API Key Authentication**:
   - Client includes `X-API-Key` header
   - Server validates key against database
   - Load associated user/workspace

3. **Bearer Token**:
   - JWT or opaque token in `Authorization` header
   - Server validates token
   - Extract user claims

### Role-Based Access Control

**Permissions Matrix**:

| Role    | Dashboard | DataSource | Team | User | Settings |
|---------|-----------|------------|------|------|----------|
| Owner   | CRUD*     | CRUD*      | CRUD | CRUD | CRUD*    |
| Admin   | CRUD      | CRUD       | CRUD | Read | Read     |
| Editor  | CRU       | Read       | -    | -    | -        |
| Viewer  | Read      | Read       | -    | -    | -        |

* = Full permissions including delete and share

### Implementation

```typescript
// Middleware function
export async function requirePermission(
  req: NextRequest,
  resource: ResourceType,
  action: PermissionAction
) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const hasPermission = await checkUserPermission(
    session.user.id,
    session.workspaceId,
    resource,
    action
  );

  if (!hasPermission) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
```

---

## API Routes

### Dashboard API

```
GET  /api/dashboards           # List dashboards
POST /api/dashboards           # Create dashboard
GET  /api/dashboards/:id       # Get dashboard
PUT  /api/dashboards/:id       # Update dashboard
DELETE /api/dashboards/:id     # Delete dashboard
```

### Data Source API

```
GET  /api/data-sources         # List data sources
POST /api/data-sources         # Create data source
GET  /api/data-sources/:id     # Get data source
PUT  /api/data-sources/:id     # Update data source
DELETE /api/data-sources/:id   # Delete data source
POST /api/data-sources/:id/test # Test connection
```

### Analytics API

```
POST /api/analytics/process     # Process data with analytics rules
POST /api/analytics/sql/preview # Preview SQL query results
```

### Collaboration API

Real-time collaboration via WebSocket:
```
WS /?XTransformPort=3003
```

---

## SDK Integration

### JavaScript/Web SDK

**Installation**:
```bash
npm install @chartforge/sdk
```

**Usage**:
```typescript
import { ChartForgeSDK } from '@chartforge/sdk';

const sdk = new ChartForgeSDK({
  apiURL: 'https://api.chartforge.io',
  apiKey: 'your-api-key',
});

// Initialize
await sdk.initialize();

// Render a chart
const container = document.getElementById('chart-container');
const chart = sdk.renderChart(container, chartConfig, chartData);

// Render a dashboard
const dashboard = await sdk.renderDashboard(
  document.getElementById('dashboard-container'),
  dashboardConfig
);

// Update dashboard
await dashboard.updateChart('chart-id', { appearance: { title: 'New Title' } });
```

### Flutter Renderer

**2D Charts (CustomPainter)**:
```dart
class LineChartPainter extends CustomPainter {
  final ChartData data;
  final ChartAppearance appearance;

  @override
  void paint(Canvas canvas, Size size) {
    // Custom 2D rendering logic
    final paint = Paint()
      ..color = Color(appearance.colors.palette[0])
      ..strokeWidth = 2;

    // Draw line chart
    final path = Path();
    // ... rendering implementation
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
```

**3D Charts (WebView)**:
```dart
WebViewWidget(
  controller: WebViewController()
    ..setJavaScriptMode(JavaScriptMode.unrestricted)
    ..loadHtmlString(chart3DHtml(chartConfig, chartData)),
)
```

---

## Security Considerations

### Authentication Security
- **Secrets Management**: Never expose secrets to the client
- **Token Storage**: Store tokens securely (HttpOnly cookies)
- **Token Rotation**: Support for refresh tokens
- **Session Expiration**: Automatic session timeout

### Data Security
- **Encryption at Rest**: Database encryption for sensitive fields
- **Encryption in Transit**: TLS 1.2+ for all connections
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy headers

### RBAC Security
- **Principle of Least Privilege**: Users only get necessary permissions
- **Audit Logging**: Log all permission checks and sensitive operations
- **Workspace Isolation**: Complete data separation between workspaces

### API Security
- **Rate Limiting**: Prevent abuse with rate limiting
- **CORS**: Configure CORS policies appropriately
- **Input Validation**: Validate all user inputs
- **Output Sanitization**: Sanitize all outputs

---

## Deployment Guide

### Prerequisites
- Node.js 18+
- Bun (package manager)
- SQLite or PostgreSQL database
- Redis (optional, for scaling collaboration)

### Development Setup

```bash
# Install dependencies
bun install

# Setup database
bun run db:push

# Start development server
bun run dev
```

### Production Build

```bash
# Build the application
bun run build

# Start production server
bun run start
```

### Environment Variables

```env
# Database
DATABASE_URL="file:./db/production.db"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"
OAUTH_CLIENT_ID="your-client-id"
OAUTH_CLIENT_SECRET="your-client-secret"

# Encryption
ENCRYPTION_KEY="your-32-byte-encryption-key"

# Collaboration
COLLABORATION_PORT=3003

# Application
NODE_ENV=production
```

### Infrastructure Recommendations

**Minimum Production Setup**:
- **App Server**: 2 vCPU, 4GB RAM
- **Database**: SQLite for single-tenant, PostgreSQL for multi-tenant
- **Load Balancer**: Nginx or cloud load balancer
- **SSL Certificate**: Let's Encrypt or managed certificate

**Scaling Considerations**:
- **Horizontal Scaling**: Stateless API routes can be scaled horizontally
- **Database**: Use connection pooling (PgBouncer for PostgreSQL)
- **Collaboration**: Add Redis for Socket.io scaling
- **CDN**: Serve static assets via CDN

---

## Summary

ChartForge provides a complete, enterprise-grade analytics platform with:

1. **40+ Chart Types**: 2D Canvas + 3D Three.js rendering
2. **No-Code Interface**: WYSIWYG editor with property panel
3. **Advanced Analytics**: Filtering, grouping, aggregation, time-series
4. **Universal Data Sources**: REST, GraphQL, gRPC, SQL, Streaming
5. **Enterprise Security**: OAuth2, RBAC, audit logging
6. **Real-time Collaboration**: Multi-user editing with conflict resolution
7. **Developer-First**: JSON schema-driven, extensible architecture
8. **SDK Support**: JavaScript/Web and Flutter runtimes
9. **Production-Ready**: Scalable, secure, maintainable

The system is designed to be extended with additional chart types, data sources, and analytics functions while maintaining a clean, type-safe API across all components.
