'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { PhaseType, getPhaseColors } from '@/lib/design-tokens';

export interface PhaseTooltipProps {
  phase: PhaseType;
  title?: string;
  isVisible?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'manual';
  showMetrics?: boolean;
  showAdvice?: boolean;
  showDuration?: boolean;
  showExamples?: boolean;
  showActions?: boolean;
  compact?: boolean;
  metrics?: {
    revenue?: number;
    margin?: number;
    growth?: number;
    confidence?: number;
  };
  onClose?: () => void;
  onActionClick?: (action: string) => void;
  children?: React.ReactNode;
}

const PHASE_INFO = {
  expansion: {
    title: 'Expansion Phase',
    description: 'Business is growing with increasing revenues, margins, and profitability',
    advice: [
      'Generally positive for stock performance',
      'Good time for growth investments',
      'Consider scaling positions',
      'Monitor for overvaluation'
    ],
    duration: '2-5 quarters',
    examples: [
      'New product launches',
      'Market expansion',
      'Operational efficiency gains',
      'Pricing power improvement'
    ]
  },
  contraction: {
    title: 'Contraction Phase',
    description: 'Business is declining with falling revenues, compressed margins, and reduced profitability',
    advice: [
      'Caution advised for new investments',
      'Consider reducing exposure',
      'Focus on quality and defensives',
      'Look for turnaround catalysts'
    ],
    duration: '1-3 quarters',
    examples: [
      'Economic downturn impact',
      'Competitive pressure',
      'Raw material cost inflation',
      'Demand destruction'
    ]
  },
  stable: {
    title: 'Stable Phase',
    description: 'Business performance is steady with consistent but modest growth patterns',
    advice: [
      'Suitable for income-focused investors',
      'Lower volatility expected',
      'Good for portfolio stability',
      'May underperform in bull markets'
    ],
    duration: 'Can persist for years',
    examples: [
      'Mature market operations',
      'Utility-like characteristics',
      'Stable regulatory environment',
      'Defensive business model'
    ]
  },
  transition: {
    title: 'Transition Phase',
    description: 'Business is changing phases, showing mixed signals and uncertain direction',
    advice: [
      'Higher uncertainty and risk',
      'Watch for trend confirmation',
      'Consider smaller positions',
      'Monitor key indicators closely'
    ],
    duration: '1-2 quarters typically',
    examples: [
      'Business model changes',
      'Management transitions',
      'Market disruption',
      'Strategic pivots'
    ]
  }
};

