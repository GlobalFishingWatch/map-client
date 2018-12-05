// Application settings
export const TIMELINE_STEP = 24 * 60 * 60 * 1000; // 1 day
export const MIN_FRAME_LENGTH_MS = TIMELINE_STEP; // 1 day

// vessels rendering
// from this zoom level and above, render using circle style instead of heatmap
export const VESSELS_RADIAL_GRADIENT_STYLE_ZOOM_THRESHOLD = 6;
// the base radius, it can only be scaled down by the radius factor calculated on the dataset
export const VESSELS_BASE_RADIUS = 8;
// in heatmap style, defines how 'blurry' a point will look. Higher = less blur
export const VESSELS_HEATMAP_BLUR_FACTOR = 0.15;

export const ACTIVITY_HIGHLIGHT_HUE = 312;

export const VESSELS_HEATMAP_DIMMING_ALPHA = 0.5;

export const TRACKS_DOTS_STYLE_ZOOM_THRESHOLD = 2;

export const MAX_SPRITES_PER_LAYER = 200000;

// interaction
// radius of vessels lookup in pixels,
// ie how large the clicked region should be for including vessels
export const VESSEL_CLICK_TOLERANCE_PX = 10;

export const CLUSTER_CLICK_ZOOM_INCREMENT = 1;

export const MIN_ZOOM_LEVEL = 1;
// user can zoom up to this z level, but it doesn't guarantee availability of tiles
export const MAX_ZOOM_LEVEL = 14;


// data
// Limit tile loading for activity layers up to this z level.
// Beyond, layer is still displayed but with coarse data from the lower zoom level
export const ACTIVITY_LAYERS_MAX_ZOOM_LEVEL_TILE_LOADING = 10;

// Sets what should be the discrete zoom level to load tiles, from a non-discrete
// viewport zoom values. For instance, a values of 0.5 will load z 3 with a viewport
// z of 2 (ceiling of 2 + 0.5)
// this has a direct impact on the number of points displayed on the map, thus on the
// performance of the app.
export const TILES_LOAD_ZOOM_OFFSET = 0.5;

export const STATIC_LAYERS_CARTO_ENDPOINT = 'https://carto.globalfishingwatch.org/user/admin/api/v1/map?config=$MAPCONFIG';
export const STATIC_LAYERS_CARTO_TILES_ENDPOINT =
  'https://carto.globalfishingwatch.org/user/admin/api/v1/map/$LAYERGROUPID/{z}/{x}/{y}.mvt';

