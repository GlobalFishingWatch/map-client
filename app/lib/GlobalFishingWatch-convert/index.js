// the minimum multiplier for vessels radius. Multiply by VESSELS_BASE_RADIUS to get the final radius in px
const VESSELS_MINIMUM_RADIUS_FACTOR = 0.25;

const VESSELS_MINIMUM_OPACITY = 0.5;

// TODO duplicated constants with client, find a way to share

// from this zoom level and above, render using circle style instead of heatmap
const VESSELS_HEATMAP_STYLE_ZOOM_THRESHOLD = 6;

// At which intervals should we consider showing a new frame. Impacts performance.
// Expressed in ms, for example 86400000 is 1 day (24*60*60*1000)
const PLAYBACK_PRECISION = 86400000;
const TIMELINE_OVERALL_START_DATE = new Date(Date.UTC(2012, 0, 1));
const TIMELINE_OVERALL_START_DATE_OFFSET = Math.floor(TIMELINE_OVERALL_START_DATE / PLAYBACK_PRECISION);


/**
 * From a timestamp in ms returns a time with the precision set in Constants.
 * @param timestamp
 */
const getTimeAtPrecision = timestamp => Math.floor(timestamp / PLAYBACK_PRECISION);


module.exports = {
  /**
   * Convert raw lat/long coordinates to project world coordinates in pixels
   * @param lat latitude in degrees
   * @param lon longitude in degrees
   */
  latLonToWorldCoordinates: (lat, lon) => {
    const worldX = (lon + 180) / 360 * 256; // eslint-disable-line
    const worldY = ((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2) * 256;  // eslint-disable-line
    return {
      worldX,
      worldY
    };
  },

  sigmaToRadius: (sigma, zoomFactorRadiusRenderingMode, zoomFactorRadius) => {
    let radius = zoomFactorRadiusRenderingMode * Math.max(0.8, 2 + Math.log(sigma * zoomFactorRadius));
    radius = Math.max(VESSELS_MINIMUM_RADIUS_FACTOR, radius);
    return radius;
  },

  weightToOpacity: (weight, zoomFactorOpacity) => {
    let opacity = 3 + Math.log(weight * zoomFactorOpacity);
    // TODO quick hack to avoid negative values, check why that happens
    opacity = Math.max(0, opacity);
    opacity = 3 + Math.log(opacity);
    opacity = 0.1 + (0.2 * opacity);
    opacity = Math.min(1, Math.max(VESSELS_MINIMUM_OPACITY, opacity));
    return opacity;
  },

  getZoomFactorOpacity: zoom => ((zoom - 1) ** 3.5) / 1000,
  getZoomFactorRadiusRenderingMode: zoom => ((zoom < VESSELS_HEATMAP_STYLE_ZOOM_THRESHOLD) ? 0.3 : 0.15),
  getZoomFactorRadius: zoom => (zoom - 1) ** 2.5,

  /**
   * From a timestamp in ms returns a time with the precision set in Constants, offseted at the
   * beginning of available time (outerStart)
   * @param timestamp
   */
  getOffsetedTimeAtPrecision: timestamp => Math.max(0, getTimeAtPrecision(timestamp) - TIMELINE_OVERALL_START_DATE_OFFSET)
}
