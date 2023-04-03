import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vdt.gpsdashboard',
  appName: 'GPS Dashboard',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 5000,
      launchAutoHide: false,
      backgroundColor: '#000000',
      androidScaleType: 'CENTER',
    },
  },
};

export default config;
