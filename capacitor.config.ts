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

    LocalNotifications: {
      // smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#FFFFFF',
      // sound: 'beep.wav',
    },
  },
};

export default config;
