import { describe, test, expect, beforeAll, afterAll, jest } from '@jest/globals';
import { PerformanceService, MemoryMonitor, DEFAULT_PERFORMANCE_CONFIG } from './performance.service';

/**
 * Task 4.4: Performance Optimization (1000+ companies, memory management)
 * Tests for performance optimization service
 */

describe('Task 4.4: Performance Optimization Service', () => {
  let performanceService: PerformanceService;

  beforeAll(() => {
    performanceService = PerformanceService.getInstance();
  });

  describe('Memory Management', () => {
    test('should monitor memory usage accurately', () => {
      const memoryMonitor = new MemoryMonitor(DEFAULT_PERFORMANCE_CONFIG);
      
      const memoryUsage = memoryMonitor.getMemoryUsage();
      expect(memoryUsage.heapUsed).toBeGreaterThan(0);
      expect(memoryUsage.heapTotal).toBeGreaterThan(0);
      
      const memoryMB = memoryMonitor.getCurrentMemoryMB();
      expect(memoryMB).toBeGreaterThan(0);
      expect(memoryMB).toBeLessThan(2000); // Should be reasonable for tests
    });

    test('should detect memory threshold breaches', () => {
      const lowThresholdConfig = { ...DEFAULT_PERFORMANCE_CONFIG, gcThresholdMB: 1 }; // Very low threshold
      const memoryMonitor = new MemoryMonitor(lowThresholdConfig);
      
      expect(memoryMonitor.isMemoryThresholdExceeded()).toBe(true);
    });

    test('should register and call GC callbacks', () => {
      const memoryMonitor = new MemoryMonitor(DEFAULT_PERFORMANCE_CONFIG);
      let callbackCalled = false;
      
      memoryMonitor.registerGCCallback(() => {
        callbackCalled = true;
      });
      
      memoryMonitor.forceGarbageCollection();
      expect(callbackCalled).toBe(true);
    });
  });

  describe('LRU Cache Performance', () => {
    test('should handle large cache operations efficiently', () => {
      const startTime = Date.now();
      
      // Test with large number of operations
      for (let i = 0; i < 10000; i++) {
        performanceService.setCachedCalculation(`key_${i}`, { value: i });
      }
      
      for (let i = 0; i < 5000; i++) {
        performanceService.getCachedCalculation(`key_${i}`);
      }
      
      const endTime = Date.now();
      const operationsTime = endTime - startTime;
      
      // Should complete 15,000 cache operations in reasonable time
      expect(operationsTime).toBeLessThan(1000); // < 1 second
    });

    test('should maintain cache size limits', () => {
      const metrics = performanceService.getPerformanceMetrics();
      
      expect(metrics.cacheStatistics.calculationCacheSize).toBeLessThanOrEqual(
        metrics.cacheStatistics.maxCacheSize
      );
      expect(metrics.cacheStatistics.companyDataCacheSize).toBeLessThanOrEqual(
        metrics.cacheStatistics.maxCacheSize
      );
    });
  });

  describe('Configuration Optimization', () => {
    test('should optimize configuration for large datasets', () => {
      const originalConfig = { ...DEFAULT_PERFORMANCE_CONFIG };
      
      // Test optimization for 5000+ companies
      performanceService.optimizeForLargeDataset(6000);
      const newMetrics = performanceService.getPerformanceMetrics();
      
      // Should have adjusted batch size for large datasets
      expect(newMetrics.configuration.batchSize).toBeLessThanOrEqual(originalConfig.batchSize);
      expect(newMetrics.configuration.maxConcurrentBatches).toBeLessThanOrEqual(originalConfig.maxConcurrentBatches);
    });

    test('should handle medium dataset optimization', () => {
      performanceService.optimizeForLargeDataset(2000);
      const metrics = performanceService.getPerformanceMetrics();
      
      expect(metrics.configuration.batchSize).toBeGreaterThan(0);
      expect(metrics.configuration.maxConcurrentBatches).toBeGreaterThan(0);
    });
  });

  describe('Performance Metrics', () => {
    test('should provide comprehensive performance metrics', () => {
      const metrics = performanceService.getPerformanceMetrics();
      
      // Memory metrics
      expect(metrics.memoryUsage.heapUsed).toBeGreaterThan(0);
      expect(metrics.memoryUsage.heapTotal).toBeGreaterThan(0);
      expect(metrics.memoryUsage.external).toBeGreaterThanOrEqual(0);
      expect(metrics.memoryUsage.rss).toBeGreaterThan(0);
      
      // Cache statistics
      expect(metrics.cacheStatistics.calculationCacheSize).toBeGreaterThanOrEqual(0);
      expect(metrics.cacheStatistics.companyDataCacheSize).toBeGreaterThanOrEqual(0);
      expect(metrics.cacheStatistics.maxCacheSize).toBeGreaterThan(0);
      
      // Configuration
      expect(metrics.configuration.batchSize).toBeGreaterThan(0);
      expect(metrics.configuration.maxConcurrentBatches).toBeGreaterThan(0);
    });

    test('should track memory usage over time', async () => {
      const initialMetrics = performanceService.getPerformanceMetrics();
      
      // Simulate memory-intensive operations
      const largeData = new Array(10000).fill(null).map((_, i) => ({
        id: i,
        data: new Array(100).fill(Math.random())
      }));
      
      // Cache the data
      largeData.forEach((item, index) => {
        performanceService.setCachedCalculation(`large_${index}`, item);
      });
      
      const afterCachingMetrics = performanceService.getPerformanceMetrics();
      
      // Memory usage should have increased
      expect(afterCachingMetrics.memoryUsage.heapUsed).toBeGreaterThanOrEqual(
        initialMetrics.memoryUsage.heapUsed
      );
      
      // Clear caches
      performanceService.clearAllCaches();
      
      const afterClearingMetrics = performanceService.getPerformanceMetrics();
      expect(afterClearingMetrics.cacheStatistics.calculationCacheSize).toBe(0);
      expect(afterClearingMetrics.cacheStatistics.companyDataCacheSize).toBe(0);
    });
  });

  describe('Stress Testing', () => {
    test('should handle rapid cache operations without memory leaks', () => {
      const initialMemory = performanceService.getPerformanceMetrics().memoryUsage.heapUsed;
      
      // Perform many rapid operations
      for (let cycle = 0; cycle < 100; cycle++) {
        for (let i = 0; i < 100; i++) {
          performanceService.setCachedCalculation(`stress_${cycle}_${i}`, {
            cycle,
            index: i,
            timestamp: Date.now()
          });
        }
        
        // Clear every few cycles
        if (cycle % 10 === 0) {
          performanceService.clearAllCaches();
        }
      }
      
      const finalMemory = performanceService.getPerformanceMetrics().memoryUsage.heapUsed;
      
      // Memory shouldn't have grown excessively (allow for 50MB increase)
      expect(finalMemory - initialMemory).toBeLessThan(50);
    });

    test('should maintain performance with large cache churn', () => {
      const startTime = Date.now();
      
      // Simulate high cache churn
      for (let i = 0; i < 5000; i++) {
        performanceService.setCachedCalculation(`churn_${i}`, { value: i });
        
        // Randomly access previous items
        if (i > 100) {
          const randomIndex = Math.floor(Math.random() * i);
          performanceService.getCachedCalculation(`churn_${randomIndex}`);
        }
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should maintain performance even with high churn
      expect(duration).toBeLessThan(2000); // < 2 seconds for 5000 operations
    });
  });

  describe('Error Handling', () => {
    test('should handle memory pressure gracefully', () => {
      const pressureConfig = {
        ...DEFAULT_PERFORMANCE_CONFIG,
        gcThresholdMB: 10, // Very low threshold
        cacheMaxSize: 10   // Very small cache
      };
      
      const stressService = PerformanceService.getInstance(pressureConfig);
      
      // Try to exceed limits
      for (let i = 0; i < 100; i++) {
        stressService.setCachedCalculation(`pressure_${i}`, {
          largeData: new Array(1000).fill(i)
        });
      }
      
      const metrics = stressService.getPerformanceMetrics();
      
      // Cache size should be limited
      expect(metrics.cacheStatistics.calculationCacheSize).toBeLessThanOrEqual(10);
    });

    test('should recover from forced garbage collection', () => {
      const beforeGC = performanceService.getPerformanceMetrics();
      
      // Add some cached data
      for (let i = 0; i < 50; i++) {
        performanceService.setCachedCalculation(`gc_test_${i}`, { value: i });
      }
      
      const beforeForceGC = performanceService.getPerformanceMetrics();
      expect(beforeForceGC.cacheStatistics.calculationCacheSize).toBeGreaterThan(0);
      
      // Force garbage collection
      performanceService.forceGarbageCollection();
      
      const afterGC = performanceService.getPerformanceMetrics();
      
      // Caches should be cleared
      expect(afterGC.cacheStatistics.calculationCacheSize).toBe(0);
      expect(afterGC.cacheStatistics.companyDataCacheSize).toBe(0);
    });
  });

  describe('Integration Performance', () => {
    test('should provide performance benchmarks for comparison', () => {
      const benchmarkStart = Date.now();
      
      // Simulate typical operations
      const operations = [
        () => performanceService.setCachedCalculation('benchmark_1', { data: 'test' }),
        () => performanceService.getCachedCalculation('benchmark_1'),
        () => performanceService.getPerformanceMetrics(),
        () => performanceService.clearAllCaches()
      ];
      
      // Run operations multiple times
      for (let i = 0; i < 1000; i++) {
        const operation = operations[i % operations.length];
        operation();
      }
      
      const benchmarkEnd = Date.now();
      const benchmarkTime = benchmarkEnd - benchmarkStart;
      
      // Should complete 1000 mixed operations quickly
      expect(benchmarkTime).toBeLessThan(500); // < 500ms
      
      // Performance should meet targets
      const opsPerSecond = 1000 / (benchmarkTime / 1000);
      expect(opsPerSecond).toBeGreaterThan(2000); // > 2000 ops/sec
    });
  });
}); 