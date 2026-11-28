let name, packageName;
const appVariant = process.env.APP_VARIANT ?? "development";

switch (appVariant) {
  case "development":
    name = 'XPence (dev)'
    packageName = 'com.antonismargaronis.dev.xpence'
    break;
  case "preview":
    name = 'XPence (preview)'
    packageName = 'com.antonismargaronis.preview.xpence'
    break;
  case "production":
    name = 'XPence'
    packageName = 'com.antonismargaronis.xpence'
    break;
  default:
    throw new Error(`Unsupported APP_VARIANT: ${appVariant}`);
}

export default {
  "expo": {
    "name": name,
    "slug": "xpence-app",
    "version": "1.0.2",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "xpence",
    "userInterfaceStyle": "light",
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.anonymous.xpence"
    },
    "android": {
      "predictiveBackGestureEnabled": false,
      "package": packageName,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon-foreground.png",
        "backgroundImage": "./assets/images/adaptive-icon-background.png",
        "monochromeImage": "./assets/images/adaptive-icon-monochrome.png",
        "backgroundColor": "#FF6A4F"
      }
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-secure-store",
      "expo-font",
      [
        "expo-build-properties",
        {
          "android": {
            "enableProguardInReleaseBuilds": true,
            "enableShrinkResourcesInReleaseBuilds": true
          }
        }
      ],
      "expo-localization",
      [
        "expo-notifications",
        {
          "icon": "./assets/images/notification-icon.png",
          "color": "#FF4F59"
        }
      ],
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#F8F9FB"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "51cc42b1-ad30-4633-8f82-65180546c727"
      }
    }
  }
}