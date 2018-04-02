import {
  ADD_TILES_TO_VIEWPORT,
  MARK_TILES_FOR_RELEASE,
  RELEASE_VIEWPORT_TILES
} from 'activityLayers/heatmapTilesActions';

const initialState = {
  tilesUidsInViewport: [],
  tilesUidsMarkedForRelease: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_TILES_TO_VIEWPORT: {
      const tilesUidsInViewport = state.tilesUidsInViewport.concat(action.payload);
      const tilesUidsMarkedForRelease = state.tilesUidsMarkedForRelease.filter(uid => action.payload.indexOf(uid) === -1);
      return { ...state, tilesUidsInViewport, tilesUidsMarkedForRelease };
    }

    case MARK_TILES_FOR_RELEASE: {
      const tilesUidsMarkedForRelease = state.tilesUidsMarkedForRelease.concat(action.payload);
      const tilesUidsInViewport = state.tilesUidsInViewport.filter(uid => action.payload.indexOf(uid) === -1);
      return { ...state, tilesUidsInViewport, tilesUidsMarkedForRelease };
    }

    case RELEASE_VIEWPORT_TILES: {
      return { ...state, tilesUidsMarkedForRelease: [] };
    }

    default:
      return state;
  }
}
