import React from 'react';
import { PhaseType, getPhaseColors } from '@/lib/design-tokens';

interface PhaseIndicatorProps {
  phase: PhaseType;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const phaseLabels: Record<PhaseType, string> = {
  expansion: 'Expansion',
  contraction: 'Contraction', 
  transition: 'Transition',
  stable: 'Stable'
};

const phaseIcons: Record<PhaseType, string> = {
  expansion: '↗️',
  contraction: '↘️',
  transition: '↔️',
  stable: '→'
};

export default function PhaseIndicator({ 
  phase, 
  size = 'medium',
  showText = true 
}: PhaseIndicatorProps) {
  const phaseColors = getPhaseColors(phase);
  
  const sizeClasses = {
    small: {
      container: 'px-2 py-1 text-xs',
      icon: 'text-xs',
      text: 'text-xs'
    },
    medium: {
      container: 'px-3 py-1.5 text-sm',
      icon: 'text-sm',
      text: 'text-sm'
    },
    large: {
      container: 'px-4 py-2 text-base',
      icon: 'text-base',
      text: 'text-base'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div 
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${currentSize.container}
        transition-all duration-200 hover:scale-105
      `}
      style={{
        backgroundColor: phaseColors.background,
        color: phaseColors.foreground,
        borderWidth: '1px',
        borderColor: phaseColors.border,
      }}
    >
      <span className={currentSize.icon} role="img" aria-label={`${phase} phase`}>
        {phaseIcons[phase]}
      </span>
      {showText && (
        <span className={`${currentSize.text} font-medium`}>
          {phaseLabels[phase]}
        </span>
      )}
    </div>
  );
} 