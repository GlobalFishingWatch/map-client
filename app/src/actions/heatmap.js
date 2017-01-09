/* eslint no-param-reassign: 0 */

import {
  UPDATE_HEATMAP_TILES
} from '../actions';
import {
  getTimeAtPrecision,
  getTilePelagosPromises,
  getCleanVectorArrays,
  groupData,
  addTilePixelCoordinates,
  getTilePlaybackData
} from './helpers/heatmapTileData';

export function createTile(uid, tileCoordinates) {
  return (dispatch, getState) => {
    const layers = getState().heatmap;
    const timelineOverallStartDate = getState().filters.timelineOverallExtent[0];
    const timelineOverallEndDate = getState().filters.timelineOverallExtent[1];
    const overallStartDateOffset = getTimeAtPrecision(timelineOverallStartDate);
    const token = getState().user.token;
    // const allPromises = [];
    Object.keys(layers).forEach(layerId => {
      const layer = layers[layerId];
      const tiles = layer.tiles;

      const tile = {
        uid,
        tileCoordinates
      };

      const pelagosPromises = getTilePelagosPromises(
        layer.url,
        tileCoordinates,
        timelineOverallStartDate,
        timelineOverallEndDate,
        token
      );

      Promise.all(pelagosPromises).then((rawTileData) => {
        if (!rawTileData || rawTileData.length === 0) {
          console.warn('empty dataset');
        }

        const cleanVectorArrays = getCleanVectorArrays(rawTileData);
        if (cleanVectorArrays.length !== rawTileData.length) {
          console.warn('partially empty dataset');
        }

        const groupedData = groupData(cleanVectorArrays);
        const vectorArray = addTilePixelCoordinates(tileCoordinates, groupedData);
        const data = getTilePlaybackData(
          tileCoordinates.zoom,
          vectorArray,
          timelineOverallStartDate,
          timelineOverallEndDate,
          overallStartDateOffset
        );
        tile.data = data;

        dispatch({
          type: UPDATE_HEATMAP_TILES,
          payload: layers
        });
      });

      tiles.push(tile);
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
