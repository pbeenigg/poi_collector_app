import React from 'react';
import { Card, CardProps } from '@mui/material';
import { motion } from 'framer-motion';

/**
 * 发光卡片组件
 */
interface GlowCardProps extends CardProps {
  glowColor?: string;
  intensity?: 'low' | 'medium' | 'high';
}

const MotionCard = motion(Card);

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  glowColor,
  intensity = 'medium',
  sx,
  ...props
}) => {
  const intensityMap = {
    low: 20,
    medium: 30,
    high: 40,
  };

  const glowSize = intensityMap[intensity];

  return (
    <MotionCard
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
      sx={{
        position: 'relative',
        overflow: 'visible',
        '&::before': glowColor
          ? {
              content: '""',
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              background: `linear-gradient(135deg, ${glowColor}40, transparent)`,
              borderRadius: 'inherit',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              zIndex: -1,
            }
          : undefined,
        '&:hover::before': glowColor
          ? {
              opacity: 1,
            }
          : undefined,
        ...sx,
      }}
      {...props}
    >
      {children}
    </MotionCard>
  );
};
