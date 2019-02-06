import {
  ADD_TRACK,
  ADD_TRACK_DATA,
  REMOVE_TRACK,
  UPDATE_TRACK_STYLE
} from './tracks.actions';

const initialState = [];

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_TRACK: {
      const newTrack = action.payload;
      return [...state, newTrack];
    }

    case ADD_TRACK_DATA: {
      const trackData = action.payload;
      const trackIndex = state.findIndex(t => t.id === trackData.id);
      const track = { ...state.find(t => t.id === trackData.id), ...trackData };
      return [...state.slice(0, trackIndex), track, ...state.slice(trackIndex + 1)];
    }

    case REMOVE_TRACK: {
      const removedTrackId = action.payload.trackId;
      return state.filter(track =>
        track.id !== removedTrackId
      );
    }

    case UPDATE_TRACK_STYLE: {
      const newTrack = action.payload;
      const trackIndex = state.findIndex(t => t.id === newTrack.id);
      const track = { ...state.find(t => t.id === newTrack.id), ...newTrack };
      return [...state.slice(0, trackIndex), track, ...state.slice(trackIndex + 1)];
    }

    default:
      return state;
  }
}
