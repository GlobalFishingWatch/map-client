import moment from 'moment';

// Application settings
export const TIMELINE_STEP = 24 * 60 * 60 * 1000; // 1 day
export const MIN_FRAME_LENGTH_MS = TIMELINE_STEP / 4; // 1 day

// end date is today minus 3 days
export const TIMELINE_OVERALL_START_DATE = new Date(Date.UTC(2012, 0, 1));
export const TIMELINE_OVERALL_END_DATE = moment().subtract(3, 'days').toDate();

export const TIMELINE_MAX_STEPS = 190; // six months
export const TIMELINE_MAX_TIME = TIMELINE_STEP * TIMELINE_MAX_STEPS; // six months

export const MIN_ZOOM_LEVEL = 2;
export const MAX_ZOOM_LEVEL = 12;

export const VESSELS_ENDPOINT_KEYS = [
  'category',
  'datetime',
  'latitude',
  'longitude',
  'series',
  'seriesgroup',
  'sigma',
  'weight'
];

// vessels rendering
// from this zoom level and above, render using circle style instead of heatmap
export const VESSELS_HEATMAP_STYLE_ZOOM_THRESHOLD = 6;
// the base radius, it can only be scaled down by the radius factor calculated on the dataset
export const VESSELS_BASE_RADIUS = 8;
// the minimum multiplicator for vessels radius. Multiply by VESSELS_BASE_RADIUS to get the final radius in px
export const VESSELS_MINIMUM_RADIUS_FACTOR = 0.25;
// in heatmap style, defines how 'blurry' a point will look. Higher = less blur
export const VESSELS_HEATMAP_BLUR_FACTOR = 0.15;
// in heatmap style, defines color stops of the radial gradient
export const VESSELS_HEATMAP_COLOR_STOPS = [
  { stop: 0, color: 'rgba(136, 251, 255, 1)' },
  { stop: 1, color: 'rgba(48, 149, 255, 0)' }
];
// color of circles in circles rendering mode (more zoomed in)
export const VESSELS_CIRCLES_COLOR = 'rgba(255, 255, 255, 1)';
export const VESSELS_MINIMUM_OPACITY = 0.5;

// tracks
export const SHOW_OUTER_TRACK_BELOW_NUM_POINTS = 30000;
export const TRACK_OVER_COLOR = {
  strokeStyle: 'rgba(255, 255, 255, 1)',
  lineWidth: 2
};
export const TRACK_MATCH_COLOR = {
  strokeStyle: 'rgba(165, 247, 253, 1)',
  lineWidth: 2
};
export const TRACK_OUT_OF_INNER_EXTENT_COLOR = {
  strokeStyle: 'rgba(165, 247, 253, .4)',
  lineWidth: 1
};

// At which intervals should we consider showing a new frame. Impacts performance.
// Expressed in ms, for example 86400000 is 1 day (24*60*60*1000)
export const PLAYBACK_PRECISION = 86400000;

// radius of vessels lookup in pixels,
// ie how large the clicked region should be for including vessels
export const VESSEL_CLICK_TOLERANCE_PX = 2;

// time range options in the duration picker menu
export const DURATION_PICKER_OPTIONS = [
  moment.duration(1, 'week'),
  moment.duration(15, 'days'),
  moment.duration(1, 'month'),
  moment.duration(3, 'months')
];

export const LAYER_TYPES = {
  CartoDBAnimation: 'CartoDBAnimation',
  CartoDBBasemap: 'CartoDBBasemap',
  ClusterAnimation: 'ClusterAnimation'
};

