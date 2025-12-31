import { createTheme, Theme } from '@mui/material/styles';

/**
 * 主题类型定义
 */
export type ThemeMode = 'cyberpunk' | 'matrix' | 'darkblue';

/**
 * 主题配色方案
 */
export const themeColors = {
  cyberpunk: {
    primary: '#9D4EDD',      // 霓虹紫
    secondary: '#00F5FF',    // 电光蓝
    background: '#0A0E27',   // 深空黑
    paper: '#1A1F3A',        // 深灰
    text: '#E0E7FF',         // 冷白
    accent: '#FF006E',       // 荧光粉
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  matrix: {
    primary: '#00FF41',      // 矩阵绿
    secondary: '#008F11',    // 深绿
    background: '#000000',   // 黑色
    paper: '#001A00',        // 深绿黑
    text: '#00FF41',         // 亮绿
    accent: '#39FF14',       // 黄绿
    success: '#00FF41',
    warning: '#FFFF00',
    error: '#FF0000',
  },
  darkblue: {
    primary: '#00D9FF',      // 科技蓝
    secondary: '#0066FF',    // 深蓝
    background: '#0A1929',   // 深蓝黑
    paper: '#132F4C',        // 蓝灰
    text: '#B2E3FF',         // 冰蓝白
    accent: '#66B2FF',       // 亮蓝
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
};

/**
 * 创建主题
 */
export const createAppTheme = (mode: ThemeMode): Theme => {
  const colors = themeColors[mode];

  return createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: colors.primary,
        light: colors.accent,
        dark: colors.secondary,
      },
      secondary: {
        main: colors.secondary,
      },
      background: {
        default: colors.background,
        paper: colors.paper,
      },
      text: {
        primary: colors.text,
        secondary: `${colors.text}CC`, // 80% 透明度
      },
      success: {
        main: colors.success,
      },
      warning: {
        main: colors.warning,
      },
      error: {
        main: colors.error,
      },
    },
    typography: {
      fontFamily: [
        'JetBrains Mono',
        'Fira Code',
        'Consolas',
        'Monaco',
        'monospace',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
      ].join(','),
      h1: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '10px 24px',
            boxShadow: `0 0 20px ${colors.primary}40`,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: `0 0 30px ${colors.primary}80`,
              transform: 'translateY(-2px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          contained: {
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%)`,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: `linear-gradient(135deg, ${colors.paper}E6 0%, ${colors.paper}CC 100%)`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${colors.primary}40`,
            boxShadow: `0 8px 32px ${colors.background}80, 0 0 0 1px ${colors.primary}20`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 12px 48px ${colors.background}80, 0 0 0 1px ${colors.primary}60`,
              border: `1px solid ${colors.primary}80`,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            background: `${colors.paper}E6`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${colors.primary}20`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: `linear-gradient(180deg, ${colors.paper} 0%, ${colors.background} 100%)`,
            borderRight: `1px solid ${colors.primary}40`,
            boxShadow: `4px 0 24px ${colors.background}80`,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: '4px 8px',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: `${colors.primary}20`,
              borderLeft: `3px solid ${colors.primary}`,
              paddingLeft: '13px',
            },
            '&.Mui-selected': {
              background: `linear-gradient(90deg, ${colors.primary}40 0%, ${colors.primary}10 100%)`,
              borderLeft: `3px solid ${colors.primary}`,
              paddingLeft: '13px',
              '&:hover': {
                background: `linear-gradient(90deg, ${colors.primary}60 0%, ${colors.primary}20 100%)`,
              },
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: `${colors.primary}40`,
                transition: 'all 0.3s ease',
              },
              '&:hover fieldset': {
                borderColor: `${colors.primary}80`,
                boxShadow: `0 0 10px ${colors.primary}40`,
              },
              '&.Mui-focused fieldset': {
                borderColor: colors.primary,
                boxShadow: `0 0 20px ${colors.primary}60`,
              },
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${colors.primary}20`,
          },
          head: {
            fontWeight: 700,
            background: `${colors.primary}10`,
            borderBottom: `2px solid ${colors.primary}40`,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: 'all 0.2s ease',
            '&:hover': {
              background: `${colors.primary}10`,
              boxShadow: `inset 0 0 0 1px ${colors.primary}40`,
            },
            '&.Mui-selected': {
              background: `${colors.primary}20`,
              '&:hover': {
                background: `${colors.primary}30`,
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 600,
          },
          filled: {
            background: `${colors.primary}40`,
            border: `1px solid ${colors.primary}80`,
            '&:hover': {
              background: `${colors.primary}60`,
            },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: colors.primary,
              '& + .MuiSwitch-track': {
                backgroundColor: colors.primary,
                opacity: 0.5,
              },
            },
          },
        },
      },
    },
  });
};

/**
 * 主题名称映射
 */
export const themeNames: Record<ThemeMode, string> = {
  cyberpunk: '赛博朋克',
  matrix: '矩阵绿',
  darkblue: '暗夜蓝',
};
