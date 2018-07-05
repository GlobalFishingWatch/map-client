import GL_STYLE from 'map/gl-styles/style.json';
import { fromJS } from 'immutable';
import uniq from 'lodash/uniq';
import {
  UPDATE_MAP_STYLE
} from 'map/mapStyleActions';

const attributions = uniq(Object.keys(GL_STYLE.sources)
  .map(sourceKey => GL_STYLE.sources[sourceKey].attribution)
  .filter(source => source !== undefined)
);

const initialState = {
  mapStyle: fromJS(GL_STYLE),
  attributions
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_MAP_STYLE : {
      return { ...state, mapStyle: action.payload };
    }
    default:
      return state;
  }
}