export const FLAGS = {
  0: 'AD',
  1: 'AE',
  2: 'AF',
  3: 'AG',
  4: 'AI',
  5: 'AL',
  6: 'AM',
  7: 'AO',
  8: 'AR',
  9: 'AS',
  10: 'AT',
  11: 'AU',
  12: 'AW',
  13: 'AZ',
  14: 'BA',
  15: 'BB',
  16: 'BD',
  17: 'BE',
  18: 'BF',
  19: 'BG',
  20: 'BH',
  21: 'BI',
  22: 'BJ',
  23: 'BM',
  24: 'BN',
  25: 'BO',
  26: 'BR',
  27: 'BS',
  28: 'BT',
  29: 'BW',
  30: 'BY',
  31: 'BZ',
  32: 'CA',
  33: 'CC',
  34: 'CD',
  35: 'CF',
  36: 'CH',
  37: 'CI',
  38: 'CK',
  39: 'CL',
  40: 'CM',
  41: 'CN',
  42: 'CO',
  43: 'CR',
  44: 'CU',
  45: 'CV',
  46: 'CX',
  47: 'CY',
  48: 'CZ',
  49: 'DE',
  50: 'DJ',
  51: 'DK',
  52: 'DM',
  53: 'DO',
  54: 'DZ',
  55: 'EC',
  56: 'EE',
  57: 'EG',
  58: 'ER',
  59: 'ES',
  60: 'ET',
  61: 'FI',
  62: 'FJ',
  63: 'FK',
  64: 'FM',
  65: 'FO',
  66: 'FR',
  67: 'GA',
  68: 'GB',
  69: 'GD',
  70: 'GE',
  71: 'GF',
  72: 'GH',
  73: 'GI',
  74: 'GL',
  75: 'GM',
  76: 'GN',
  77: 'GP',
  78: 'GQ',
  79: 'GR',
  80: 'GT',
  81: 'GY',
  82: 'HK',
  83: 'HN',
  84: 'HR',
  85: 'HT',
  86: 'HU',
  87: 'ID',
  88: 'IE',
  89: 'IL',
  90: 'IN',
  91: 'IQ',
  92: 'IR',
  93: 'IS',
  94: 'IT',
  95: 'JM',
  96: 'JO',
  97: 'JP',
  98: 'KE',
  99: 'KG',
  100: 'KH',
  101: 'KI',
  102: 'KM',
  103: 'KN',
  104: 'KR',
  105: 'KW',
  106: 'KY',
  107: 'KZ',
  108: 'LA',
  109: 'LB',
  110: 'LC',
  111: 'LI',
  112: 'LK',
  113: 'LR',
  114: 'LS',
  115: 'LT',
  116: 'LU',
  117: 'LV',
  118: 'LY',
  119: 'MA',
  120: 'MC',
  121: 'MD',
  122: 'ME',
  123: 'MG',
  124: 'MH',
  125: 'MK',
  126: 'ML',
  127: 'MM',
  128: 'MN',
  129: 'MO',
  130: 'MP',
  131: 'MQ',
  132: 'MR',
  133: 'MS',
  134: 'MT',
  135: 'MU',
  136: 'MV',
  137: 'MW',
  138: 'MX',
  139: 'MY',
  140: 'MZ',
  141: 'NA',
  142: 'NC',
  143: 'NE',
  144: 'NG',
  145: 'NI',
  146: 'NL',
  147: 'NO',
  148: 'NP',
  149: 'NR',
  150: 'NU',
  151: 'NZ',
  152: 'OM',
  153: 'PA',
  154: 'PE',
  155: 'PF',
  156: 'PG',
  157: 'PH',
  158: 'PK',
  159: 'PL',
  160: 'PM',
  161: 'PN',
  162: 'PR',
  163: 'PS',
  164: 'PT',
  165: 'PW',
  166: 'PY',
  167: 'QA',
  168: 'RE',
  169: 'RO',
  170: 'RS',
  171: 'RU',
  172: 'RW',
  173: 'SA',
  174: 'SB',
  175: 'SC',
  176: 'SD',
  177: 'SE',
  178: 'SEE',
  179: 'SG',
  180: 'SH',
  181: 'SI',
  182: 'SK',
  183: 'SL',
  184: 'SM',
  185: 'SN',
  186: 'SO',
  187: 'SR',
  188: 'SS',
  189: 'ST',
  190: 'SV',
  191: 'SY',
  192: 'SZ',
  193: 'TC',
  194: 'TD',
  195: 'TG',
  196: 'TH',
  197: 'TJ',
  198: 'TM',
  199: 'TN',
  200: 'TO',
  201: 'TR',
  202: 'TT',
  203: 'TV',
  204: 'TW',
  205: 'TZ',
  206: 'UA',
  207: 'UG',
  208: 'US',
  209: 'UY',
  210: 'UZ',
  211: 'VC',
  212: 'VE',
  213: 'VG',
  214: 'VI',
  215: 'VN',
  216: 'VU',
  217: 'WF',
  218: 'WS',
  219: 'YE',
  220: 'ZA',
  221: 'ZM',
  222: 'ZW'
};
