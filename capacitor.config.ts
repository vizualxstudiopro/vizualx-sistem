import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vizualx.admin',
  appName: 'VizualX Admin',
  webDir: 'out',
  server: {
    url: 'https://www.vizualx.online/admin',
    cleartext: true,
  },
};

export default config;
