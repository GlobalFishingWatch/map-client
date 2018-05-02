import {
  SET_CURRENTLY_VISIBLE_TILES,
  SET_CURRENTLY_LOADED_TILES
} from 'activityLayers/heatmapTilesActions';

const initialState = {
  currentVisibleTiles: [],
  currentLoadedTiles: []
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

    default:
      return state;
  }
}
