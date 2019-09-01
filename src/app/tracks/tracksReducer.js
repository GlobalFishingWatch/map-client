import { geoJSONTrackToTimebarTrack } from '@globalfishingwatch/map-components/src/timebar/utils'
import { GEOJSON_TRACK_LOADED } from 'app/tracks/tracksActions'

const initialState = {
  tracks: {},
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GEOJSON_TRACK_LOADED: {
      const track = action.payload
      const { points, segments } = geoJSONTrackToTimebarTrack(action.payload.data)
      return {
        ...state,
        tracks: {
          ...state.tracks,
          [action.payload.id]: {
            ...track,
            points,
            segments,
          },
        },
      }
    }

    default:
      return state
  }
}
