import { environment } from '../../environments/environment';

const AppConstant = Object.freeze({
  DEFAULT_URLS: { GITHUB_API_URL: `${environment.github_api_url}` },

  STORAGE_KEYS: {
    UNIT: 'unit',
    ODO: 'odo',
    TRIP: 'trip',
    LANGUAGE: 'language',
    TOTAL_TIME: 'total-time',
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
