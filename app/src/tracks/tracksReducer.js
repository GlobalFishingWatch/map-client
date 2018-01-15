import {
  INIT_TRACK,
  SET_TRACK,
  DELETE_TRACKS,
  SET_TRACK_VISIBILITY
  // SET_TRACK_BOUNDS
} from './tracksActions';

const initialState = {
  // trackBounds: null,
  tracks: []
};

export default function (state = initialState, action) {
  switch (action.type) {

    case INIT_TRACK: {
      if (state.tracks.find(t => t.seriesgroup === action.payload.seriesgroup));

      const newTrack = {
        show: false,
        visible: action.payload.visible || true,
        color: action.payload.color,
        seriesgroup: action.payload.seriesgroup,
        series: action.payload.series
      };

      return Object.assign({}, state, {
        tracks: [...state.tracks, newTrack]
      });
    }

    case SET_TRACK: {
      const trackIndex = state.tracks.findIndex(vessel => vessel.seriesgroup === action.payload.seriesgroup);
      const currentTrack = state.tracks[trackIndex];
      const newTrack = Object.assign({}, currentTrack, {
        data: action.payload.data,
        show: currentTrack.visible
      });

      return Object.assign({}, state, {
        tracks: [...state.tracks.slice(0, trackIndex), newTrack, ...state.tracks.slice(trackIndex + 1)]
      });
    }

    case DELETE_TRACKS: {
      return Object.assign({}, state, {
        tracks: state.tracks.filter(t => action.payload.seriesgroupArray.indexOf(t.seriesgroup) === -1)
      });
    }

    case SET_TRACK_VISIBILITY: {
      const trackIndex = state.tracks.findIndex(vessel => vessel.seriesgroup === action.payload.seriesgroup);
      const currentTrack = state.tracks[trackIndex];
      const newTrack = Object.assign({}, currentTrack, {
        visible: action.payload.visible,
        show: currentTrack.visible && currentTrack.data !== undefined
      });

      return Object.assign({}, state, {
        tracks: [...state.tracks.slice(0, trackIndex), newTrack, ...state.tracks.slice(trackIndex + 1)]
      });
    }

    // case SET_TRACK_BOUNDS: {
    //   return Object.assign({}, state, { trackBounds: action.trackBounds });
    // }

    default:
      return state;
  }
}
