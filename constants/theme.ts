/**
 * XPence Theme Definition
 * Design System: Vibrant Ember
 */

export const theme = {
  colors: {
    // Brand Colors
    primaryRed: "#FF4D4D",
    primaryOrange: "#FF8C42",

    // Gradients (To be used with react-native-linear-gradient)
    mainGradient: ["#FF4D4D", "#FF8C42"],

    // UI Colors
    background: "#F8F9FB",
    card: "#FFFFFF",
    textDark: "#1F2937",
    textLight: "#9CA3AF",
    divider: "#E5E7EB",

    // Category & Status Colors
    needs: "#4361EE",
    wants: "#F72585",
    savings: "#4CC9F0",
    success: "#4ADE80",

    // Feedback (success, error, info, warning)
    error: "#DC2626",
    info: "#2563EB",
    warning: "#F59E0B",

    // Overlays
    needsBg: "rgba(67, 97, 238, 0.1)",
    wantsBg: "rgba(247, 37, 133, 0.1)",
    savingsBg: "rgba(76, 201, 240, 0.1)",
    primaryRedBg: "rgba(255, 77, 77, 0.1)",
    successBg: "rgba(74, 222, 128, 0.15)",
    errorBg: "rgba(220, 38, 38, 0.1)",
    infoBg: "rgba(37, 99, 235, 0.1)",
    warningBg: "rgba(245, 158, 11, 0.15)",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 24,
    xl: 32,
    round: 999,
  },

  shadows: {
    soft: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.05,
      shadowRadius: 30,
      elevation: 5,
    },
    brand: {
      shadowColor: "#FF4D4D",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 15,
      elevation: 8,
    },
  },

  typography: {
    fontFamily: {
      // Note: Assumes standard system fonts or specific custom font loading
      regular: "System",
      bold: "System",
    },
    sizes: {
      xs: 11,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 24,
      title: 28,
      hero: 42,
      display: 64,
    },
    weights: {
      regular: "400" as const,
      medium: "600" as const,
      bold: "700" as const,
      heavy: "800" as const,
    },
  },
};

export type Theme = typeof theme;
