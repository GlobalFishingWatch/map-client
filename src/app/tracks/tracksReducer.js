import { GEOJSON_TRACK_LOADED } from 'app/tracks/tracksActions'

const initialState = {
  tracks: {},
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GEOJSON_TRACK_LOADED: {
      const track = action.payload
      return {
        ...state,
        tracks: {
          ...state.tracks,
          [action.payload.id]: track,
        },
      }
    }

    default:
      return state
  }
}
