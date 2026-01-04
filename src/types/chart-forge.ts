/**
 * ChartForge Core Types
 * 
 * This file defines the core type system used across the entire ChartForge platform.
 * All charts, dashboards, data sources, and analytics operations use these types.
 */

// ============================================================================
// CHART TYPES
// ============================================================================

export type ChartDimension = '2d' | '3d';

export type ChartType2D =
  | 'line'
  | 'bar'
  | 'pie'
  | 'area'
  | 'scatter'
  | 'bubble'
  | 'heatmap'
  | 'treemap'
  | 'candlestick'
  | 'ohlc'
  | 'radar'
  | 'polarArea'
  | 'doughnut'
  | 'gauge'
  | 'funnel'
  | 'sankey'
  | 'chord'
  | 'streamgraph'
  | 'histogram'
  | 'boxplot'
  | 'violin'
  | 'waterfall'
  | 'bullet'
  | 'sunburst'
  | 'icicle'
  | 'partition'
  | 'parallel'
  | 'wordcloud';

export type ChartType3D =
  | 'surface'
  | 'scatter3d'
  | 'bar3d'
  | 'line3d'
  | 'area3d'
  | 'volume'
  | 'globe'
  | 'map3d'
  | 'tube'
  | 'ribbon'
  | 'cone'
  | 'pyramid'
  | 'scatterBubble3d'
  | 'cone3d'
  | 'cylinder';

export type ChartType = ChartType2D | ChartType3D;

export interface ChartConfig {
  id: string;
  bindings: ChartBindings;
  appearance: ChartAppearance;
  interactions: ChartInteractions;
  meta?: ChartMeta;
}

export interface ChartBindings {
  xAxis?: string;
  yAxis?: string | string[];
  zAxis?: string;
  color?: string;
  size?: string;
  label?: string;
  series?: string[];
  filters?: Filter[];
}

export interface ChartAppearance {
  title: string;
  description?: string;
  theme: 'light' | 'dark' | 'auto';
  colors: ChartColors;
  layout: ChartLayout;
  axes?: ChartAxes;
  legend?: ChartLegend;
  tooltip?: ChartTooltip;
  animation?: ChartAnimation;
  customCSS?: string;
}

export interface ChartColors {
  palette: string[];
  background?: string;
  foreground?: string;
  grid?: string;
  accent?: string;
  gradient?: boolean;
}

export interface ChartLayout {
  width: number;
  height: number;
  x: number;
  y: number;
  padding: ChartPadding;
  responsive: boolean;
  aspectRatio?: number;
}

export interface ChartPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ChartAxes {
  x?: ChartAxis;
  y?: ChartAxis;
  z?: ChartAxis;
}

export interface ChartAxis {
  title?: string;
  type: 'linear' | 'log' | 'datetime' | 'category';
  format?: string;
  showGrid: boolean;
  position: 'left' | 'right' | 'top' | 'bottom' | 'back' | 'front';
  domain?: [number, number];
}

export interface ChartLegend {
  show: boolean;
  position: 'top' | 'right' | 'bottom' | 'left' | 'floating';
  align: 'start' | 'center' | 'end';
  verticalAlign?: 'top' | 'middle' | 'bottom';
}

export interface ChartTooltip {
  show: boolean;
  format?: string;
  fields?: string[];
  mode?: 'single' | 'multiple';
}

export interface ChartAnimation {
  enabled: boolean;
  duration: number;
  easing: string;
  version?: number;
}

export interface ChartInteractions {
  draggable: boolean;
  resizable: boolean;
  zoomable: boolean;
  pan: boolean;
  crosshair: boolean;
  selection: boolean;
  drillDown?: DrillDownConfig;
  linkedCharts?: string[];
}

export interface DrillDownConfig {
  enabled: boolean;
  targetChartId?: string;
  filterField: string;
}

