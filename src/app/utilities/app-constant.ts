import { environment } from '../../environments/environment';

const AppConstant = Object.freeze({
  defaultUrl: { gitHubApiUrl: `${environment.gitHubApiUrl}` },

  storageKeys: {
    unit: 'unit',
    odo: 'odo',
    trip: 'trip',
    avgSpeedTrip: 'avg-speed-trip',
    language: 'language',
    totalTime: 'total-time',
    avgSpeedTotalTime: 'avg-speed-total-time',
    topSpeed: 'top-speed',
    adjustSpeed: 'adjust-speed',
    enableHighAccuracy: 'enable-high-accuracy',
  },

  unitSystem: {
    metric: {
      unit: 'metric',
      speedUnit: 'km/h',
      meterUnit: 'm',
      kilometerUnit: 'km',
    },
    imperial: {
      unit: 'imperial',
      speedUnit: 'mph',
      feetUnit: 'ft',
      mileUnit: 'mi',
    },
  },

  language: {
    vi: 'vi',
    en: 'en',
  },
});

export default AppConstant;
