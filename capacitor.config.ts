import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vizualx.admin',
  appName: 'VizualX Admin',
  webDir: 'out',
  server: {
    url: 'https://www.vizualx.online/admin',
    cleartext: true,
  },
  android: {
    backgroundColor: '#101010',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1300,
      launchAutoHide: true,
      backgroundColor: '#101010',
      androidSplashResourceName: 'splash_vizualx',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#101010',
      overlaysWebView: false,
    },
  },
};

export default config;