export interface ChartMeta {
  tags?: string[];
  category?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChartData {
  columns: ChartColumn[];
  rows: any[];
  metadata: ChartDataMetadata;
}

export interface ChartColumn {
  name: string;
  type: ColumnType;
  displayName?: string;
  format?: string;
  nullable?: boolean;
}

export type ColumnType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'timestamp'
  | 'array'
  | 'object';

export interface ChartDataMetadata {
  rowCount: number;
  columnCount: number;
  generatedAt: string;
  source: string;
  cacheKey?: string;
}

// ============================================================================
// ANALYTICS ENGINE
// ============================================================================

export interface AnalyticsRule {
  id: string;
  type: AnalyticsRuleType;
  config: AnalyticsConfig;
}

export type AnalyticsRuleType =
  | 'filter'
  | 'group'
  | 'aggregate'
  | 'definitions'
  | 'limit'
  | 'join'
  | 'calculate'
  | 'movingAverage'
  | 'cumulativeSum'
  | 'percentile'
  | 'ranking'
  | 'timeBucket'
  | 'pivot';

export interface AnalyticsConfig {
  filters?: Filter[];
  groups?: Group[];
  aggregations?: Aggregation[];
  sorts?: Sort[];
  limit?: number;
  offset?: number;
  joins?: Join[];
  calculations?: Calculation[];
  timeBucket?: TimeBucketConfig;
  pivot?: PivotConfig;
}

export interface Filter {
  field: string;
  operator: FilterOperator;
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export type FilterOperator =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'nin'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'regex'
  | 'isNull'
  | 'isNotNull'
  | 'between'
  | 'before'
  | 'after';

export interface Group {
  field: string;
  alias?: string;
  timeBucket?: TimeBucketConfig;
}

export interface Aggregation {
  field?: string;
  function: AggregationFunction;
  alias?: string;
  distinct?: boolean;
}

export type AggregationFunction =
  | 'sum'
  | 'avg'
  | 'min'
  | 'max'
  | 'count'
  | 'countDistinct'
  | 'stddev'
  | 'variance'
  | 'median'
  | 'mode'
  | 'first'
  | 'last';

export interface Sort {
  field: string;
  direction: 'asc' | 'desc';
  nulls?: 'first' | 'last';
}

export interface Join {
  type: 'inner' | 'left' | 'right' | 'full';
  dataSource: string;
  on: JoinCondition[];
  alias?: string;
}

export interface JoinCondition {
  leftField: string;
  rightField: string;
  operator?: FilterOperator;
}

export interface Calculation {
  expression: string;
  alias: string;
  dependencies?: string[];
}

export interface TimeBucketConfig {
  field: string;
  interval: TimeBucketInterval;
  timezone?: string;
  alias?: string;
}

export type TimeBucketInterval =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'work'
  | 'month'
  | 'quarter'
  | 'year'
  | 'isoWeek'
  | 'isoYear';

export interface PivotConfig {
  rows: string[];
  columns: string[];
  values: PivotValue[];
  aggregator?: AggregationFunction;
}

export interface PivotValue {
  field: string;
  aggregation: AggregationFunction;
  alias?: string;
}

// ============================================================================
// DATA SOURCES
// ============================================================================

export type DataSourceType =
  | 'rest'
  | 'graphql'
  | 'grpc'
  | 'soap'
  | 'sql'
  | 'streaming';

export type SQLDatabaseType = 'postgres' | 'mysql' | 'snowflake' | 'bigquery' | 'sqlite';

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  workspaceId: string;
  config: DataSourceConfig;
  auth?: DataSourceAuth;
  health?: DataSourceHealth;
  createdAt: string;
  updatedAt: string;
  lastTestedAt?: string;
}

export interface DataSourceConfig {
  rest?: RestDataSourceConfig;
  graphql?: GraphQLDataSourceConfig;
  grpc?: GrpcDataSourceConfig;
  soap?: SoapDataSourceConfig;
  sql?: SQLDataSourceConfig;
  streaming?: StreamingDataSourceConfig;
}

export interface RestDataSourceConfig {
  baseURL: string;
  endpoints: RestEndpoint[];
  defaultHeaders?: Record<string, string>;
  timeout?: number;
  retryPolicy?: RetryPolicy;
  cacheConfig?: CacheConfig;
}

export interface RestEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  description?: string;
  parameters?: ParameterConfig[];
  headers?: Record<string, string>;
  bodySchema?: any;
  responseSchema?: any;
}

export interface GraphQLDataSourceConfig {
  endpoint: string;
  schema?: string;
  operations: GraphQLOperation[];
  defaultHeaders?: Record<string, string>;
  timeout?: number;
  subscriptionSupport?: boolean;
}

export interface GraphQLOperation {
  id: string;
  name: string;
  type: 'query' | 'mutation' | 'subscription';
  query: string;
  variables?: Record<string, any>;
  description?: string;
}

