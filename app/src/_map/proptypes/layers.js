import PropTypes from 'prop-types';

export const heatmapLayerTypes = {
  id: PropTypes.string.isRequired,
  tilesetId: PropTypes.string,
  subtype: PropTypes.string,
  visible: PropTypes.bool,
  hue: PropTypes.number,
  opacity: PropTypes.number,
  filters: PropTypes.arrayOf(PropTypes.shape({
    // hue overrides layer hue if set
    hue: PropTypes.number,
    // filterValues is a dictionary in which each key is a filterable field,
    // and values is an array of all possible values (OR filter)
    // ie: filterValues: { category: [5, 6] }
    filterValues: PropTypes.object
  })),
  header: PropTypes.shape({
    endpoints: PropTypes.object,
    isPBF: PropTypes.bool,
    colsByName: PropTypes.object,
    temporalExtents: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    temporalExtentsLess: PropTypes.bool
  }).isRequired,
  interactive: PropTypes.bool
};

export const basemapLayerTypes = {
  id: PropTypes.string,
  visible: PropTypes.bool
};

export const staticLayerTypes = {
  id: PropTypes.string.isRequired,
  // TODO MAP MODULE Is that needed and if so why
  visible: PropTypes.bool,
  selectedPolygons: PropTypes.shape({
    field: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.string)
  }),
  opacity: PropTypes.number,
  color: PropTypes.string,
  showLabels: PropTypes.bool,
  interactive: PropTypes.bool,
  isCustom: PropTypes.bool,
  subtype: PropTypes.oneOf([undefined, 'geojson', 'raster']),
  url: PropTypes.string,
  data: PropTypes.object,
  gl: PropTypes.object
};

