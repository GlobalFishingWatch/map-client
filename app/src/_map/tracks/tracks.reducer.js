import PropTypes from 'prop-types';
import withReducerTypes from '../utils/withReducerTypes';

import {
  ADD_TRACK,
  UPDATE_TRACK,
  REMOVE_TRACK
} from './tracks.actions';

const initialState = {
  data: []
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
    geoBounds: PropTypes.exact({
      minLat: PropTypes.string,
      minLng: PropTypes.string,
      maxLat: PropTypes.string,
      maxLng: PropTypes.string
    }),
    fitBoundsOnLoad: PropTypes.bool,
    timelineBounds: PropTypes.array
  }))
};

export default withReducerTypes('tracks', tracksTypes)(tracksReducer);
