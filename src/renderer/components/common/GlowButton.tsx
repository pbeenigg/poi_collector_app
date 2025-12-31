import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { motion } from 'framer-motion';

/**
 * 发光按钮组件
 */
interface GlowButtonProps extends ButtonProps {
  glowColor?: string;
}

const MotionButton = motion(Button);

export const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  glowColor,
  sx,
  ...props
}) => {
  return (
    <MotionButton
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      sx={{
        position: 'relative',
        overflow: 'visible',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MotionButton>
  );
};
