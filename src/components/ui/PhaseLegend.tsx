'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { PhaseType, getPhaseColors } from '@/lib/design-tokens';

export interface PhaseInfo {
  phase: PhaseType;
  label: string;
  description: string;
  characteristics: string[];
  investmentImplications: string[];
  duration: string;
  indicators: string[];
  examples: string[];
}

export interface PhaseLegendProps {
  phases?: PhaseType[];
  showDescriptions?: boolean;
  showCharacteristics?: boolean;
  showInvestmentTips?: boolean;
  showIndicators?: boolean;
  showExamples?: boolean;
  compactMode?: boolean;
  interactive?: boolean;
  orientation?: 'horizontal' | 'vertical';
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'floating';
  onPhaseClick?: (phase: PhaseType) => void;
  onPhaseHover?: (phase: PhaseType | null) => void;
  selectedPhase?: PhaseType | null;
  highlightedPhases?: PhaseType[];
  className?: string;
}

const PHASE_DATA: PhaseInfo[] = [
  {
    phase: 'expansion',
    label: 'Expansion',
    description: 'Business is growing with increasing revenues, margins, and profitability',
    characteristics: [
      'Rising revenue and profit margins',
      'Increasing market share',
      'Strong cash flow generation',
      'Expanding operations'
    ],
    investmentImplications: [
      'Generally positive for stock performance',
      'Good time for growth investments',
      'Consider scaling positions',
      'Monitor for overvaluation'
    ],
    duration: 'Typically 2-5 quarters',
    indicators: [
      'Revenue growth > 10%',
      'Margin expansion',
      'Positive operating leverage',
      'Strong ROE/ROCE'
    ],
    examples: [
      'New product launches',
      'Market expansion',
      'Operational efficiency gains',
      'Pricing power improvement'
    ]
  },
  {
    phase: 'contraction',
    label: 'Contraction',
    description: 'Business is declining with falling revenues, compressed margins, and reduced profitability',
    characteristics: [
      'Declining revenue and margins',
      'Reduced market share',
      'Weak cash generation',
      'Cost pressure'
    ],
    investmentImplications: [
      'Caution advised for new investments',
      'Consider reducing exposure',
      'Focus on quality and defensives',
      'Look for turnaround catalysts'
    ],
    duration: 'Usually 1-3 quarters',
    indicators: [
      'Revenue decline > 5%',
      'Margin compression',
      'Negative operating leverage',
      'Deteriorating returns'
    ],
    examples: [
      'Economic downturn impact',
      'Competitive pressure',
      'Raw material cost inflation',
      'Demand destruction'
    ]
  },
  {
    phase: 'stable',
    label: 'Stable',
    description: 'Business performance is steady with consistent but modest growth patterns',
    characteristics: [
      'Steady revenue growth',
      'Stable margin profile',
      'Consistent cash flows',
      'Predictable operations'
    ],
    investmentImplications: [
      'Suitable for income-focused investors',
      'Lower volatility expected',
      'Good for portfolio stability',
      'May underperform in bull markets'
    ],
    duration: 'Can persist for years',
    indicators: [
      'Revenue growth 0-5%',
      'Stable margins',
      'Consistent returns',
      'Low volatility'
    ],
    examples: [
      'Mature market operations',
      'Utility-like characteristics',
      'Stable regulatory environment',
      'Defensive business model'
    ]
  },
  {
    phase: 'transition',
    label: 'Transition',
    description: 'Business is changing phases, showing mixed signals and uncertain direction',
    characteristics: [
      'Mixed performance signals',
      'Volatile metrics',
      'Uncertain direction',
      'Changing fundamentals'
    ],
    investmentImplications: [
      'Higher uncertainty and risk',
      'Watch for trend confirmation',
      'Consider smaller positions',
      'Monitor key indicators closely'
    ],
    duration: '1-2 quarters typically',
    indicators: [
      'Inconsistent growth rates',
      'Margin volatility',
      'Mixed operational metrics',
      'Unclear trend direction'
    ],
    examples: [
      'Business model changes',
      'Management transitions',
      'Market disruption',
      'Strategic pivots'
    ]
  }
];

