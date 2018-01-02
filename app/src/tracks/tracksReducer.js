import {
  SET_VESSEL_TRACK,
  SET_TRACK_VISIBILITY,
  SET_TRACK_BOUNDS
} from './tracksActions';

const initialState = {
  trackBounds: null,
  tracks: []
};

export default function (state = initialState, action) {
  switch (action.type) {

    case SET_VESSEL_TRACK: {
      const newTrack = {
        seriesgroup: action.payload.seriesgroup,
        visble: true,
        data: action.payload.data,
        selectedSeries: action.payload.selectedSeries
      };

      return Object.assign({}, state, {
        tracks: state.tracks.concat([newTrack])
      });
    }

    case SET_TRACK_VISIBILITY: {
      const trackIndex = state.tracks.findIndex(vessel => vessel.seriesgroup === action.payload.seriesgroup);
      const newTrack = Object.assign({}, state.tracks[trackIndex]);
      newTrack.visible = action.payload.visible;

      return Object.assign({}, state, {
        tracks: [...state.tracks.slice(0, trackIndex), newTrack, ...state.tracks.slice(trackIndex + 1)]
      });
    }

    case SET_TRACK_BOUNDS: {
      return Object.assign({}, state, { trackBounds: action.trackBounds });
    }

    default:
      return state;
  }
}
