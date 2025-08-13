"use client";

import React from "react";
import {
  LazyAnimationWrapper,
  MobileOptimizedAnimationWrapper,
  PerformanceOptimizedWrapper,
  FadeInWrapper,
} from "./LazyAnimationWrapper";
import {
  debounce,
  throttle,
  isMobile,
  measurePerformance,
} from "@/lib/performance";

export function PerformanceDemo() {
  // Test debounce function
  const handleDebouncedClick = debounce(() => {
    console.log("Debounced click executed after 300ms delay");
  }, 300);

  // Test throttle function
  const handleThrottledScroll = throttle(() => {
    console.log("Throttled scroll executed (max once per 100ms)");
  }, 100);

  // Test performance measurement
  const handlePerformanceTest = () => {
    measurePerformance("Demo Operation", () => {
      // Simulate expensive operation
      let sum = 0;
      for (let i = 0; i < 1000000; i++) {
        sum += i;
      }
      console.log("Sum:", sum);
    });
  };

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold text-center mb-8">
        Performance Optimization Demo
      </h2>

      {/* Test buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={handleDebouncedClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Debounce (300ms)
        </button>

        <button
          onClick={handleThrottledScroll}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Throttle (100ms)
        </button>

        <button
          onClick={handlePerformanceTest}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Test Performance
        </button>

        <div className="px-4 py-2 bg-gray-500 text-white rounded">
          Mobile: {isMobile() ? "Yes" : "No"}
        </div>
      </div>

      {/* Lazy Animation Demo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <LazyAnimationWrapper
          className="p-6 bg-blue-100 rounded-lg border"
          animationClass="animate-in fade-in slide-in-from-left-4"
        >
          <h3 className="text-lg font-semibold mb-2">Lazy Animation</h3>
          <p>
            This content animates when it comes into view using Intersection
            Observer.
          </p>
        </LazyAnimationWrapper>

        <MobileOptimizedAnimationWrapper
          className="p-6 bg-green-100 rounded-lg border"
          animationClass="animate-in fade-in slide-in-from-right-4"
        >
          <h3 className="text-lg font-semibold mb-2">Mobile Optimized</h3>
          <p>
            This content has reduced animations on mobile devices for better
            performance.
          </p>
        </MobileOptimizedAnimationWrapper>

        <PerformanceOptimizedWrapper
          className="p-6 bg-purple-100 rounded-lg border"
          animationClass="animate-in fade-in slide-in-from-bottom-4"
        >
          <h3 className="text-lg font-semibold mb-2">Performance Optimized</h3>
          <p>
            This content respects user's motion preferences and device
            capabilities.
          </p>
        </PerformanceOptimizedWrapper>

        <FadeInWrapper
          className="p-6 bg-orange-100 rounded-lg border"
          delay={200}
          duration={700}
        >
          <h3 className="text-lg font-semibold mb-2">Fade In Wrapper</h3>
          <p>
            This content uses a simple fade-in animation with custom delay and
            duration.
          </p>
        </FadeInWrapper>
      </div>

      {/* Scroll test area */}
      <div
        className="h-96 bg-gray-100 rounded-lg p-4 overflow-y-auto"
        onScroll={handleThrottledScroll}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Scroll Test Area</h3>
          <p>
            Scroll this area to test throttled scroll events (check console for
            logs).
          </p>
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="p-4 bg-white rounded border">
              Scroll Item {i + 1} - This demonstrates throttled scroll
              performance
            </div>
          ))}
        </div>
      </div>

      {/* Performance tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">
          Performance Tips
        </h3>
        <ul className="space-y-2 text-yellow-700">
          <li>
            • Use <code>LazyAnimationWrapper</code> for scroll-triggered
            animations
          </li>
          <li>
            • Use <code>MobileOptimizedAnimationWrapper</code> for
            mobile-specific optimizations
          </li>
          <li>
            • Use <code>debounce()</code> for expensive operations like search
          </li>
          <li>
            • Use <code>throttle()</code> for scroll/resize events
          </li>
          <li>
            • Check <code>isMobile()</code> for device-specific logic
          </li>
          <li>
            • Use <code>measurePerformance()</code> to monitor performance
          </li>
        </ul>
      </div>
    </div>
  );
}
