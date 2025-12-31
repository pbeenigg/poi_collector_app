import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

/**
 * 扫描线动画组件
 */
interface ScanLineProps {
  color?: string;
  height?: number;
  duration?: number;
}

export const ScanLine: React.FC<ScanLineProps> = ({
  color = '#00F5FF',
  height = 2,
  duration = 3,
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: height,
        overflow: 'hidden',
        background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </Box>
  );
};
