const initialState = {

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
