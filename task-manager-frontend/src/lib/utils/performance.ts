// Performance monitoring utilities

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === "development";
  }

  startTimer(name: string): void {
    if (!this.isEnabled) return;

    this.metrics.set(name, {
      name,
      startTime: performance.now(),
    });
  }

  endTimer(name: string): number | undefined {
    if (!this.isEnabled) return undefined;

    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Timer '${name}' was not started`);
      return undefined;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;

    console.log(`⏱️ ${name}: ${metric.duration.toFixed(2)}ms`);

    this.metrics.delete(name);
    return metric.duration;
  }

  measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    if (!this.isEnabled) return fn();

    this.startTimer(name);
    return fn().finally(() => {
      this.endTimer(name);
    });
  }

  measureSync<T>(name: string, fn: () => T): T {
    if (!this.isEnabled) return fn();

    this.startTimer(name);
    const result = fn();
    this.endTimer(name);
    return result;
  }

  getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Convenience functions
export const startTimer = (name: string) => performanceMonitor.startTimer(name);
export const endTimer = (name: string) => performanceMonitor.endTimer(name);
export const measureAsync = <T>(name: string, fn: () => Promise<T>) =>
  performanceMonitor.measureAsync(name, fn);
export const measureSync = <T>(name: string, fn: () => T) =>
  performanceMonitor.measureSync(name, fn);

// React hook for measuring component render time
export const usePerformanceMeasure = (componentName: string) => {
  // Note: This hook requires React to be imported in the component
  // Usage: const { useEffect } = require('react');
  // useEffect(() => {
  //   startTimer(`${componentName} render`);
  //   return () => endTimer(`${componentName} render`);
  // }, []);
};
