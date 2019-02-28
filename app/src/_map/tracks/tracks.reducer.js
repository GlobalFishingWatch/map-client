import PropTypes from 'prop-types';
import withReducerTypes from '../utils/withReducerTypes';

import {
  ADD_TRACK,
  UPDATE_TRACK,
  REMOVE_TRACK
} from './tracks.actions';

const UPDATE_TRACKS_STYLES = 'TODO: MOVE THIS TO SELECTOR';

const initialState = {
  data: []
};

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

const tracksReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TRACK: {
      const data = [...state.data, action.payload];
      return { ...state, data };
    }

    case UPDATE_TRACK: {
      const trackData = action.payload;
      const data = state.data.map((track) => {
        if (track.id !== trackData.id) return track;
        return ({
          ...track,
          ...trackData
        });
      });
      return { ...state, data };
    }

    case REMOVE_TRACK: {
      const removedTrackId = action.payload.trackId;
      const data = state.data.filter(track =>
        track.id !== removedTrackId
      );
      return { ...state, data };
    }

    case UPDATE_TRACKS_STYLES: {
      const styles = state.data.reduce((acc, layer) => {
        if (!layer.data) return acc;

        const source = `${layer.id}Track`;
        const style = {
          sources: {
            [source]: {
              tye: 'geojson',
              data: filterGeojsonByTimerange(layer.data, state.temporalExtent)
            }
          },
          layers: [
            {
              source,
              type: 'line',
              interactive: true,
              layout: {},
              paint: {
                'line-width': 1,
                'line-color': '#000'
              }
            }
          ]
        };
        return {
          sources: {
            ...acc.sources,
            ...style.sources
          },
          layers: {
            ...acc.layers,
            ...style.layers
          }
        };
      }, { sources: [], layers: [] });
      console.log(styles)
      return { ...state, styles };
    }

    default:
      return state;
  }
};

const tracksTypes = {
  data: PropTypes.arrayOf(PropTypes.exact({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['geojson', undefined]),
    color: PropTypes.string,
    data: PropTypes.object,
    geoBounds: PropTypes.array,
    timelineBounds: PropTypes.array
  }))
};

export default withReducerTypes('tracks', tracksTypes)(tracksReducer);
