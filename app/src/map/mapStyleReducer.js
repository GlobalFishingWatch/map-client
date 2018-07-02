import GL_STYLE from 'map/gl-styles/style.json';
import { fromJS } from 'immutable';
import {
  UPDATE_MAP_STYLE
} from 'map/mapStyleActions';

const initialState = {
  mapStyle: fromJS(GL_STYLE)
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
