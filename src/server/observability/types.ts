/**
 * KAEVY STUDIO - Observability & Performance Metrics DTOs
 * Phase 10.3 Enterprise Observability
 */

export interface ApplicationHealthDTO {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  environment: string;
  uptimeSeconds: number;
  timestamp: string;
}

export interface RuntimeMetricsDTO {
  cpuUsagePercent: number;
  memoryRssMb: number;
  memoryHeapTotalMb: number;
  memoryHeapUsedMb: number;
  eventLoopDelayMs: number;
  uptimeSeconds: number;
  nodeVersion: string;
  processPid: number;
}

export interface DatabaseMetricsDTO {
  activeConnections: number;
  idleConnections: number;
  waitingClients: number;
  queryCountTotal: number;
  averageQueryDurationMs: number;
  slowQueryCount: number; // > 500ms
  reconnectCount: number;
  status: 'healthy' | 'unhealthy';
}

export interface RedisMetricsDTO {
  connected: boolean;
  mode: 'redis-cluster' | 'in-memory-fallback' | string;
  cacheHits: number;
  cacheMisses: number;
  hitRatioPercent: number;
  latencyMs: number;
  reconnectCount: number;
  memoryUsageMb: number;
}

export interface SocketMetricsDTO {
  connectedClients: number;
  activeRoomsCount: number;
  eventsPerSecond: number;
  messagesTotal: number;
  disconnectReasons: Record<string, number>;
  avgLatencyMs: number;
}

export interface RequestMetricsDTO {
  totalRequests: number;
  requestsPerMinute: number;
  averageResponseTimeMs: number;
  statusCodes: {
    '2xx': number;
    '3xx': number;
    '4xx': number;
    '5xx': number;
  };
  errorRatePercent: number;
  topEndpoints: Array<{ endpoint: string; count: number; avgTimeMs: number }>;
}

export interface ErrorSummaryDTO {
  totalErrors: number;
  code401Count: number;
  code403Count: number;
  code404Count: number;
  code429Count: number;
  code500Count: number;
  unhandledExceptionsCount: number;
  unhandledRejectionsCount: number;
  recentErrors: Array<{
    timestamp: string;
    path: string;
    statusCode: number;
    message: string;
    requestId?: string;
  }>;
}

export interface ObservabilityDashboardDTO {
  health: ApplicationHealthDTO;
  runtime: RuntimeMetricsDTO;
  database: DatabaseMetricsDTO;
  redis: RedisMetricsDTO;
  socket: SocketMetricsDTO;
  requests: RequestMetricsDTO;
  errors: ErrorSummaryDTO;
  queue?: any;
  timestamp: string;
}
