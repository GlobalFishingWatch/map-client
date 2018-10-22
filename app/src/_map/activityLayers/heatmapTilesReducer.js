import uniq from 'lodash/uniq';
import {
  SET_CURRENTLY_VISIBLE_TILES,
  SET_CURRENTLY_LOADED_TILES,
  SET_CURRENTLY_SWAPPED_TILE_UIDS,
  MARK_TILES_UIDS_AS_LOADED,
  RELEASE_MARKED_TILES_UIDS
} from './heatmapTilesActions';

const initialState = {
  currentVisibleTiles: [],
  currentLoadedTiles: [],
  currentToLoadTileUids: [],
  currentToReleaseTileUids: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENTLY_VISIBLE_TILES: {
      const currentVisibleTiles = [].concat(action.payload);
      return { ...state, currentVisibleTiles };
    }

    case SET_CURRENTLY_LOADED_TILES: {
      const currentLoadedTiles = [].concat(action.payload);
      return { ...state, currentLoadedTiles };
    }

    case SET_CURRENTLY_SWAPPED_TILE_UIDS: {
      const currentToLoadTileUids = uniq(state.currentToLoadTileUids.concat(action.payload.tilesToLoadUids));
      const currentToReleaseTileUids = uniq(state.currentToReleaseTileUids.concat(action.payload.tilesToReleaseUids));
      // clean to load tiles of tiles that needs to be released
      const newToLoadTilesUids = currentToLoadTileUids.filter(tileUid => currentToReleaseTileUids.indexOf(tileUid) === -1);
      return { ...state, currentToLoadTileUids: newToLoadTilesUids, currentToReleaseTileUids };
    }

    case MARK_TILES_UIDS_AS_LOADED: {
      const currentToLoadTileUids = state.currentToLoadTileUids;
      const tileUidsMarkedAsLoaded = action.payload;
      const newCurrentToLoadTileUids = currentToLoadTileUids.filter(tileUid => tileUidsMarkedAsLoaded.indexOf(tileUid) === -1);
      return { ...state, currentToLoadTileUids: newCurrentToLoadTileUids };
    }

    case RELEASE_MARKED_TILES_UIDS: {
      return { ...state, currentToReleaseTileUids: [] };
    }

    default:
      return state;
  }
}
