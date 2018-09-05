import moment from 'moment';

// Application settings
export const TIMELINE_STEP = 24 * 60 * 60 * 1000; // 1 day
export const MIN_FRAME_LENGTH_MS = TIMELINE_STEP; // 1 day
export const LOADERS = {
  HEATMAP_TILES: 'HEATMAP_TILES'
};

// Absolute maximum supported
export const TIMELINE_OVERALL_START_DATE = new Date(Date.UTC(2012, 0, 1));
export const TIMELINE_OVERALL_END_DATE = moment().subtract(3, 'days').toDate();

export const TIMELINE_DEFAULT_OUTER_START_DATE = new Date(Date.UTC(2015, 0, 1));
export const TIMELINE_DEFAULT_OUTER_END_DATE = new Date(Date.UTC(2016, 0, 1));

export const TIMELINE_DEFAULT_INNER_START_DATE = new Date(Date.UTC(2015, 0, 1));
export const TIMELINE_DEFAULT_INNER_END_DATE = new Date(Date.UTC(2015, 1, 1));

export const TIMELINE_MIN_INNER_EXTENT = 1.21e+9; // 2 weeks

export const TIMELINE_MAX_STEPS = 360; // six months
export const TIMELINE_MAX_TIME = TIMELINE_STEP * TIMELINE_MAX_STEPS; // six months
export const TIMELINE_MIN_TIME = TIMELINE_STEP; // 1 day

export const TIMELINE_SPEED_CHANGE = 2; // 2 for double and half speed
export const TIMELINE_MAX_SPEED = 16;
export const TIMELINE_MIN_SPEED = 0.03125;

export const MIN_ZOOM_LEVEL = 1;

// user can zoom up to this z level, but it doesn't guarantee availability of tiles
export const MAX_ZOOM_LEVEL = 14;

// Limit tile loading for activity layers up to this z level.
// Beyond, layer is still displayed but with coarse data from the lower zoom level
export const ACTIVITY_LAYERS_MAX_ZOOM_LEVEL_TILE_LOADING = 10;


export const MAX_AUTO_ZOOM_LONGITUDE_SPAN = 200;
export const CLUSTER_CLICK_ZOOM_INCREMENT = 1;

export const GUEST_PERMISSION_SET = [];

// for now, auth users get no special permissions, everything comes from the API
export const AUTH_PERMISSION_SET = GUEST_PERMISSION_SET;

// vessels rendering
// from this zoom level and above, render using circle style instead of heatmap
export const VESSELS_RADIAL_GRADIENT_STYLE_ZOOM_THRESHOLD = 6;
// the base radius, it can only be scaled down by the radius factor calculated on the dataset
export const VESSELS_BASE_RADIUS = 8;
// in heatmap style, defines how 'blurry' a point will look. Higher = less blur
export const VESSELS_HEATMAP_BLUR_FACTOR = 0.15;

export const VESSELS_HUES_INCREMENTS_NUM = 31; // 360 / VESSELS_HUES_INCREMENTS_NUM - 1  should give a round number
export const VESSELS_HUES_INCREMENT = 360 / (VESSELS_HUES_INCREMENTS_NUM - 1);

export const VESSELS_HEATMAP_DIMMING_ALPHA = 0.5;

// Sets what should be the discrete zoom level to load tiles, from a non-discrete
// viewport zoom values. For instance, a values of 0.5 will load z 3 with a viewport
// z of 2 (ceiling of 2 + 0.5)
// this has a direct impact on the number of points displayed on the map, thus on the
// performance of the app.
export const TILES_LOAD_ZOOM_OFFSET = 0.5;

// At which intervals should we consider showing a new frame. Impacts performance.
// Expressed in ms, for example 86400000 is 1 day (24*60*60*1000)
export const PLAYBACK_PRECISION = 86400000;
export const TIMELINE_OVERALL_START_DATE_OFFSET = Math.floor(TIMELINE_OVERALL_START_DATE / PLAYBACK_PRECISION);

// radius of vessels lookup in pixels,
// ie how large the clicked region should be for including vessels
export const VESSEL_CLICK_TOLERANCE_PX = 3.5;

