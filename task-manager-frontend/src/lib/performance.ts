// Performance optimization utilities

// Debounce function for expensive operations
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function for scroll/resize events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Mobile detection utility
export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 640; // sm breakpoint
}

// Touch device detection
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

// Performance monitoring utility
export function measurePerformance(name: string, fn: () => void): void {
  if (process.env.NODE_ENV === "development") {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start}ms`);
  } else {
    fn();
  }
}

// Lazy load utility for images
export function lazyLoadImage(img: HTMLImageElement, src: string): void {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = src;
          observer.unobserve(img);
        }
      });
    });
    observer.observe(img);
  } else {
    // Fallback for older browsers
    img.src = src;
  }
}

// Optimize animations based on device capability
export function shouldReduceMotion(): boolean {
  if (typeof window === "undefined") return false;

  // Check for user preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Check for low-end devices
  const isLowEndDevice =
    navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;

  // Check for mobile devices
  const isMobileDevice = isMobile();

  return prefersReducedMotion || isLowEndDevice || isMobileDevice;
}

// Batch DOM updates for better performance
export function batchDOMUpdates(updates: (() => void)[]): void {
  if (typeof window === "undefined") return;

  // Use requestAnimationFrame for smooth updates
  requestAnimationFrame(() => {
    updates.forEach((update) => update());
  });
}

// Memory cleanup utility
export function cleanupEventListeners(
  element: HTMLElement | Window | Document,
  eventType: string,
  handler: EventListener
): void {
  element.removeEventListener(eventType, handler);
}

// Optimize scroll performance
export function optimizeScroll(
  handler: () => void,
  options: { throttle?: number } = {}
): () => void {
  const { throttle: throttleMs = 16 } = options; // 60fps default

  if (throttleMs > 0) {
    return throttle(handler, throttleMs);
  }

  return handler;
}

// Optimize resize performance
export function optimizeResize(
  handler: () => void,
  options: { debounce?: number } = {}
): () => void {
  const { debounce: debounceMs = 100 } = options;

  if (debounceMs > 0) {
    return debounce(handler, debounceMs);
  }

  return handler;
}
