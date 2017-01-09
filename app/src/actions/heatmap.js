/* eslint no-param-reassign: 0 */
import {
  UPDATE_HEATMAP_TILES
} from '../actions';

// const loadLayerTile = (canvas, url) => {
//
// }

export function createTile(uid, tileCoordinates) {
  return (dispatch, getState) => {
    const layers = getState().heatmap;
    console.log(layers)
    Object.keys(layers).forEach(layerId => {
      const layer = layers[layerId];
      // console.log(layer)
      const tiles = layer.tiles;

      const tile = {
        uid,
        tileCoordinates
      };
      // tile.data = loadLayerTile(zoom, layer.url);
      tiles.push(tile);
    });
    dispatch({
      type: UPDATE_HEATMAP_TILES,
      payload: layers
    });
  };
}

export function releaseTile(uid) {
  return (dispatch, getState) => {
    const layers = getState().heatmap;
    Object.keys(layers).forEach(layerId => {
      const layer = layers[layerId];
      const tiles = layer.tiles;
      const releasedTileIndex = tiles.findIndex(tile => tile.uid === uid);
      if (!releasedTileIndex) {
        console.warn('unknown tile released', uid);
        return;
      }
      tiles.splice(releasedTileIndex, 1);
    });
    dispatch({
      type: UPDATE_HEATMAP_TILES,
      payload: layers
    });
  };
}
