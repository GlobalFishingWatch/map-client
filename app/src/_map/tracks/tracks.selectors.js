import { createSelector } from 'reselect';
import { getTemporalExtent } from '../module/module.selectors.js';

export const getTracksData = state => state.map.tracks.data;

const filterGeojsonByTimerange = (geojson, { start, end }) => {
  if (!geojson || !geojson.features) return null;
  const featuresFiltered = geojson.features.reduce((acc, feature) => {
    const hasTimes = feature.properties.coordinateProperties.times && feature.properties.coordinateProperties.times.length > 0;
    if (hasTimes) {
      const filtered = feature.geometry.coordinates.reduce((acc2, coordinate, index) => {
        const timeCoordinate = feature.properties.coordinateProperties.times[index];
        const isInTimeline = timeCoordinate > start && timeCoordinate < end;
        if (isInTimeline) {
          acc2.coordinates.push(coordinate);
          acc2.times.push(timeCoordinate);
        }
        return acc2;
      }, { coordinates: [], times: [] });
      if (!filtered.coordinates.length) return acc;

      const filteredFeature = {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: filtered.coordinates
        },
        properties: {
          ...feature.properties,
          coordinateProperties: {
            times: filtered.times
          }
        }
      };
      acc.push(filteredFeature);
    }
    return acc;
  }, []);
  const geojsonFiltered = {
    ...geojson,
    features: featuresFiltered
  };
  return geojsonFiltered;
};

export const getTracksStyles = createSelector(
  [getTemporalExtent, getTracksData],
  (temporalExtent, tracks) => {
    const hasTemporalExtent = temporalExtent && temporalExtent.length > 0;
    const hasTracks = tracks && tracks.length > 0;
    if (!hasTemporalExtent || !hasTracks) return null;

    const timerange = {
      start: temporalExtent[0].getTime(),
      end: temporalExtent[1].getTime()
    };
    const styles = tracks.reduce((acc, track) => {
      if (!track.data) return acc;

      const source = `${track.id}Track`;
      const style = {
        sources: {
          [source]: {
            type: 'geojson',
            data: filterGeojsonByTimerange(track.data, timerange)
          }
        },
        layers: [
          {
            id: `${track.id}Lines`,
            source,
            type: 'line',
            layout: {},
            paint: {
              'line-width': 1,
              'line-color': track.color
            }
          },
          {
            id: `${track.id}Points`,
            source,
            type: 'circle',
            filter: ['match', ['geometry-type'], ['', 'Point'], true, false],
            layout: {},
            paint: {
              'circle-radius': 4,
              'circle-color': track.color
            }
          }
        ]
      };
      return {
        sources: {
          ...acc.sources,
          ...style.sources
        },
        layers: [
          ...acc.layers,
          ...style.layers
        ]
      };
    }, { sources: {}, layers: [] });
    return styles;
  }
);
