import { environment } from '../../environments/environment';

const AppConstant = Object.freeze({
  defaultUrl: { gitHubApiUrl: `${environment.gitHubApiUrl}` },

  storageKeys: {
    unit: 'unit',
    odo: 'odo',
    trip: 'trip',
    averageSpeedTrip: 'averageSpeedTrip',
    language: 'language',
    totalTime: 'totalTime',
    averageSpeedTotalTime: 'averageSpeedTotalTime',
    topSpeed: 'topSpeed',
    speedCorrection: 'speedCorrection',
    enableHighAccuracy: 'enableHighAccuracy',
  },

  backUpKeys: {
    odo: 'odo',
    trip: 'trip',
    averageSpeedTrip: 'averageSpeedTrip',
    totalTime: 'totalTime',
    averageSpeedTotalTime: 'averageSpeedTotalTime',
    topSpeed: 'topSpeed',
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
