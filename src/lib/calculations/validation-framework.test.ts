/**
 * Calculation Validation & Testing Framework Tests - Task 3.7
 */

import {
  validateCalculationAccuracy,
  ValidationFramework,
  createValidationReport
} from './validation-framework';

// Known benchmark data
const EMAMI_BENCHMARKS = {
  companyInfo: {
    name: 'Emami Ltd',
    sector: 'FMCG',
    type: 'non_finance' as const
  },
  expectedRatios: {
    roe: 0.298, // 29.8% ROE
    netProfitMargin: 0.189, // 18.9% net margin
    operatingProfitMargin: 0.227 // 22.7% OPM
  },
  tolerances: {
    strict: 0.001, // 0.1% tolerance
    normal: 0.01,  // 1% tolerance
    loose: 0.05    // 5% tolerance
  }
};

describe('Calculation Validation Framework - Task 3.7', () => {
  describe('Basic Accuracy Validation', () => {
    test('should validate accurate calculations', async () => {
      const actualRatios = {
        roe: 0.299, // Very close to expected 29.8%
        netProfitMargin: 0.190, // Very close to expected 18.9%
        operatingProfitMargin: 0.228 // Very close to expected 22.7%
      };
      
      const result = await validateCalculationAccuracy(
        actualRatios,
        EMAMI_BENCHMARKS.expectedRatios,
        EMAMI_BENCHMARKS.tolerances
      );
      
      expect(result.overallAccuracy).toBeGreaterThan(0.99);
      expect(result.failedValidations.length).toBe(0);
      expect(result.averageDeviation).toBeLessThan(0.01);
    });

    test('should detect inaccurate calculations', async () => {
      const inaccurateRatios = {
        roe: 0.50, // 50% ROE - clearly wrong
        netProfitMargin: 0.05, // 5% margin - too low for Emami
        operatingProfitMargin: -0.10 // Negative margin - impossible
      };
      
      const result = await validateCalculationAccuracy(
        inaccurateRatios,
        EMAMI_BENCHMARKS.expectedRatios,
        EMAMI_BENCHMARKS.tolerances
      );
      
      expect(result.overallAccuracy).toBeLessThan(0.5);
      expect(result.failedValidations.length).toBeGreaterThan(0);
      expect(result.criticalErrors.length).toBeGreaterThan(0);
    });
  });

  describe('ValidationFramework Class', () => {
    test('should create framework and run validations', async () => {
      const framework = new ValidationFramework();
      
      await framework.addValidationTarget('Emami', EMAMI_BENCHMARKS);
      await framework.runAllValidations();
      
      const accuracy = framework.getOverallAccuracy();
      const results = framework.getResults();
      
      expect(accuracy).toBeGreaterThanOrEqual(0);
      expect(results.length).toBe(1);
    });
  });

  describe('Validation Report Generation', () => {
    test('should generate comprehensive validation report', async () => {
      const framework = new ValidationFramework();
      await framework.addValidationTarget('Emami', EMAMI_BENCHMARKS);
      await framework.runAllValidations();
      
      const report = await createValidationReport(framework);
      
      expect(report).toBeDefined();
      expect(report.overallScore).toBeGreaterThanOrEqual(0);
      expect(report.companiesValidated).toBeGreaterThanOrEqual(0);
      expect(report.summary).toBeDefined();
    });
  });
});