// Legacy: this is only here for compatibility with pre-mapbox branch workspaces
export const COLORS = {
  orange: '#F95E5E',
  peach: '#fca26f',
  yellow: '#FBFF8B',
  green: '#abff35',
  brightGreen: '#00ff6a',
  lightBlue: '#67FBFE',
  blue: '#7D84FA',
  purple: '#bb00ff',
  pink: '#ff81e5'
};

// Legacy: this is only here for compatibility with pre-mapbox branch workspaces
export const COLOR_HUES = {
  orange: 0,
  peach: 22,
  yellow: 60,
  green: 85,
  brightGreen: 145,
  lightBlue: 182,
  blue: 236,
  purple: 284,
  pink: 312
};

export const PALETTE_COLORS = [
  { color: '#F95E5E', hue: 0 },
  { color: '#fca26f', hue: 22 },
  { color: '#FBFF8B', hue: 60 },
  { color: '#abff35', hue: 85 },
  { color: '#00ff6a', hue: 145 },
  { color: '#67FBFE', hue: 182 },
  { color: '#7D84FA', hue: 236 },
  { color: '#bb00ff', hue: 284 },
  { color: '#ff81e5', hue: 312 }
];

export const ACTIVITY_HIGHLIGHT_HUE = PALETTE_COLORS[8].hue;

export const ENCOUNTERS_VESSEL_COLOR = '#FF0000';
export const ENCOUNTERS_REEFER_COLOR = '#ffbcc6';

export const GL_TRANSPARENT = 'rgba(0,0,0,0)';

// tracks
export const TRACK_DEFAULT_COLOR = PALETTE_COLORS[8].color;
export const TRACKS_DOTS_STYLE_ZOOM_THRESHOLD = 2;

// time range options in the duration picker menu
// replace moment humanized duration: use '1 month' instead of 'one month'
// https://momentjs.com/docs/#/customization/relative-time/
moment.updateLocale('en', {
  relativeTime: {
    m: '1 minute',
    h: '1 hour',
    d: '1 day',
    M: '1 month',
    y: '1 year'
  }
});

export const DURATION_PICKER_OPTIONS = [
  moment.duration(1, 'week'),
  moment.duration(15, 'days'),
  moment.duration(1, 'month'),
  moment.duration(3, 'months')
];

export const FORMAT_DATE = 'MMM Do YYYY';
export const FORMAT_TIME = 'h:mm A';
export const FORMAT_NUM_DECIMALS = {
  distanceKm: 3,
  speedKnots: 3
};


// search
export const SEARCH_RESULTS_LIMIT = 4;
export const SEARCH_QUERY_MINIMUM_LIMIT = 3;
export const SEARCH_MODAL_PAGE_SIZE = 14;


export const DEFAULT_EMBED_SIZE = 'Small';
export const EMBED_SIZE_SETTINGS = [
  {
    name: 'Small',
    width: 600,
    height: 400
  },
  {
    name: 'Medium',
    width: 800,
    height: 600
  },
  {
    name: 'Large',
    width: 1000,
    height: 800
  }
];

export const SUBSCRIBE_DEFAULT_FREQUENCY = 'single';
export const SUBSCRIBE_SETTINGS = [
  {
    name: 'One-time report',
    value: 'single'
  },
  {
    name: 'Daily report',
    value: 'daily'
  },
  {
    name: 'Weekly report',
    value: 'weekly'
  },
  {
    name: 'Monthly report',
    value: 'monthly'
  }
];

export const MINI_GLOBE_SETTINGS = {
  viewBoxX: -75,
  viewBoxY: -75,
  viewBoxWidth: 200,
  viewBoxHeight: 200,
  svgWidth: 40,
  scale: 100,
  minZoom: 2.5
};

export const STATIC_LAYERS_CARTO_ENDPOINT = 'https://carto.globalfishingwatch.org/user/admin/api/v1/map?config=$MAPCONFIG';
export const STATIC_LAYERS_CARTO_TILES_ENDPOINT =
  'https://carto.globalfishingwatch.org/user/admin/api/v1/map/$LAYERGROUPID/{z}/{x}/{y}.mvt';

export const POLYGON_LAYERS_AREA = 'POLYGON_LAYERS_AREA';
