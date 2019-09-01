import { startLoading, completeLoading } from 'app/app/appActions'
import {
  getTrackBounds,
  getTrackTimeBounds,
} from '@globalfishingwatch/map-components/components/map'

export const GEOJSON_TRACK_LOADED = 'GEOJSON_TRACK_LOADED'

export const loadGeoJSONTrack = (id, url) => (dispatch) => {
  dispatch(startLoading())
  fetch(url)
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
        },
      })
      // if (fitBoundsOnLoad) {
      //   targetMapVessel(id)
      // }
    })
    .catch((err) => console.warn(err))
    .finally(() => dispatch(completeLoading()))
}
