const initialState = {
  latitude: 0,
  longitude: 0,
  zoom: 3,
  bearing: 0,
  pitch: 0
};

export default function (state = initialState, action) {
  switch (action.type) {
    // case SET_MOUSE_LAT_LONG: {
    //   const newState = Object.assign({}, state);
    //   newState.mouseLatLong = {
    //     lat: action.payload.lat,
    //     long: action.payload.long
    //   };
    //
    //   return newState;
    // }

    default:
      return state;
  }
}
