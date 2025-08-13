import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting(isElementIntersecting);

        if (isElementIntersecting && triggerOnce && !hasTriggered) {
          setHasTriggered(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return {
    ref: elementRef,
    isIntersecting,
    hasTriggered,
  };
}

// Hook for performance-optimized animations
export function useLazyAnimation(options: UseIntersectionObserverOptions = {}) {
  const { ref, isIntersecting } = useIntersectionObserver({
    ...options,
    threshold: 0.1,
    rootMargin: "50px", // Start animation slightly before element comes into view
  });

  return {
    ref,
    shouldAnimate: isIntersecting,
    className: isIntersecting ? "animate-in" : "opacity-0",
  };
}

// Hook for mobile-optimized animations
export function useMobileOptimizedAnimation(
  options: UseIntersectionObserverOptions = {}
) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { ref, isIntersecting } = useIntersectionObserver(options);

  return {
    ref,
    shouldAnimate: isIntersecting && !isMobile, // Disable animations on mobile
    isMobile,
    className: isIntersecting && !isMobile ? "animate-in" : "opacity-0",
  };
}
