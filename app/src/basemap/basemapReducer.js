import GL_STYLE from 'map/gl-styles/style.json';
import {
  UPDATE_BASEMAP_LAYERS,
  UPDATE_BASEMAP_LAYER
} from 'basemap/basemapActions';

const initialState = {
  basemapLayers: GL_STYLE.metadata['gfw:basemap-layers'].map(l => ({ ...l, basemap: true, added: true }))
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_BASEMAP_LAYERS : {
      const basemapLayers = [...state.basemapLayers];
      Object.keys(action.payload).forEach((updateKey) => {
        const layer = basemapLayers.find(l => l.id === updateKey);
        layer.visible = action.payload[updateKey];
      });
      return { ...state, basemapLayers };
    }
    case UPDATE_BASEMAP_LAYER : {
      const basemapLayers = [...state.basemapLayers];
      const layer = basemapLayers.find(l => l.id === action.payload.id);

      // set all non optional basemaps to invisible
      if (layer.isOption !== true) {
        basemapLayers.filter(l => l.isOption !== true).forEach((l) => { l.visible = false; });
      }
      layer.visible = action.payload.visible;

      return { ...state, basemapLayers };
    }
    default:
      return state;
  }
}

