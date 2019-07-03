import { createSelector } from 'reselect'
import length from '@turf/length'
import greatCircle from '@turf/great-circle'

const getRulers = (state) => state.rulers.rulers
const getRulersVisibility = (state) => state.rulers.visible

const makeRulerGeometry = (ruler) => {
  const { start, end, isNew } = ruler
  const rawFeature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [[start.longitude, start.latitude], [end.longitude, end.latitude]],
    },
  }
  const lengthKm = length(rawFeature, { units: 'kilometers' })
  const lengthNmi = lengthKm / 1.852
  const lengthKmFormatted = lengthKm.toFixed(lengthKm > 100 ? 0 : 1)
  const lengthNmiFormatted = lengthNmi.toFixed(lengthNmi > 100 ? 0 : 1)

  const finalFeature =
    lengthKm < 100
      ? rawFeature
      : greatCircle([start.longitude, start.latitude], [end.longitude, end.latitude])

  finalFeature.properties.label = `${lengthKmFormatted}km - ${lengthNmiFormatted}nmi`
  finalFeature.properties.isNew = isNew
  return finalFeature
}

export const getRulersLayer = createSelector(
  [getRulers, getRulersVisibility],
  (rulers, rulersVisibility) => {
    const geojson = {
      type: 'FeatureCollection',
      features: rulers.map(makeRulerGeometry),
    }

    const rulersLayer = {
      id: 'rulers',
      visible: rulersVisibility,
      interactive: false,
      color: '#ffaa00',
      data: geojson,
    }
    return rulersLayer
  }
)
