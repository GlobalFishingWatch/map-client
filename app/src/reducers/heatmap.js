import uniq from 'lodash/uniq';
import {
  INIT_HEATMAP_LAYERS,
  UPDATE_HEATMAP_LAYER_TEMPORAL_EXTENTS_LOADED_INDICES,
  ADD_HEATMAP_LAYER,
  REMOVE_HEATMAP_LAYER,
  ADD_REFERENCE_TILE,
  REMOVE_REFERENCE_TILE,
  UPDATE_HEATMAP_TILES,
  HIGHLIGHT_VESSELS
} from '../actions';

const initialState = {
  // a dict of heatmap layers (key is layer id)
  // each containing url, tiles, visibleTemporalExtentsIndices
  heatmapLayers: {},
  // store a list of tiles currently visible in the map
  // those are necessary when adding a new layer to know which tiles need to be loaded
  referenceTiles: [],
  highlightedVessels: { isEmpty: true }
};

window.export = function () {
  const layer = window.layer;
  const g = {
    type: 'FeatureCollection',
    features: []
  };
  layer.tiles.forEach((tile) => {
    // const frames = tile.data.slice(0, 1500);
    const frames = tile.data;
    frames.forEach((frame, frameIndex) => {
      for (let i = 0; i < frame.latitude.length; i++) {
        const pt = {
          type: 'Feature',
          properties: {
            t: frameIndex,
            category: frame.category[i],
            opacity: frame.opacity[i],
            radius: frame.radius[i],
            series: frame.series[i],
            seriesUid: frame.seriesUid[i],
            seriesgroup: frame.seriesgroup[i],
            worldX: frame.worldX[i],
            worldY: frame.worldY[i]
          },
          geometry: {
            type: 'Point',
            coordinates: [
              frame.longitude[i],
              frame.latitude[i]
            ]
          }
        };
        g.features.push(pt);
      }
    });
  });
  console.log(g);
  const blob = new Blob([JSON.stringify(g)], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'vessels.json');
};

export default function (state = initialState, action) {
  switch (action.type) {
    case INIT_HEATMAP_LAYERS: {
      return Object.assign({}, state, { heatmapLayers: action.payload });
    }

    case UPDATE_HEATMAP_LAYER_TEMPORAL_EXTENTS_LOADED_INDICES: {
      const heatmapLayers = state.heatmapLayers;
      let indices = heatmapLayers[action.payload.layerId].visibleTemporalExtentsIndices;
      indices = uniq(indices.concat(action.payload.diff));
      heatmapLayers[action.payload.layerId].visibleTemporalExtentsIndices = indices;
      return Object.assign({}, state, heatmapLayers);
    }

    case ADD_HEATMAP_LAYER: {
      const heatmapLayers = Object.assign({}, state.heatmapLayers, {
        [action.payload.layerId]: {
          url: action.payload.url,
          tiles: []
        }
      });
      return Object.assign({}, state, { heatmapLayers });
    }

    case REMOVE_HEATMAP_LAYER: {
      const heatmapLayers = Object.assign({}, state.heatmapLayers);
      delete heatmapLayers[action.payload.layerId];
      return Object.assign({}, state, { heatmapLayers });
    }

    case ADD_REFERENCE_TILE: {
      return Object.assign({}, state, { referenceTiles: [
        ...state.referenceTiles,
        action.payload
      ] });
    }

    case REMOVE_REFERENCE_TILE: {
      const index = state.referenceTiles.findIndex(tile => tile.uid === action.payload);
      return Object.assign({}, state, { referenceTiles: [
        ...state.referenceTiles.slice(0, index),
        ...state.referenceTiles.slice(index + 1)]
      });
    }

    // TODO handle adding layers

    case UPDATE_HEATMAP_TILES: {
      // fake immutable
      const newHeatmapLayers = action.payload;
      const heatmapLayers = {};
      Object.keys(newHeatmapLayers).forEach((layerId) => {
        heatmapLayers[layerId] = newHeatmapLayers[layerId];
      });
      window.layer = heatmapLayers.fishing;
      return Object.assign({}, state, { heatmapLayers });
    }

    case HIGHLIGHT_VESSELS: {
      return Object.assign({}, state, { highlightedVessels: action.payload });
    }

    default:
      return state;
  }
}
