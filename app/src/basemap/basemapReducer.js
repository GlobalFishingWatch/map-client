import GL_STYLE from 'map/gl-styles/style.json';
import {
  INIT_BASEMAP,
  UPDATE_BASEMAP_LAYER
} from 'basemap/basemapActions';

const initialState = {
  basemapLayers: GL_STYLE.metadata['gfw:basemap-layers'].map(l => ({ ...l, basemap: true, added: true }))
};

export default function (state = initialState, action) {
  switch (action.type) {
    case INIT_BASEMAP : {
      const { workspaceBasemap, workspaceBasemapOptions } = action.payload;
      const basemapLayers = [...state.basemapLayers];

      // Mapbox branch compatibility:
      // 'satellite' was name 'hybrid'
      // 'Deep Blue' and 'High Contrast' basemaps have been removed, fallback to North Star
      // TODO This should move to workspace realm
      let finalBasemapId = (workspaceBasemap === 'hybrid') ? 'satellite' : workspaceBasemap;
      if (basemapLayers.find(b => b.id === finalBasemapId) === undefined) {
        finalBasemapId = 'north-star';
      }

      basemapLayers.forEach((basemapLayer) => {
        const hasWorkspaceBasemapOption = workspaceBasemapOptions.indexOf(basemapLayer.id) > -1;
        if (
          basemapLayer.id === finalBasemapId ||
          hasWorkspaceBasemapOption
        ) {
          basemapLayer.visible = true;
        }
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

