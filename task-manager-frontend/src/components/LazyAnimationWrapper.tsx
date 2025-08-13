"use client";

import React, { ReactNode } from "react";
import {
  useLazyAnimation,
  useMobileOptimizedAnimation,
} from "@/hooks/useIntersectionObserver";

interface LazyAnimationWrapperProps {
  children: ReactNode;
  className?: string;
  animationClass?: string;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  fallback?: ReactNode;
}

export function LazyAnimationWrapper({
  children,
  className = "",
  animationClass = "animate-in fade-in slide-in-from-bottom-4",
  threshold = 0.1,
  rootMargin = "50px",
  triggerOnce = true,
  fallback = null,
}: LazyAnimationWrapperProps) {
  const { ref, shouldAnimate } = useLazyAnimation({
    threshold,
    rootMargin,
    triggerOnce,
  });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${className} ${
        shouldAnimate ? animationClass : "opacity-0"
      } transition-all duration-700`}
    >
      {shouldAnimate ? children : fallback}
    </div>
  );
}

// Mobile-optimized version that disables animations on mobile
export function MobileOptimizedAnimationWrapper({
  children,
  className = "",
  animationClass = "animate-in fade-in slide-in-from-bottom-4",
  threshold = 0.1,
  rootMargin = "50px",
  triggerOnce = true,
  fallback = null,
}: LazyAnimationWrapperProps) {
  const { ref, shouldAnimate, isMobile } = useMobileOptimizedAnimation({
    threshold,
    rootMargin,
    triggerOnce,
  });

  // Disable animations on mobile for better performance
  const shouldShowAnimation = shouldAnimate && !isMobile;

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${className} ${
        shouldShowAnimation ? animationClass : "opacity-0"
      } transition-all duration-700`}
    >
      {shouldShowAnimation ? children : fallback}
    </div>
  );
}

// Performance-optimized wrapper with reduced motion support
export function PerformanceOptimizedWrapper({
  children,
  className = "",
  animationClass = "animate-in fade-in slide-in-from-bottom-4",
  threshold = 0.1,
  rootMargin = "50px",
  triggerOnce = true,
  fallback = null,
}: LazyAnimationWrapperProps) {
  const { ref, shouldAnimate } = useLazyAnimation({
    threshold,
    rootMargin,
    triggerOnce,
  });

  // Check for user's motion preferences
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  // Disable animations if user prefers reduced motion
  const shouldShowAnimation = shouldAnimate && !prefersReducedMotion;

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${className} ${
        shouldShowAnimation ? animationClass : "opacity-0"
      } transition-all duration-700`}
    >
      {shouldShowAnimation ? children : fallback}
    </div>
  );
}

// Simple fade-in wrapper for basic animations
export function FadeInWrapper({
  children,
  className = "",
  delay = 0,
  duration = 500,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const { ref, shouldAnimate } = useLazyAnimation({
    threshold: 0.1,
    rootMargin: "20px",
  });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${className} transition-all duration-${duration} ease-out ${
        shouldAnimate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{
        transitionDelay: `${delay}ms`,
        transform: "translateZ(0)",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
