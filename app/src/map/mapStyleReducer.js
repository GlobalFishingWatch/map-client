import GL_STYLE from 'map/gl-styles/style.json';
import { fromJS } from 'immutable';
import uniq from 'lodash/uniq';
import {
  UPDATE_MAP_STYLE,
  MARK_CARTO_LAYERS_AS_INSTANCIATED
} from 'map/mapStyleActions';

const attributions = uniq(Object.keys(GL_STYLE.sources)
  .map(sourceKey => GL_STYLE.sources[sourceKey].attribution)
  .filter(source => source !== undefined)
);

const initialState = {
  mapStyle: fromJS(GL_STYLE),
  cartoLayersInstanciated: [],
  attributions
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_MAP_STYLE : {
      return { ...state, mapStyle: action.payload };
    }
    case MARK_CARTO_LAYERS_AS_INSTANCIATED : {
      const cartoLayersInstanciated = [...state.cartoLayersInstanciated, ...action.payload];
      return { ...state, cartoLayersInstanciated };
    }
    default:
      return state;
  }
}
