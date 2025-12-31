import { createTheme, Theme } from '@mui/material/styles';

/**
 * 主题类型定义
 */
export type ThemeMode = 'cyberpunk' | 'darkblue';

/**
 * 主题配色方案
 */
export const themeColors = {
  cyberpunk: {
    primary: '#A78BFA',      // 柔和紫
    secondary: '#60A5FA',    // 天蓝
    background: '#1E1B4B',   // 深紫蓝
    paper: '#312E81',        // 紫灰
    text: '#E0E7FF',         // 冷白
    accent: '#F472B6',       // 粉紫
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
  },
  darkblue: {
    primary: '#38BDF8',      // 亮蓝
    secondary: '#60A5FA',    // 天蓝
    background: '#0F172A',   // 深蓝灰
    paper: '#1E293B',        // 蓝灰
    text: '#E2E8F0',         // 浅灰白
    accent: '#7DD3FC',       // 浅蓝
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
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
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      fontSize: 14,
      h1: {
        fontSize: '2rem',
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: '1.75rem',
        fontWeight: 700,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1.125rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
      },
      body1: {
        fontSize: '0.875rem',
      },
      body2: {
        fontSize: '0.8125rem',
      },
      button: {
        fontSize: '0.875rem',
        textTransform: 'none',
        fontWeight: 600,
      },
      caption: {
        fontSize: '0.75rem',
      },
    },
    shape: {
      borderRadius: 12,
    },
    spacing: 8,
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
            background: `linear-gradient(135deg, ${colors.paper}F2 0%, ${colors.paper}E6 100%)`,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${colors.primary}30`,
            boxShadow: `0 4px 24px ${colors.background}60, 0 2px 8px ${colors.background}40`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'visible',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 32px ${colors.background}80, 0 4px 12px ${colors.background}60`,
              border: `1px solid ${colors.primary}60`,
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
      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            overflow: 'auto',
            maxWidth: '100%',
            '&::-webkit-scrollbar': {
              width: 8,
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              background: `${colors.background}40`,
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              background: `${colors.primary}60`,
              borderRadius: 4,
              '&:hover': {
                background: `${colors.primary}80`,
              },
            },
          },
        },
      },
      MuiTable: {
        styleOverrides: {
          root: {
            minWidth: 650,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${colors.primary}20`,
            padding: '16px',
          },
          head: {
            fontWeight: 700,
            background: `${colors.primary}10`,
            borderBottom: `2px solid ${colors.primary}40`,
            position: 'sticky',
            top: 0,
            zIndex: 10,
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
  cyberpunk: '赛博紫',
  darkblue: '科技蓝',
};
