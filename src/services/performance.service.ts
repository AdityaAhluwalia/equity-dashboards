/**
 * Task 4.4: Performance Optimization (1000+ companies, memory management)
 * 
 * Performance optimization service for handling large-scale data processing:
 * - Memory-efficient batch processing
 * - LRU caching for frequently accessed data
 * - Connection pooling optimization
 * - Background processing for heavy calculations
 * - Memory monitoring and cleanup
 */

import { IntegrationService, getIntegrationService } from './integration.service';
import { DatabaseService } from './database.service';
import type { NonFinanceData } from '../lib/parsers/non-finance-parser';
import type { ParsedFinanceData } from '../lib/parsers/finance-parser';

// Union type for all parsed company data
export type ParsedCompanyData = NonFinanceData | ParsedFinanceData;

// ============================================================================
// PERFORMANCE CONFIGURATION
// ============================================================================

export interface PerformanceConfig {
  // Batch processing
  batchSize: number;
  maxConcurrentBatches: number;
  batchDelayMs: number;
  
  // Memory management
  maxMemoryMB: number;
  gcThresholdMB: number;
  cacheMaxSize: number;
  
  // Database optimization
  connectionPoolSize: number;
  queryTimeoutMs: number;
  
  // Performance targets
  maxProcessingTimeMs: number;
  maxCompaniesPerSecond: number;
}

export const DEFAULT_PERFORMANCE_CONFIG: PerformanceConfig = {
  batchSize: 50,
  maxConcurrentBatches: 4,
  batchDelayMs: 100,
  maxMemoryMB: 512,
  gcThresholdMB: 400,
  cacheMaxSize: 1000,
  connectionPoolSize: 10,
  queryTimeoutMs: 30000,
  maxProcessingTimeMs: 30000,
  maxCompaniesPerSecond: 10
};

// ============================================================================
// LRU CACHE IMPLEMENTATION
// ============================================================================

class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// ============================================================================
// MEMORY MONITOR
// ============================================================================

export class MemoryMonitor {
  private config: PerformanceConfig;
  private gcCallbacks: (() => void)[] = [];

  constructor(config: PerformanceConfig) {
    this.config = config;
  }

  getMemoryUsage(): NodeJS.MemoryUsage {
    return process.memoryUsage();
  }

  getCurrentMemoryMB(): number {
    return this.getMemoryUsage().heapUsed / (1024 * 1024);
  }

  isMemoryThresholdExceeded(): boolean {
    return this.getCurrentMemoryMB() > this.config.gcThresholdMB;
  }

  registerGCCallback(callback: () => void): void {
    this.gcCallbacks.push(callback);
  }

  forceGarbageCollection(): void {
    // Trigger registered cleanup callbacks
    this.gcCallbacks.forEach(callback => callback());
    
    // Force GC if available (requires --expose-gc flag)
    if (global.gc) {
      global.gc();
    }
  }

  checkAndOptimizeMemory(): boolean {
    if (this.isMemoryThresholdExceeded()) {
      this.forceGarbageCollection();
      return true;
    }
    return false;
  }
}

// ============================================================================
// BATCH PROCESSOR
// ============================================================================

export class BatchProcessor {
  private config: PerformanceConfig;
  private integrationService: IntegrationService;
  private activeBatches = 0;
  private processedCount = 0;
  private failedCount = 0;

  constructor(config: PerformanceConfig) {
    this.config = config;
    this.integrationService = getIntegrationService();
  }

