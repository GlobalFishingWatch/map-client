import { startLoading, completeLoading } from 'app/app/appActions'
import {
  getTrackBounds,
  getTrackTimeBounds,
} from '@globalfishingwatch/map-components/components/map'

export const GEOJSON_TRACK_LOADED = 'GEOJSON_TRACK_LOADED'
export const SET_TRACK_CURRENT_FEATURE = 'SET_TRACK_CURRENT_FEATURE'

export const loadGeoJSONTrack = (id, baseUrl, trackFeatures = null) => (dispatch) => {
  const availableFeatures = trackFeatures || []
  const url = baseUrl.replace('{{id}}', id)
  const finalUrl = `${url}?features=${availableFeatures.concat(['fishing']).join(',')}`
  dispatch(startLoading())
  fetch(finalUrl)
    .then((res) => {
      if (res.status >= 400) throw new Error(res.statusText)
      return res.json()
    })
    .then((data) => {
      const timelineBounds = getTrackTimeBounds(data)
      const geoBounds = getTrackBounds(data)
      dispatch({
        type: GEOJSON_TRACK_LOADED,
        payload: {
          id,
          data,
          geoBounds,
          timelineBounds,
          availableFeatures,
        },
      })
      // if (fitBoundsOnLoad) {
      //   targetMapVessel(id)
      // }
    })
    .catch((err) => console.warn(err))
    .finally(() => dispatch(completeLoading()))
}

export const setTrackCurrentFeatureGraph = (currentFeature) => ({
  type: SET_TRACK_CURRENT_FEATURE,
  payload: {
    currentFeature,
  },
})
