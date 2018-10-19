import {
  ADD_TRACK,
  REMOVE_TRACKS
} from '../actions/mapTracksActions';

const initialState = [];

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_TRACK: {
      const newTrack = action.payload;
      return [...state, newTrack];
    }

    case REMOVE_TRACKS: {
      const removedTracks = action.payload.tracks;
      return state.filter(track =>
        removedTracks.find(removedTrack =>
          track.seriesgroup === removedTrack.seriesgroup &&
          (removedTrack.seriesgroup === undefined || removedTrack.series === track.series)
        )
      );
    }

    default:
      return state;
  }
}