const PhaseLegend: React.FC<PhaseLegendProps> = ({
  phases,
  showDescriptions = false,
  showCharacteristics = false,
  showInvestmentTips = false,
  showIndicators = false,
  showExamples = false,
  compactMode = false,
  interactive = false,
  orientation = 'horizontal',
  placement = 'top',
  onPhaseClick,
  onPhaseHover,
  selectedPhase,
  highlightedPhases = [],
  className = '',
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const displayPhases = useMemo(() => {
    const phasesToShow = phases || ['expansion', 'contraction', 'stable', 'transition'];
    return PHASE_DATA.filter(phaseInfo => 
      phasesToShow.includes(phaseInfo.phase)
    );
  }, [phases]);

  const handlePhaseClick = (phase: PhaseType) => {
    if (interactive && onPhaseClick) {
      onPhaseClick(phase);
    }
  };

  const handlePhaseHover = (phase: PhaseType | null) => {
    if (interactive && onPhaseHover) {
      onPhaseHover(phase);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, phase: PhaseType) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handlePhaseClick(phase);
    }
  };

  const getPhaseItemClasses = (phase: PhaseType) => {
    const baseClasses = [
      'border-2 rounded-lg transition-all duration-200',
      compactMode ? 'p-2' : 'p-4'
    ];

    if (interactive) {
      baseClasses.push('cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2');
    }

    if (selectedPhase === phase) {
      baseClasses.push('selected ring-2 ring-blue-500 ring-offset-2');
    }

    if (highlightedPhases.includes(phase)) {
      baseClasses.push('highlighted ring-2 ring-offset-2');
    } else if (highlightedPhases.length > 0) {
      baseClasses.push('dimmed opacity-50');
    }

    return baseClasses.join(' ');
  };

  const getOrientationClasses = () => {
    if (isMobile) {
      return 'flex-col space-y-4 mobile-layout';
    }
    
    return orientation === 'vertical' 
      ? 'flex-col space-y-4' 
      : 'flex-row space-x-4 sm:flex-row flex-col';
  };

  const getPlacementClasses = () => {
    const classes = [`placement-${placement}`];
    
    if (placement === 'floating') {
      classes.push('absolute z-50 bg-white shadow-lg border rounded-lg');
    }
    
    return classes.join(' ');
  };

  if (displayPhases.length === 0) {
    return (
      <div 
        className={`phase-legend ${getOrientationClasses()} ${getPlacementClasses()} ${compactMode ? 'compact' : ''} ${className}`}
        data-testid="phase-legend"
        role="region"
        aria-label="Business cycle phase legend"
      >
        <div className="text-center text-gray-500 py-4">
          No phases to display
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`phase-legend flex ${getOrientationClasses()} ${getPlacementClasses()} ${compactMode ? 'compact' : ''} dark:bg-gray-800 ${className}`}
      data-testid="phase-legend"
      role="region"
      aria-label="Business cycle phase legend"
    >
      {/* Screen reader content */}
      <div className="sr-only">
        <p>Business cycle phases with their characteristics and investment implications</p>
      </div>

      {displayPhases.map((phaseInfo) => {
        const colors = getPhaseColors(phaseInfo.phase);
        
        return (
          <div
            key={phaseInfo.phase}
            data-testid={`phase-${phaseInfo.phase}`}
            className={getPhaseItemClasses(phaseInfo.phase)}
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
              color: colors.foreground
            }}
            onClick={() => handlePhaseClick(phaseInfo.phase)}
            onMouseEnter={() => handlePhaseHover(phaseInfo.phase)}
            onMouseLeave={() => handlePhaseHover(null)}
            onKeyDown={(e) => handleKeyDown(e, phaseInfo.phase)}
            tabIndex={interactive ? 0 : -1}
            role={interactive ? 'button' : undefined}
            aria-label={`${phaseInfo.label} phase information`}
          >
            {/* Phase Header */}
            <div className="flex items-center space-x-2 mb-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: colors.border }}
              />
              <h3 className="font-semibold text-lg">{phaseInfo.label}</h3>
            </div>

            {/* Phase Description */}
            {showDescriptions && (
              <p className="text-sm mb-3 leading-relaxed">
                {phaseInfo.description}
              </p>
            )}

            {/* Characteristics */}
            {showCharacteristics && (
              <div className="mb-3">
                <h4 className="font-medium text-sm mb-2">Characteristics:</h4>
                <ul className="text-xs space-y-1">
                  {phaseInfo.characteristics.map((char, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{char}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Investment Implications */}
            {showInvestmentTips && (
              <div className="mb-3">
                <h4 className="font-medium text-sm mb-2">Investment Strategy:</h4>
                <ul className="text-xs space-y-1">
                  {phaseInfo.investmentImplications.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">→</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Indicators & Duration */}
            {showIndicators && (
              <div className="mb-3">
                <h4 className="font-medium text-sm mb-2">Key Indicators:</h4>
                <ul className="text-xs space-y-1 mb-2">
                  {phaseInfo.indicators.map((indicator, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">▪</span>
                      <span>{indicator}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs font-medium" style={{ color: colors.border }}>
                  Duration: {phaseInfo.duration}
                </div>
              </div>
            )}

            {/* Examples */}
            {showExamples && (
              <div>
                <h4 className="font-medium text-sm mb-2">Examples:</h4>
                <ul className="text-xs space-y-1">
                  {phaseInfo.examples.map((example, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PhaseLegend; 