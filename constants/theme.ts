/**
 * XPence Theme Definition
 * Design System: Xpence Vivid
 *
 * Font: Plus Jakarta Sans
 * Install: npx expo install @expo-google-fonts/plus-jakarta-sans expo-font
 * Then load in your root layout:
 *   import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold } from "@expo-google-fonts/plus-jakarta-sans";
 */

import { Platform } from "react-native";

export const theme = {
  colors: {
    // Brand Colors
    primaryRed: "#FF4D4D",
    primaryOrange: "#FF8C42",

    // Gradients (To be used with react-native-linear-gradient)
    mainGradient: ["#FF4D4D", "#FF8C42"] as string[],
    mainGradientWithOpacity: ["#FF8C4250", "#FF4D4D00"] as string[],

    // UI Colors — Light
    background: "#F8F9FB",
    card: "#FFFFFF",
    textDark: "#191C1E",
    textLight: "#5B403E",
    divider: "#E5E7EB",

    // UI Colors — Dark mode
    backgroundDark: "#0F172A",
    cardDark: "#1E293B",
    textDarkMode: "#FFFFFF",
    textSecondaryDark: "#94A3B8",

    // Category & Status Colors
    needs: "#3B82F6",
    wants: "#EC4899",
    savings: "#06B6D4",
    success: "#4ADE80",

    // Feedback (success, error, info, warning)
    error: "#DC2626",
    info: "#2563EB",
    warning: "#F59E0B",

    icons: "#D1D5DB",
    gray: "#e6e8ea",
    progressBarBg: "#f2f4f6",

    // Overlays
    needsBg: "rgba(59, 130, 246, 0.1)",
    wantsBg: "rgba(236, 72, 153, 0.1)",
    savingsBg: "rgba(6, 182, 212, 0.1)",
    primaryRedBg: "rgba(255, 77, 77, 0.1)",
    primaryOrangeBg: "rgba(255, 140, 66, 0.1)",
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
    round: 9999,
  },

  shadows: {
    // 0 12px 32px -4px rgba(25, 28, 30, 0.06)
    soft: {
      shadowColor: "#191C1E",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.06,
      shadowRadius: 32,
      elevation: 6,
    },
    // 0 4px 12px rgba(0, 0, 0, 0.04)
    whisper: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 12,
      elevation: 2,
    },
    // 0 8px 24px rgba(0, 0, 0, 0.2)
    dark: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 10,
    },
    brand: Platform.select({
      ios: {
        shadowColor: "#FF4D4D",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
      },
      default: {
        elevation: 8,
      },
    }),
  },

  typography: {
    fontFamily: {
      regular: "PlusJakartaSans_400Regular",
      medium: "PlusJakartaSans_500Medium",
      bold: "PlusJakartaSans_700Bold",
      heavy: "PlusJakartaSans_800ExtraBold",
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
      light: "300" as const,
      regular: "400" as const,
      medium: "500" as const,
      bold: "700" as const,
      heavy: "800" as const,
    },
    letterSpacing: {
      heading: -0.3,
      body: 0,
    },
  },
};

export type Theme = typeof theme;
