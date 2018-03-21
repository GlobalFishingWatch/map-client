import {
  SET_VIEWPORT
} from 'map/mapViewportActions';

const initialState = {
  latitude: 0,
  longitude: 0,
  zoom: 3,
  bearing: 0,
  pitch: 0,
  width: 1000,
  height: 800
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_VIEWPORT: {
      return { state, ...action.payload };
    }

    default:
      return state;
  }
}
