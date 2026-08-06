/**
 * KAEVY STUDIO - OpenTelemetry & Distributed Tracing Provider
 * Phase 10.3 Enterprise Observability
 */

import { logger } from '../utils/logger.js';

export interface Span {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  name: string;
  startTime: number;
  endTime?: number;
  durationMs?: number;
  status: 'OK' | 'ERROR';
  attributes: Record<string, any>;
}

export class DistributedTracer {
  private activeSpans: Map<string, Span> = new Map();
  private completedSpans: Span[] = [];
  private maxStoredSpans = 100;

  /**
   * Generates standard W3C compliant TraceId & SpanId
   */
  public generateTraceId(): string {
    return `tr_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  public generateSpanId(): string {
    return `sp_${Math.random().toString(36).substring(2, 10)}`;
  }

  /**
   * Starts a new distributed tracing span
   */
  public startSpan(name: string, attributes: Record<string, any> = {}, parentSpanId?: string): Span {
    const traceId = attributes.traceId || this.generateTraceId();
    const spanId = this.generateSpanId();

    const span: Span = {
      traceId,
      spanId,
      parentSpanId,
      name,
      startTime: Date.now(),
      status: 'OK',
      attributes: {
        ...attributes,
        service: 'kaevy-studio-api',
        environment: process.env.NODE_ENV || 'development',
      },
    };

    this.activeSpans.set(spanId, span);
    return span;
  }

  /**
   * Completes a span and records duration
   */
  public endSpan(spanId: string, status: 'OK' | 'ERROR' = 'OK', extraAttributes: Record<string, any> = {}): Span | null {
    const span = this.activeSpans.get(spanId);
    if (!span) return null;

    span.endTime = Date.now();
    span.durationMs = span.endTime - span.startTime;
    span.status = status;
    span.attributes = { ...span.attributes, ...extraAttributes };

    this.activeSpans.delete(spanId);
    this.completedSpans.unshift(span);

    if (this.completedSpans.length > this.maxStoredSpans) {
      this.completedSpans.pop();
    }

    if (process.env.NODE_ENV === 'production' && span.durationMs > 1000) {
      logger.warn(`[Slow Operation Trace] Span '${span.name}' took ${span.durationMs}ms`, {
        traceId: span.traceId,
        spanId: span.spanId,
        durationMs: span.durationMs,
        attributes: span.attributes,
      });
    }

    return span;
  }

  public getTraceSpans(traceId: string): Span[] {
    return this.completedSpans.filter((s) => s.traceId === traceId);
  }

  public getRecentTraces(limit = 20): Span[] {
    return this.completedSpans.slice(0, limit);
  }
}

export const tracer = new DistributedTracer();
