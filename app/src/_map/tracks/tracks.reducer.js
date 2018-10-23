import {
  ADD_TRACK,
  REMOVE_TRACKS
} from './tracks.actions';

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
          track.id === removedTrack.id &&
          (removedTrack.id === undefined || removedTrack.segmentId === track.segmentId)
        )
      );
    }

    default:
      return state;
  }
}
