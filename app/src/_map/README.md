# GlobalFishingWatch Map Module

This is a JavaScript module used to display and load fishing activity and fishing-related layers on a map, used in various GFW projects:
- <a href="https://github.com/GlobalFishingWatch/map-client">GlobalFishingWatch main client</a>
- <a href="https://github.com/GlobalFishingWatch/data -portal">Fishing events data portal</a>
- Upcoming GFW projects: labeling tool, carrier database portal, etc

It is usable as a React component (a wrapper around `react-map-gl`).

This module is responsible for:
- displaying a Mapbox GL map, including panning, zooming, etc. Managing map viewport. Managing Mapbox GL JSON style;
- loading, displaying, and animating Activity Layers (layers with a time dimension):
  - Vessel Tracks
  - Heatmap layers (AIS/VMS fishing activity, VIIRS, encounters/events, etc) and tiles loading
- applying time filters to Activity layers;
- applying filter groups to Heatmap layers;
- loading and displaying Static layers and Basemap layers (native Mapbox layers) through GL JSON style;
- dealing with user interaction on the map (highlight on hover and emitting events on hover/click).


This module does not deal with:
- workspaces import/export;
- authentication;
- layer headers;
- UI (such as UI to set layer properties, filters, or timebar, see <a href="https://github.com/GlobalFishingWatch/map-timebar-module">Timebar repo</a>);
- GFW main client features: reporting, vessel search, etc.

# API

## `token`

String. Mandatory.
Used to load heatmap layer tiles and tracks.

## `viewport`

Object. Allows setting map position.

### `zoom`

Number.

### `center`

Array of [latitude, longitude]

## `tracks`

Array of `track`. Sets the tracks to load and display (loading/displaying is triggered by diffing incoming array with existing array).

### `track.id`

String. Mandatory. Identifies track uniquely, should be UVI or seriesgroup (deprecated).

### `track.segmentId`

[NOT IMPLEMENTED] [DEPRECATED] String. Formerly `series`

### `track.layerUrl`

String. Mandatory. Base URL template to load tracks. TODO TEMPLATE?

### `track.layerTemporalExtents`

Array of Arrays of Unix timestamps. For layers that are split across time ramges, allow mapping between `loadTemporalExtents` and the actual data loaded. Specifies time ranges in the form `[[]]` TODO

### `track.highlighted`

Boolean. When set to true, the whole track will render in white (notwithstanding `highlightTemporalExtents`).

### `track.color`

TODO

## `heatmapLayers`

Array of `heatmapLayer`.

### `heatmapLayer.id`

String. Mandatory. Identifies layer uniquely, can be workspace id for instance.

### `heatmapLayer.tilesetId`

String. Mandatory. Identifies tileset uniquely

### `heatmapLayer.subtype`

String. Allowed values are: `encounters`.

### `heatmapLayer.hue`

A Number between 0 and 360. Colors for heatmap layers can only be expressed as hues (degrees in the color wheel, saturation and luminance being hardcoded) for internal technical reasons.

### `heatmapLayer.opacity`

A Number between 0 and 1.

### `heatmapLayer.visible`

Boolean.

### `heatmapLayer.header`

Object. Mandatory. Must be passed as is - mandatory fields are: 

  - `endpoints` PropTypes.object,
  - `isPBF` PropTypes.bool,
  - `colsByName` PropTypes.object,
  - `temporalExtents` PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  - `temporalExtentsLess` PropTypes.bool

## `temporalExtent`

Tuple of Dates (`[start, end]`). Mandatory. Acts as a display temporal filter for Activity Layers (Heatmap and Tracks), used for time animation.

## `loadTemporalExtent`

Tuple of Dates (`[start, end]`). Mandatory. Specifies tilesets that needs to be loaded for Activity layers that are split by time range (layer with `temporalExtents`).

## `highlightTemporalExtent`

Tuple of Dates (`[start, end]`). Track portions between `start` and `end` will be rendered in white.

## `staticLayers`

Array of `staticLayer`.

### `staticLayer.id`

String. Mandatory. Identifies layer uniquely, should normally be a Mapbox GL `source` id.

### `staticLayer.visible`

TODO

### `staticLayer.opacity`

Number TODO

### `staticLayer.color`

String TODO

### `staticLayer.showLabels`

Boolean. Display the associated labels layer, if available.

### `staticLayer.selectedPolygons`

[NOT IMPLEMENTED] Array of Strings representing polygon ids. 


## `basemapLayers`

TODO

  basemapLayers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    visible: PropTypes.bool
  })),


## `interactiveLayerIds`

[NOT IMPLEMENTED] Layer of Strings. Allows setting interaction only on selected layer ids (Static or Heatmap). Useful for reporting (disable all layers except one). If not set, all layers are interactive and 'compete' for interaction. 


## `customLayers`

[NOT IMPLEMENTED] TODO

## `filters`

[NOT IMPLEMENTED] TODO

## `hoverPopup`

Object. Sets properties to display a native popup on hover. Popup appears if set.

### `hoverPopup.content`

React Node. Mandatory. DOM Node to display inside popup.

### `hoverPopup.latitude`

Number. Mandatory. Latitude for anchor point. 

### `hoverPopup.longitude`

Number. Mandatory. Longitude for anchor point. 


## `clickPopup`

Object. Sets properties to display a native popup on click. Popup appears if set.

### `clickPopup.content`

React Node. Mandatory. DOM Node to display inside popup.

### `clickPopup.latitude`

Number. Mandatory. Latitude for anchor point. 

### `clickPopup.longitude`

Number. Mandatory. Longitude for anchor point. 

## `onViewportChange`

Function. TODO

## `onLoadStart`

Function. TODO

## `onLoadComplete`

Function. TODO

## `onClick`

Function. TODO

## `onHover`

Function. TODO

## `onAttributionsChange`

Function. TODO



