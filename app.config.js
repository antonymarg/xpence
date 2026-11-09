let name, packageName;
const appVariant = process.env.APP_VARIANT ?? "development";

switch (appVariant) {
  case "development":
    name = 'Xpence (dev)'
    packageName = 'com.antonismargaronis.dev.xpence'
    break;
  case "preview":
    name = 'Xpence (preview)'
    packageName = 'com.antonismargaronis.preview.xpence'
    break;
  case "production":
    name = 'Xpence'
    packageName = 'com.antonismargaronis.xpence'
    break;
  default:
    throw new Error(`Unsupported APP_VARIANT: ${appVariant}`);
}

export default {
  "expo": {
    "name": name,
    "slug": "xpence-app",
    "version": "0.0.3",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "xpence",
    "userInterfaceStyle": "automatic",
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.anonymous.xpence"
    },
    "android": {
      "predictiveBackGestureEnabled": false,
      "package": packageName,
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "*antonismargaronis.com",
              "pathPrefix": "/xpence"
            }
          ],
          "category": [
            "BROWSABLE",
            "DEFAULT"
          ]
        }
      ]
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
      "expo-localization"
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