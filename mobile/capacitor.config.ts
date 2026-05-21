import type { CapacitorConfig } from "@capacitor/cli";

/** URL production — app native load web đã deploy (form, API hoạt động đầy đủ) */
const APP_URL = process.env.HOMECARE365_APP_URL ?? "https://www.homecare365.vn";

const config: CapacitorConfig = {
  appId: "vn.homecare365.app",
  appName: "HomeCare365",
  webDir: "www",
  server: {
    url: APP_URL,
    androidScheme: "https",
    cleartext: false,
    allowNavigation: [
      "homecare365.vn",
      "www.homecare365.vn",
      "*.homecare365.vn",
      "script.google.com",
      "*.google.com",
      "accounts.google.com",
    ],
  },
  android: {
    allowMixedContent: false,
    backgroundColor: "#0047ab",
  },
  ios: {
    backgroundColor: "#0047ab",
    contentInset: "automatic",
    scheme: "HomeCare365",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#0047ab",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#0047ab",
    },
  },
};

export default config;