  async processBatch(companies: ParsedCompanyData[]): Promise<BatchResult> {
    const batchStartTime = Date.now();
    const batchResults: CompanyProcessResult[] = [];

    for (const company of companies) {
      try {
        const result = await this.integrationService.importCompanyData(company, {
          validateData: true
        });
        
        batchResults.push({
          symbol: 'company' in company ? company.company.symbol : 'UNKNOWN',
          success: result.success,
          processingTime: Date.now() - batchStartTime,
          error: result.errors.length > 0 ? result.errors[0] : undefined
        });
        
        if (result.success) {
          this.processedCount++;
        } else {
          this.failedCount++;
        }
      } catch (error) {
        batchResults.push({
          symbol: company.company.symbol,
          success: false,
          processingTime: Date.now() - batchStartTime,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        this.failedCount++;
      }
    }

    const batchEndTime = Date.now();
    return {
      batchSize: companies.length,
      processingTime: batchEndTime - batchStartTime,
      results: batchResults,
      successCount: batchResults.filter(r => r.success).length,
      failureCount: batchResults.filter(r => !r.success).length
    };
  }

  async processCompaniesInBatches(
    companies: ParsedCompanyData[],
    progressCallback?: (progress: ProcessingProgress) => void
  ): Promise<BatchProcessingResult> {
    const totalStartTime = Date.now();
    const batches = this.createBatches(companies);
    const batchResults: BatchResult[] = [];
    
    this.processedCount = 0;
    this.failedCount = 0;

    // Process batches with controlled concurrency
    for (let i = 0; i < batches.length; i += this.config.maxConcurrentBatches) {
      const currentBatches = batches.slice(i, i + this.config.maxConcurrentBatches);
      const batchPromises = currentBatches.map(batch => this.processBatch(batch));
      
      const results = await Promise.all(batchPromises);
      batchResults.push(...results);
      
      // Progress callback
      if (progressCallback) {
        progressCallback({
          totalCompanies: companies.length,
          processedCompanies: this.processedCount + this.failedCount,
          successfulCompanies: this.processedCount,
          failedCompanies: this.failedCount,
          batchesCompleted: i / this.config.maxConcurrentBatches + 1,
          totalBatches: Math.ceil(batches.length / this.config.maxConcurrentBatches),
          elapsedTime: Date.now() - totalStartTime
        });
      }
      
      // Add delay between batch groups to prevent overwhelming the system
      if (i + this.config.maxConcurrentBatches < batches.length) {
        await this.delay(this.config.batchDelayMs);
      }
    }

    const totalEndTime = Date.now();
    return {
      totalCompanies: companies.length,
      successfulCompanies: this.processedCount,
      failedCompanies: this.failedCount,
      totalProcessingTime: totalEndTime - totalStartTime,
      averageTimePerCompany: (totalEndTime - totalStartTime) / companies.length,
      batchResults,
      performanceMetrics: {
        companiesPerSecond: companies.length / ((totalEndTime - totalStartTime) / 1000),
        memoryUsageAtStart: process.memoryUsage().heapUsed / (1024 * 1024),
        memoryUsageAtEnd: process.memoryUsage().heapUsed / (1024 * 1024)
      }
    };
  }

  private createBatches(companies: ParsedCompanyData[]): ParsedCompanyData[][] {
    const batches: ParsedCompanyData[][] = [];
    for (let i = 0; i < companies.length; i += this.config.batchSize) {
      batches.push(companies.slice(i, i + this.config.batchSize));
    }
    return batches;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================================
// PERFORMANCE SERVICE
// ============================================================================

export class PerformanceService {
  private static instance: PerformanceService;
  private config: PerformanceConfig;
  private memoryMonitor: MemoryMonitor;
  private batchProcessor: BatchProcessor;
  private calculationCache: LRUCache<string, any>;
  private companyDataCache: LRUCache<string, ParsedCompanyData>;
  
  private constructor(config: PerformanceConfig = DEFAULT_PERFORMANCE_CONFIG) {
    this.config = config;
    this.memoryMonitor = new MemoryMonitor(config);
    this.batchProcessor = new BatchProcessor(config);
    this.calculationCache = new LRUCache(config.cacheMaxSize);
    this.companyDataCache = new LRUCache(config.cacheMaxSize);
    
    this.setupMemoryMonitoring();
  }

  static getInstance(config?: PerformanceConfig): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService(config);
    }
    return PerformanceService.instance;
  }

  private setupMemoryMonitoring(): void {
    // Register cache cleanup callbacks
    this.memoryMonitor.registerGCCallback(() => {
      this.calculationCache.clear();
      this.companyDataCache.clear();
    });

    // Monitor memory usage periodically
    setInterval(() => {
      this.memoryMonitor.checkAndOptimizeMemory();
    }, 30000); // Check every 30 seconds
  }

  // ============================================================================
  // CACHING METHODS
  // ============================================================================

  getCachedCalculation(cacheKey: string): any {
    return this.calculationCache.get(cacheKey);
  }

  setCachedCalculation(cacheKey: string, calculation: any): void {
    this.calculationCache.set(cacheKey, calculation);
  }

  getCachedCompanyData(symbol: string): ParsedCompanyData | undefined {
    return this.companyDataCache.get(symbol);
  }

  setCachedCompanyData(symbol: string, data: ParsedCompanyData): void {
    this.companyDataCache.set(symbol, data);
  }

  // ============================================================================
  // BATCH PROCESSING METHODS
  // ============================================================================

  async processLargeDataset(
    companies: ParsedCompanyData[],
    options: ProcessingOptions = {}
  ): Promise<BatchProcessingResult> {
    const startTime = Date.now();
    
    // Pre-processing optimizations
    if (options.enableCaching) {
      companies = this.filterCachedCompanies(companies);
    }
    
    // Memory check before processing
    if (this.memoryMonitor.isMemoryThresholdExceeded()) {
      this.memoryMonitor.forceGarbageCollection();
    }
    
    const result = await this.batchProcessor.processCompaniesInBatches(
      companies,
      options.progressCallback
    );
    
    // Performance validation
    const processingTime = Date.now() - startTime;
    if (processingTime > this.config.maxProcessingTimeMs) {
      console.warn(`Processing took ${processingTime}ms, exceeding target of ${this.config.maxProcessingTimeMs}ms`);
    }
    
    const companiesPerSecond = companies.length / (processingTime / 1000);
    if (companiesPerSecond < this.config.maxCompaniesPerSecond) {
      console.warn(`Processing rate ${companiesPerSecond.toFixed(2)} companies/sec below target of ${this.config.maxCompaniesPerSecond}`);
    }
    
    return result;
  }

  private filterCachedCompanies(companies: ParsedCompanyData[]): ParsedCompanyData[] {
    return companies.filter(company => {
      const cached = this.getCachedCompanyData(company.company.symbol);
      if (cached) {
        // Check if cached data is still fresh (could add timestamp-based logic)
        return false;
      }
      return true;
    });
  }

  // ============================================================================
  // PERFORMANCE MONITORING
  // ============================================================================

  getPerformanceMetrics(): PerformanceMetrics {
    const memoryUsage = this.memoryMonitor.getMemoryUsage();
    
    return {
      memoryUsage: {
        heapUsed: memoryUsage.heapUsed / (1024 * 1024), // MB
        heapTotal: memoryUsage.heapTotal / (1024 * 1024), // MB
        external: memoryUsage.external / (1024 * 1024), // MB
        rss: memoryUsage.rss / (1024 * 1024) // MB
      },
      cacheStatistics: {
        calculationCacheSize: this.calculationCache.size(),
        companyDataCacheSize: this.companyDataCache.size(),
        maxCacheSize: this.config.cacheMaxSize
      },
      configuration: this.config
    };
  }

  optimizeForLargeDataset(expectedCompanies: number): void {
    // Adjust batch size based on expected load
    if (expectedCompanies > 5000) {
      this.config.batchSize = 25; // Smaller batches for very large datasets
      this.config.maxConcurrentBatches = 2;
    } else if (expectedCompanies > 1000) {
      this.config.batchSize = 50;
      this.config.maxConcurrentBatches = 3;
    }
    
    // Increase cache size for large datasets
    if (expectedCompanies > 1000) {
      this.calculationCache = new LRUCache(Math.min(expectedCompanies, 5000));
      this.companyDataCache = new LRUCache(Math.min(expectedCompanies, 2000));
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  clearAllCaches(): void {
    this.calculationCache.clear();
    this.companyDataCache.clear();
  }

  forceGarbageCollection(): void {
    this.memoryMonitor.forceGarbageCollection();
  }
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CompanyProcessResult {
  symbol: string;
  success: boolean;
  processingTime: number;
  error?: string;
}

export interface BatchResult {
  batchSize: number;
  processingTime: number;
  results: CompanyProcessResult[];
  successCount: number;
  failureCount: number;
}

export interface ProcessingProgress {
  totalCompanies: number;
  processedCompanies: number;
  successfulCompanies: number;
  failedCompanies: number;
  batchesCompleted: number;
  totalBatches: number;
  elapsedTime: number;
}

export interface BatchProcessingResult {
  totalCompanies: number;
  successfulCompanies: number;
  failedCompanies: number;
  totalProcessingTime: number;
  averageTimePerCompany: number;
  batchResults: BatchResult[];
  performanceMetrics: {
    companiesPerSecond: number;
    memoryUsageAtStart: number;
    memoryUsageAtEnd: number;
  };
}

export interface ProcessingOptions {
  enableCaching?: boolean;
  progressCallback?: (progress: ProcessingProgress) => void;
}

export interface PerformanceMetrics {
  memoryUsage: {
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
  };
  cacheStatistics: {
    calculationCacheSize: number;
    companyDataCacheSize: number;
    maxCacheSize: number;
  };
  configuration: PerformanceConfig;
} 