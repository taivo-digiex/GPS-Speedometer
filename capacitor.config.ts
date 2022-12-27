import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vdt.gpsspeedometer',
  appName: 'GPS Speedometer',
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