const PhaseTooltip: React.FC<PhaseTooltipProps> = ({
  phase,
  title,
  isVisible: controlledVisible,
  position = 'top',
  trigger = 'hover',
  showMetrics = false,
  showAdvice = false,
  showDuration = false,
  showExamples = false,
  showActions = false,
  compact = false,
  metrics,
  onClose,
  onActionClick,
  children,
}) => {
  const [internalVisible, setInternalVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const isVisible = controlledVisible ?? internalVisible;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        if (controlledVisible !== undefined) {
          // Controlled component - notify parent
          onClose?.();
        } else {
          // Uncontrolled component - manage internal state
          setInternalVisible(false);
          onClose?.();
        }
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isVisible, onClose, controlledVisible]);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      adjustPosition();
    }
  }, [isVisible, position]);

  const phaseInfo = useMemo(() => {
    return PHASE_INFO[phase] || {
      title: 'Unknown Phase',
      description: 'Phase information not available',
      advice: [],
      duration: 'Unknown',
      examples: []
    };
  }, [phase]);

  const colors = useMemo(() => getPhaseColors(phase), [phase]);

  const adjustPosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let newPosition = position;

    // Check if tooltip fits in current position
    switch (position) {
      case 'top':
        if (triggerRect.top - tooltipRect.height < 10) {
          newPosition = 'bottom';
        }
        break;
      case 'bottom':
        if (triggerRect.bottom + tooltipRect.height > viewport.height - 10) {
          newPosition = 'top';
        }
        break;
      case 'left':
        if (triggerRect.left - tooltipRect.width < 10) {
          newPosition = 'right';
        }
        break;
      case 'right':
        if (triggerRect.right + tooltipRect.width > viewport.width - 10) {
          newPosition = 'left';
        }
        break;
    }

    setActualPosition(newPosition);
  };

  const handleShow = () => {
    if (trigger !== 'manual') {
      setInternalVisible(true);
    }
  };

  const handleHide = () => {
    if (trigger !== 'manual') {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setInternalVisible(false);
      }, 100);
    }
  };

  const handleClose = () => {
    setInternalVisible(false);
    onClose?.();
  };

  const handleTriggerClick = () => {
    if (trigger === 'click') {
      setInternalVisible(!internalVisible);
    }
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (trigger === 'click') {
        setInternalVisible(!internalVisible);
      }
    }
  };

  const handleActionClick = (action: string) => {
    onActionClick?.(action);
  };

  const handleActionKeyDown = (event: React.KeyboardEvent, action: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleActionClick(action);
    }
  };

  const getPositionClasses = () => {
    const classes = [`position-${actualPosition}`];
    
    switch (actualPosition) {
      case 'top':
        classes.push('bottom-full mb-2 left-1/2 transform -translate-x-1/2');
        break;
      case 'bottom':
        classes.push('top-full mt-2 left-1/2 transform -translate-x-1/2');
        break;
      case 'left':
        classes.push('right-full mr-2 top-1/2 transform -translate-y-1/2');
        break;
      case 'right':
        classes.push('left-full ml-2 top-1/2 transform -translate-y-1/2');
        break;
    }
    
    return classes.join(' ');
  };

  const tooltipId = `tooltip-${phase}-${Date.now()}`;

  return (
    <div className="relative inline-block">
                    <div
        ref={triggerRef}
        data-testid="tooltip-trigger"
        onClick={handleTriggerClick}
        onMouseEnter={trigger === 'hover' ? handleShow : undefined}
        onMouseLeave={trigger === 'hover' ? handleHide : undefined}
        onKeyDown={handleTriggerKeyDown}
        tabIndex={trigger === 'click' ? 0 : undefined}
        aria-describedby={isVisible ? tooltipId : undefined}
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          id={tooltipId}
          data-testid="phase-tooltip"
          role="tooltip"
          aria-label={`${title || phaseInfo.title} information`}
          className={`
            absolute z-50 
            ${getPositionClasses()}
            ${compact ? 'compact w-64' : 'w-80'}
            ${isMobile ? 'mobile-responsive w-72' : ''}
            bg-white border-2 rounded-lg shadow-lg
                         ${isVisible ? 'animate-in fade-in-0 zoom-in-95' : ''}
            overflow-hidden
          `}
          style={{
            borderColor: colors.border,
            backgroundColor: 'white'
          }}
          onMouseEnter={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          }}
          onMouseLeave={trigger === 'hover' ? handleHide : undefined}
        >
          {/* Header */}
          <div 
            className="px-4 py-3 border-b"
            style={{ backgroundColor: colors.background, color: colors.foreground }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                {title || phaseInfo.title}
              </h3>
              {onClose && (
                <button
                  data-testid="tooltip-close"
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close tooltip"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Description */}
            <p className="text-sm text-gray-700 leading-relaxed">
              {phaseInfo.description}
            </p>

            {/* Metrics */}
            {showMetrics && (
              <div>
                <h4 className="font-medium text-sm mb-2">Current Metrics</h4>
                {metrics ? (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {metrics.revenue !== undefined && (
                      <div>
                        <span className="text-gray-600">Revenue Growth</span>
                        <div className="font-semibold">{metrics.revenue}%</div>
                      </div>
                    )}
                    {metrics.margin !== undefined && (
                      <div>
                        <span className="text-gray-600">Margin Expansion</span>
                        <div className="font-semibold">{metrics.margin}%</div>
                      </div>
                    )}
                    {metrics.growth !== undefined && (
                      <div>
                        <span className="text-gray-600">Growth Rate</span>
                        <div className="font-semibold">{metrics.growth}%</div>
                      </div>
                    )}
                    {metrics.confidence !== undefined && (
                      <div>
                        <span className="text-gray-600">Confidence</span>
                        <div className="font-semibold">{metrics.confidence}%</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No metrics available</p>
                )}
              </div>
            )}

            {/* Investment Advice */}
            {showAdvice && (
              <div>
                <h4 className="font-medium text-sm mb-2">Investment Strategy</h4>
                <ul className="text-xs space-y-1">
                  {phaseInfo.advice.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">→</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Duration */}
            {showDuration && (
              <div>
                <h4 className="font-medium text-sm mb-1">Typical Duration</h4>
                <p className="text-xs text-gray-600">{phaseInfo.duration}</p>
              </div>
            )}

            {/* Examples */}
            {showExamples && (
              <div>
                <h4 className="font-medium text-sm mb-2">Examples</h4>
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

            {/* Actions */}
            {showActions && (
              <div className="pt-2 border-t">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleActionClick('learn-more')}
                    onKeyDown={(e) => handleActionKeyDown(e, 'learn-more')}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Learn More
                  </button>
                  <button
                    onClick={() => handleActionClick('view-analysis')}
                    onKeyDown={(e) => handleActionKeyDown(e, 'view-analysis')}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    View Analysis
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Arrow */}
          <div
            className={`absolute w-3 h-3 transform rotate-45 border ${
              actualPosition === 'top' ? 'top-full -mt-2 border-b-0 border-r-0' :
              actualPosition === 'bottom' ? 'bottom-full -mb-2 border-t-0 border-l-0' :
              actualPosition === 'left' ? 'left-full -ml-2 border-b-0 border-l-0' :
              'right-full -mr-2 border-t-0 border-r-0'
            }`}
            style={{ 
              borderColor: colors.border,
              backgroundColor: 'white'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PhaseTooltip; 