export interface GrpcDataSourceConfig {
  protoFiles: string[];
  serverAddress: string;
  types: GrpcService[];
  tls?: boolean;
  metadata?: Record<string, string>;
}

export interface GrpcService {
  id: string;
  name: string;
  packageName: string;
  methods: GrpcMethod[];
}

export interface GrpcMethod {
  id: string;
  name: string;
  inputType: string;
  outputType: string;
  streamingType: 'unary' | 'client_streaming' | 'server_streaming' | 'bidirectional';
  description?: string;
}

export interface SoapDataSourceConfig {
  wsdl: string;
  endpoint: string;
  operations: SoapOperation[];
  soapVersion: '1.1' | '1.2';
}

export interface SoapOperation {
  id: string;
  name: string;
  action?: string;
  inputSchema?: any;
  outputSchema?: any;
  description?: string;
}

export interface SQLDataSourceConfig {
  databaseType: SQLDatabaseType;
  host: string;
  port?: number;
  database: string;
  schema?: string;
  connectionPoolSize?: number;
  readOnly?: boolean;
  maxRows?: number;
  queryTimeout?: number;
}

export interface StreamingDataSourceConfig {
  type: 'websocket' | 'kafka';
  endpoint?: string;
  topics?: string[];
  channels?: string[];
  messageFormat: 'json' | 'avro' | 'protobuf' | 'csv';
  schema?: string;
  bufferSize?: number;
}

export interface DataSourceAuth {
  type: AuthType;
  config: AuthConfig;
}

export type AuthType =
  | 'none'
  | 'oauth2'
  | 'apiKey'
  | 'bearer'
  | 'basic'
  | 'custom';

export interface AuthConfig {
  oauth2?: OAuth2Config;
  apiKey?: APIKeyConfig;
  bearer?: BearerTokenConfig;
  basic?: BasicAuthConfig;
  custom?: CustomAuthConfig;
}

export interface OAuth2Config {
  clientId: string;
  clientSecret: string;
  tokenUrl: string;
  authUrl?: string;
  scopes?: string[];
  grantType: 'authorization_code' | 'client_credentials' | 'refresh_token';
}

export interface APIKeyConfig {
  key: string;
  usage: 'header' | 'query';
  name: string;
  prefix?: string;
}

export interface BearerTokenConfig {
  token: string;
  refreshUrl?: string;
}

export interface BasicAuthConfig {
  username: string;
  password: string;
}

export interface CustomAuthConfig {
  headers?: Record<string, string>;
  parameters?: Record<string, string>;
  script?: string;
}

export interface RetryPolicy {
  maxRetries: number;
  retryDelay: number;
  retryCondition?: string;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number;
  strategy: 'memory' | 'redis' | 'database';
}

export interface DataSourceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: string;
  checkResponseTime?: number;
  error?: string;
}

export interface ParameterConfig {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  defaultValue?: any;
  description?: string;
}

// ============================================================================
// DASHBOARDS
// ============================================================================

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  charts: ChartConfig[];
  layout: DashboardLayout;
  settings: DashboardSettings;
  version: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface DashboardLayout {
  type: 'grid' | 'free' | 'tabs';
  grid?: GridLayoutConfig;
  tabs?: TabLayoutConfig;
}

export interface GridLayoutConfig {
  columns: number;
  rowHeight: number;
  margin: [number, number];
  breakpoints: Breakpoints;
}

export interface Breakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface TabLayoutConfig {
  tabs: TabConfig[];
}

export interface TabConfig {
  id: string;
  label: string;
  charts: string[];
}

export interface DashboardSettings {
  theme: 'light' | 'dark' | 'auto';
  refreshInterval?: number;
  autoRefresh?: boolean;
  showHeader: boolean;
  showFooter: boolean;
  fullscreenEnabled: boolean;
  exportEnabled: boolean;
  shareSettings?: ShareSettings;
}

export interface ShareSettings {
  public: boolean;
  mode?: 'view' | 'edit';
  passwordProtected?: boolean;
  expiresAt?: string;
  allowedDomains?: string[];
  embedCode?: string;
}

// ============================================================================
// WORKSPACE & RBAC
// ============================================================================

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  settings: WorkspaceSettings;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceSettings {
  maxDashboards?: number;
  maxDataSources?: number;
  storageQuota?: number;
  teamsPerWorkspace?: number;
  auditLogging?: boolean;
  retentionPeriod?: number;
}

