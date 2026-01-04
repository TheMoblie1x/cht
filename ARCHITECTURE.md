# ChartForge - Enterprise Analytics SaaS Architecture

## Executive Summary

ChartForge is a developer-first, enterprise-grade analytics platform that enables teams to build, collaborate on, and embed interactive dashboards with 40+ chart types. The system prioritizes security, scalability, and extensibility while maintaining a clean abstraction layer that works across web, mobile, and embedded contexts.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ChartForge System Overview                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          Frontend Layer (Next.js 15)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Dashboard   │  │  Property    │  │  SQL Query   │  │ Collaboration│   │
│  │   Editor     │  │    Panel     │  │   Builder    │  │   Manager    │   │
│  │  (WYSIWYG)   │  │ (No-Code)    │  │  (No-Code)   │  │  (Presence)  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│           │                 │                 │                 │          │
│  ┌────────▼─────────────────▼─────────────────▼─────────────────▼────────┐ │
│  │                    Chart Rendering Engine                            │ │
│  │  ┌─────────────────┐              ┌─────────────────┐                  │ │
│  │  │   2D Canvas     │              │   3D Three.js   │                  │ │
│  │  │   25+ Types     │              │   15+ Types     │                  │ │
│  │  └─────────────────┘              └─────────────────┘                  │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                    Analytics Engine (Client)                           │ │
│  │    Filtering | Grouping | Aggregation | Time-series                   │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ WebSocket / HTTP
                                   │
┌──────────────────────────────────┼────────────────────────────────────────┐
│                    Next.js API Routes Layer                               │
├──────────────────────────────────┼────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │    Auth      │  │  Dashboards  │  │  Data Source │  │ Collaboration│   │
│  │  Middleware  │  │     API      │  │     API      │  │     API      │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                      │
│  │    RBAC      │  │   Analytics  │  │   Audit Log  │                      │
│  │  Middleware  │  │     API      │  │     API      │                      │
│  └──────────────┘  └──────────────┘  └──────────────┘                      │
└──────────────────────────────────┼────────────────────────────────────────┘
                                   │
                                   │ Direct Database Access
                                   │
┌──────────────────────────────────┼────────────────────────────────────────┐
│                    Data Layer (Prisma + SQLite)                            │
├──────────────────────────────────┼────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Workspaces  │  │    Teams     │  │    Users     │  │  Dashboards  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Data Sources │  │ API Keys     │  │   Tokens     │  │   Audit Logs │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    Mini Services (Independent Processes)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │         Collaboration Service (Port 3003) - Socket.io                  │ │
│  │         Presence, Cursors, Live Updates, Conflict Resolution          │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    External Data Sources                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  REST    │  │ GraphQL │  │  gRPC    │  │   SQL    │  │Streaming │    │
│  │  APIs    │  │   APIs   │  │   (Web)  │  │ (Proxy)  │  │ (WS/Kafka)│    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    SDKs & Runtime                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────┐           ┌─────────────────────────────┐ │
│  │   JavaScript/Web SDK         │           │   Flutter Runtime           │ │
│  │   - Chart Rendering          │           │   - 2D: CustomPainter       │ │
│  │   - Dashboard Embedding      │           │   - 3D: WebView             │ │
│  │   - Same JSON Schema         │           │   - Shared JSON Schema      │ │
│  └─────────────────────────────┘           └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Core Design Principles

1. **Unified Schema**: All charts and dashboards use a single JSON schema that works everywhere
2. **Type Safety**: Full TypeScript coverage from database to UI
3. **Security First**: Secrets never exposed to browser, RBAC enforced everywhere
4. **Extensibility**: Plugin architecture for data sources, chart types, and analytics functions
5. **Real-time by Default**: Collaboration and streaming data as core features
6. **Developer Experience**: No-code interfaces that generate production code
7. **Enterprise Ready**: Audit logging, version control, multi-tenancy, SSO ready

## Tradeoffs and Decisions

### Framework Choice
- **Decision**: Next.js 15 + TypeScript
- **Rationale**: Mature ecosystem, excellent DX, built-in API routes, SSR/SSG support, strong community
- **Tradeoff**: More boilerplate than some alternatives, but justified by enterprise requirements

### Database Choice
- **Decision**: SQLite with Prisma ORM for current implementation
- **Rationale**: Zero-config, embedded, ACID compliant, excellent for single-tenant deployment
- **Tradeoff**: Can be upgraded to PostgreSQL/MySQL for multi-tenant without schema changes
- **Upgrade Path**: Prisma makes database migration straightforward

### Real-time Collaboration
- **Decision**: Socket.io on separate port (3003)
- **Rationale**: Mature, fallback support, room management built-in
- **Tradeoff**: WebSocket connection management overhead
- **Future**: Upgradeable to CRDT/Yjs for offline support

### Chart Rendering
- **Decision**: Canvas API for 2D, Three.js for 3D
- **Rationale**: Performance, ecosystem support, WebGL acceleration
- **Tradeoff**: Steeper learning curve than SVG-based alternatives
- **Justification**: Enterprise datasets demand performance

