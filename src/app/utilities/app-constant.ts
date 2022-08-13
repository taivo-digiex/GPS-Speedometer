import { environment } from '../../environments/environment';

const AppConstant = Object.freeze({
  DEFAULT_URLS: { GITHUB_API_URL: `${environment.github_api_url}` },

  STORAGE_KEYS: {
    UNIT: 'unit',
    ODO: 'odo',
    TRIP: 'trip',
    AVG_SPEED_TRIP: 'avg-speed-trip',
    LANGUAGE: 'language',
    TOTAL_TIME: 'total-time',
    AVG_SPEED_TOTAL_TIME: 'avg-speed-total-time',
    TOP_SPEED: 'top-speed',
    ADJUST_SPEED: 'adjust-speed',
    ENABLE_HIGH_ACCURACY: 'enable-high-accuracy',
  },

  UNIT_SYSTEM: {
    METRIC: {
      UNIT: 'metric',
      SPEED_UNIT: 'km/h',
      METER_UNIT: 'm',
      KM_UNIT: 'km',
    },
    IMPERIAL: {
      UNIT: 'imperial',
      SPEED_UNIT: 'mph',
      FEET_UNIT: 'ft',
      MILE_UNIT: 'mi',
    },
  },

  LANGUAGE: {
    VI: 'vi',
    EN: 'en',
  },
});

export default AppConstant;