export interface Team {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  permissions?: TeamPermissions;
  createdAt: string;
  updatedAt: string;
}

export interface TeamPermissions {
  canCreateDashboards: boolean;
  canCreateDataSources: boolean;
  canManageUsers: boolean;
  canManageSettings: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  teamId?: string;
  role: WorkspaceRole;
  invitedBy: string;
  invitedAt: string;
  acceptedAt?: string;
}

export type WorkspaceRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface Permission {
  resource: ResourceType;
  action: PermissionAction;
  scope: PermissionScope;
}

export type ResourceType =
  | 'dashboard'
  | 'chart'
  | 'dataSource'
  | 'workspace'
  | 'team'
  | 'user'
  | 'auditLog';

export type PermissionAction =
  | 'create'
  | 'read'
  | 'compile'
  | 'delete'
  | 'share'
  | 'utility'
  | 'manage';

export type PermissionScope = 'all' | 'own' | 'team' | 'workspace' | 'none';

export interface RolePermissions {
  [key in WorkspaceRole]: Permission[];
}

export const ROLE_PERMISSIONS: RolePermissions = {
  owner: [
    { resource: '*', action: '*', scope: 'all' } as any,
  ],
  admin: [
    { resource: 'dashboard', action: 'create', scope: 'workspace' },
    { resource: 'dashboard', action: 'read', scope: 'workspace' },
    { resource: 'dashboard', action: 'update', scope: 'workspace' },
    { resource: 'dashboard', action: 'delete', scope: 'workspace' },
    { resource: 'dashboard', action: 'share', scope: 'workspace' },
    { resource: 'dataSource', action: 'create', scope: 'workspace' },
    { resource: 'dataSource', action: 'read', scope: 'workspace' },
    { resource: 'dataSource', action: 'update', scope: 'workspace' },
    { resource: 'dataSource', action: 'delete', scope: 'workspace' },
    { resource: 'team', action: 'create', scope: 'workspace' },
    { resource: 'team', action: 'read', scope: 'workspace' },
    { resource: 'team', action: 'update', scope: 'workspace' },
    { resource: 'team', action: 'delete', scope: 'workspace' },
    { resource: 'user', action: 'read', scope: 'workspace' },
    { resource: 'user', action: 'manage', scope: 'workspace' },
  ],
  editor: [
    { resource: 'dashboard', action: 'create', scope: 'workspace' },
    { resource: 'dashboard', action: 'read', scope: 'workspace' },
    { resource: 'dashboard', action: 'update', scope: 'workspace' },
    { resource: 'dataSource', action: 'read', scope: 'workspace' },
    { resource: 'chart', action: 'create', scope: 'workspace' },
    { resource: 'chart', action: 'read', scope: 'workspace' },
    { resource: 'chart', action: 'update', scope: 'workspace' },
    { resource: 'chart', action: 'delete', scope: 'workspace' },
  ],
  viewer: [
    { resource: 'dashboard', action: 'read', scope: 'workspace' },
    { resource: 'chart', action: 'read', scope: 'workspace' },
    { resource: 'dataSource', action: 'read', scope: 'workspace' },
  ],
};

// ============================================================================
// COLLABORATION
// ============================================================================

export interface CollaborationEvent {
  type: CollaborationEventType;
  userId: string;
  userName: string;
  timestamp: string;
  dashboardId: string;
  data: any;
}

export type CollaborationEventType =
  | 'cursor_move'
  | 'chart_add'
  | 'chart_update'
  | 'chart_delete'
  | 'chart_move'
  | 'chart_resize'
  | 'selection_change'
  | 'property_change'
  | 'user_join'
  | 'user_leave'
  | 'chat_message';

export interface CursorPosition {
  userId: string;
  userName: string;
  x: number;
  y: number;
  chartId?: string;
  color: string;
}

export interface Presence {
  userId: string;
  userName: string;
  avatar?: string;
  currentDashboardId: string;
  currentChartId?: string;
  cursor?: CursorPosition;
  status: 'active' | 'idle' | 'away';
  lastSeen: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  dashboardId: string;
  mentions?: string[];
}