### Security Model
- **Decision**: OAuth2 + API Keys + Bearer Tokens, server-side secrets
- **Rationale**: Enterprise SSO integration, standard patterns, auditability
- **Tradeoff**: More complex authentication flow
- **Justification**: Security is non-negotiable for enterprise

### SQL Generation
- **Decision**: Server-side SQL generation from no-code builder
- **Rationale**: Prevents SQL injection, validates queries before execution, enables query optimization
- **Tradeoff**: More server load
- **Justification**: Security and performance worth the overhead

## Module Dependencies

```
frontend/
├── components/
│   ├── dashboard/          # Depends on: analytics-engine, chart-renderer
│   ├── chart/              # Depends on: chart-renderer, data-sources
│   ├── property-panel/     # Depends on: data-sources, analytics-engine
│   └── collaboration/      # Depends on: websocket-client
├── lib/
│   ├── analytics/          # Depends on: core-types
│   ├── data-sources/       # Depends on: core-types
│   ├── chart-renderer/     # Depends on: core-types
│   └── collaboration/      # Depends on: core-types, websocket-client
└── hooks/                  # Depends on: all libs

backend/
├── modules/
│   ├── auth/               # Depends on: database, rbac
│   ├── dashboards/         # Depends on: database, rbac, analytics
│   ├── data-sources/       # Depends on: database, rbac
│   ├── analytics/          # Depends on: data-sources
│   └── collaboration/      # Depends on: database, rbac
└── middleware/
    └── rbac/               # Depends on: database

mini-services/
└── collaboration/          # Depends on: shared-types

sdk/
├── js/                    # Depends on: core-types, chart-renderer
└── flutter/               # Depends on: core-types
```

## Scaling Considerations

### Horizontal Scaling
- Stateless API routes can be scaled horizontally
- Collaboration service requires sticky sessions or Redis adapter
- Database can be upgraded to PostgreSQL with connection pooling

### Performance Optimization
- Chart rendering: Web Workers for heavy computations
- Data fetching: TanStack Query caching + deduplication
- Analytics: Server-side preprocessing for large datasets
- Collaboration: Operational transformation / CRDT for conflict resolution

### Multi-tenancy
- Workspace-based isolation at database level
- Row-level security via RBAC
- Tenant-aware caching keys
- Separate databases per tenant for isolation (optional)

## Security Architecture

### Authentication Flow
```
Client → OAuth2 Provider → Backend (JWT) → Browser
Client → API Key → Backend (Validate) → Browser
Client → Session → Backend (Session Store) → Browser
```

### Authorization Flow
```
Request → Auth Middleware → RBAC Middleware → Route Handler
                      ↓
               Check Workspace Access
                      ↓
               Check Team Role
                      ↓
               Check Resource Permission
                      ↓
               Execute or Deny
```

### Data Security
- Secrets encrypted at rest (env vars, secret manager)
- Secrets never sent to client
- All data source credentials stored encrypted
- API keys rotatable with grace period
- Audit logging for all data access

## Monitoring & Observability

### Metrics to Track
- Dashboard load times
- Chart render performance
- Data fetch latency
- WebSocket connection health
- API error rates
- User engagement metrics

### Logging Strategy
- Structured JSON logs
- Request/response correlation IDs
- Error stack traces (sanitized)
- Audit logs for sensitive operations
- Performance logs for optimization

## Deployment Architecture

### Production Stack
```
[CDN] → [Load Balancer] → [Next.js App Nodes (xN)]
                              ↓
                    [SQLite DB (Primary)]
                              ↓
                    [Backup/Replica]

[CDN] → [Load Balancer] → [Collaboration Service Nodes (xN)]
                              ↓
                    [Redis (Optional, for scaling)]
```

### Infrastructure Requirements
- **Minimum**: 2 vCPU, 4GB RAM per Next.js instance
- **Recommended**: 4 vCPU, 8GB RAM per Next.js instance
- **Collaboration Service**: 1 vCPU, 2GB RAM per instance
- **Database**: Depends on dataset size, SQLite can handle GBs

### Environment Variables
```
DATABASE_URL=              # SQLite path
NEXTAUTH_SECRET=           # Session encryption
NEXTAUTH_URL=              # App URL
OAUTH_CLIENT_ID=           # OAuth2 client
OAUTH_CLIENT_SECRET=       # OAuth2 secret
ENCRYPTION_KEY=            # For secret encryption
COLLABORATION_PORT=        # Default: 3003
NODE_ENV=                  # production
```

## Future Roadmap

### Phase 2 (6 months)
- CRDT-based offline collaboration
- Advanced analytics (ML predictions, anomaly detection)
- Custom chart type plugins
- Mobile app (React Native + native chart rendering)

### Phase 3 (12 months)
- White-label deployments
- Enterprise SSO (SAML, LDAP)
- Advanced RBAC (attribute-based)
- Multi-region deployment
- Kafka integration for streaming data

### Phase 4 (18+ months)
- Edge computing deployment
- GraphQL API layer
- Plugin marketplace
- Advanced embedded analytics
- AI-powered chart recommendations
