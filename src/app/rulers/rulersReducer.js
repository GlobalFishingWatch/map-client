import length from '@turf/length'
import greatCircle from '@turf/great-circle'
import { EDIT_RULER, MOVE_CURRENT_RULER } from './rulersActions'

const makeRuler = (startLongitude, startLatitude, endLongitude, endLatitude) => {
  const rawFeature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [[startLongitude, startLatitude], [endLongitude, endLatitude]],
    },
  }
  const lengthKm = length(rawFeature, { units: 'kilometers' })
  const lengthNmi = lengthKm / 1.852
  const lengthKmFormatted = lengthKm.toFixed(lengthKm > 100 ? 0 : 1)
  const lengthNmiFormatted = lengthNmi.toFixed(lengthNmi > 100 ? 0 : 1)

  const finalFeature =
    lengthKm < 100
      ? rawFeature
      : greatCircle([startLongitude, startLatitude], [endLongitude, endLatitude])

  finalFeature.properties.label = `${lengthKmFormatted}km - ${lengthNmiFormatted}nmi`
  finalFeature.properties.isNew = true
  return finalFeature
}

const initialState = {
  visible: true,
  editing: false,
  drawing: false,
  rulers: {
    type: 'FeatureCollection',
    features: [makeRuler(-75.5859375, -55.77657301866769, -78.3984375, -47.5172006978394)],
  },
}

const rulersReducer = (state = initialState, action) => {
  switch (action.type) {
    case EDIT_RULER: {
      if (state.drawing === true) {
        const lastRulerIndex = state.rulers.features.length - 1
        const updatedRuler = { ...state.rulers.features[lastRulerIndex] }
        updatedRuler.properties.isNew = false
        const newFeatures = [...state.rulers.features.slice(0, -1), updatedRuler]
        const updatedRulers = { ...state.rulers, features: newFeatures }
        return { ...state, drawing: false, rulers: updatedRulers }
      }
      const newRuler = makeRuler(
        action.longitude,
        action.latitude,
        action.longitude + 0.0001,
        action.latitude + 0.0001
      )
      const newFeatures = [...state.rulers.features, newRuler]
      const newRulers = { ...state.rulers, features: newFeatures }
      return { ...state, rulers: newRulers, drawing: true }
    }

    case MOVE_CURRENT_RULER: {
      if (state.drawing === false) {
        return state
      }
      const lastRulerIndex = state.rulers.features.length - 1
      const updatedRuler = { ...state.rulers.features[lastRulerIndex] }
      const newRuler = makeRuler(
        updatedRuler.geometry.coordinates[0][0],
        updatedRuler.geometry.coordinates[0][1],
        action.longitude,
        action.latitude
      )

      const newFeatures = [...state.rulers.features.slice(0, -1), newRuler]
      const newRulers = { ...state.rulers, features: newFeatures }
      return { ...state, rulers: newRulers }
    }

    default:
      return state
  }
}

export default rulersReducer
