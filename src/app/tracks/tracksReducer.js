import {
  geoJSONTrackToTimebarTrack,
  geoJSONTrackToTimebarFeatureSegments,
} from '@globalfishingwatch/map-components/components/timebar/utils'
import { GEOJSON_TRACK_LOADED, SET_TRACK_CURRENT_FEATURE } from 'app/tracks/tracksActions'

const initialState = {
  tracks: {},
  currentFeature: null,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GEOJSON_TRACK_LOADED: {
      const track = action.payload
      const { points, segments } = geoJSONTrackToTimebarTrack(action.payload.data)
      const featureSegments = geoJSONTrackToTimebarFeatureSegments(action.payload.data)
      return {
        ...state,
        tracks: {
          ...state.tracks,
          [action.payload.id]: {
            ...track,
            points,
            segments,
            featureSegments,
          },
        },
      }
    }

    case SET_TRACK_CURRENT_FEATURE: {
      return { ...state, currentFeature: action.payload.currentFeature }
    }

    default:
      return state
  }
}