export interface ConflictResolution {
  strategy: 'LWW' | 'CRDT' | 'manual';
  timestamp: number;
  resolvedBy?: string;
  resolution?: any;
}

// ============================================================================
// AUDIT LOGGING
// ============================================================================

export interface AuditLog {
  id: string;
  workspaceId: string;
  userId: string;
  action: string;
  resourceType: ResourceType;
  resourceId: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

// ============================================================================
// API REQUESTS/RESPONSES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ApiMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  requestId?: string;
}

export interface ApiMetadata {
  requestId: string;
  timestamp: string;
  pagination?: PaginationMetadata;
  rateLimit?: RateLimitMetadata;
}

export interface PaginationMetadata {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface RateLimitMetadata {
  limit: number;
  remaining: number;
  reset: string;
}

// ============================================================================
// SQL QUERY BUILDER
// ============================================================================

export interface SQLQuery {
  select: SelectClause;
  from: FromClause;
  joins?: Join[];
  where?: Filter[];
  groupBy?: Group[];
  having?: Filter[];
  orderBy?: Sort[];
  page?: number;
  offset?: number;
}

export interface SelectClause {
  columns: ColumnSelection[];
  distinct?: boolean;
}

export type ColumnSelection =
  | { type: 'column'; name: string; alias?: string; table?: string }
  | { type: 'aggregation'; function: AggregationFunction; field: string; alias?: string }
  | { type: 'calculation'; expression: string; alias: string };

export interface FromClause {
  table: string;
  alias?: string;
}

export interface QueryPreviewRequest {
  dataSourceId: string;
  query: SQLQuery;
  limit?: number;
}

export interface QueryPreviewResponse {
  columns: ChartColumn[];
  rows: Record<string, any>[];
  rowCount: number;
  executionTime: number;
  sql?: string;
  warnings?: string[];
}

// ============================================================================
// CHART RUNTIME & RENDERING
// ============================================================================

export interface ChartRendererProps {
  config: ChartConfig;
  data: ChartData;
  width?: number;
  height?: number;
  onChartClick?: (data: any) => void;
  onChartHover?: (data: any) => void;
  theme?: 'light' | 'dark';
  locale?: string;
}

export interface ChartRef {
  getChartImage: (format: 'png' | 'jpeg' | 'svg', quality?: number) => Promise<Blob | string>;
  exportData: (format: 'csv' | 'json' | 'excel') => Promise<Blob | string>;
  refresh: () => Promise<void>;
  destroy: () => void;
}

export interface ChartEvent {
  type: 'click' | 'hover' | 'select' | 'zoom' | 'pan';
  data: any;
  timestamp: number;
}

// ============================================================================
// SDK TYPES
// ============================================================================

export interface ChartForgeSDK {
  initialize: (config: SDKConfig) => Promise<void>;
  renderChart: (container: HTMLElement, config: ChartConfig, data: ChartData) => ChartRef;
  renderDashboard: (container: HTMLElement, dashboard: Dashboard) => Promise<DashboardRef>;
  loadDashboard: (id: string) => Promise<Dashboard>;
  updateDashboard: (id: string, updates: Partial<Dashboard>) => Promise<Dashboard>;
  destroy: () => void;
}

export interface SDKConfig {
  apiURL: string;
  apiKey?: string;
  authProvider?: AuthProvider;
  theme?: 'light' | 'dark';
  locale?: string;
  debug?: boolean;
}

export interface DashboardRef {
  addChart: (chart: ChartConfig, data?: ChartData) => Promise<string>;
  updateChart: (id: string, updates: Partial<ChartConfig>) => Promise<void>;
  removeChart: (id: string) => Promise<void>;
  getChart: (id: string) => ChartRef | null;
  export: (format: 'png' | 'pdf') => Promise<Blob | string>;
  refresh: () => Promise<void>;
  destroy: () => void;
}

export interface AuthProvider {
  getToken: () => Promise<string>;
  refreshToken: () => Promise<string>;
  logout: () => Promise<void>;
}

// ============================================================================
// FLUTTER TYPES
// ============================================================================

export interface FlutterChartConfig {
  id: string;
  type: ChartType;
  dimension: ChartDimension;
  title: string;
  theme: 'light' | 'dark';
  data: ChartData;
  appearance: ChartAppearance;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Awaitable<T> = T | Promise<T>;

export type EventCallback<T> = (data: T) => void | Promise<void>;
