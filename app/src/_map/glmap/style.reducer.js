import { fromJS } from 'immutable';
import uniq from 'lodash/uniq';
import GL_STYLE from './gl-styles/style.json';
import {
  SET_MAP_STYLE,
  MARK_CARTO_LAYERS_AS_INSTANCIATED,
  INIT_MAP_STYLE,
  SET_STATIC_LAYERS,
  SET_BASEMAP_LAYERS
} from './style.actions';

const attributions = uniq(Object.keys(GL_STYLE.sources)
  .map(sourceKey => GL_STYLE.sources[sourceKey].attribution)
  .filter(source => source !== undefined)
);

const initialState = {
  mapStyle: fromJS(GL_STYLE),
  cartoLayersInstanciated: [],
  staticLayers: [],
  basemapLayers: [],
  attributions
};

export default function (state = initialState, action) {
  switch (action.type) {
    case INIT_MAP_STYLE : {
      const newMapStyle = state.mapStyle.setIn(['glyphs'], action.payload.glyphsPath);
      return { ...state, mapStyle: newMapStyle };
    }
    case SET_MAP_STYLE : {
      return { ...state, mapStyle: action.payload };
    }
    case SET_STATIC_LAYERS : {
      return { ...state, staticLayers: action.payload };
    }
    case SET_BASEMAP_LAYERS : {
      return { ...state, basemapLayers: action.payload };
    }
    case MARK_CARTO_LAYERS_AS_INSTANCIATED : {
      const cartoLayersInstanciated = [...state.cartoLayersInstanciated, ...action.payload];
      return { ...state, cartoLayersInstanciated };
    }
    default:
      return state;
  }
}
