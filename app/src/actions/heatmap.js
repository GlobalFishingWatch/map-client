/* eslint no-param-reassign: 0 */

import {
  UPDATE_HEATMAP_TILES,
  COMPLETE_TILE_LOAD
} from '../actions';
import {
  getTimeAtPrecision,
  getTilePelagosPromises,
  getCleanVectorArrays,
  groupData,
  addTilePixelCoordinates,
  getTilePlaybackData
} from './helpers/heatmapTileData';

export function getTile(uid, tileCoordinates, canvas) {
  return (dispatch, getState) => {
    const layers = getState().heatmap;
    const timelineOverallStartDate = getState().filters.timelineOverallExtent[0];
    const timelineOverallEndDate = getState().filters.timelineOverallExtent[1];
    const overallStartDateOffset = getTimeAtPrecision(timelineOverallStartDate);
    const token = getState().user.token;
    const allPromises = [];

    Object.keys(layers).forEach(layerId => {
      // TODO Bail + add empty objects if layer is not visible
      // TODO Filter by flag
      const layer = layers[layerId];
      const tiles = layer.tiles;

      const tile = {
        uid,
        tileCoordinates,
        canvas
      };

      const pelagosPromises = getTilePelagosPromises(
        layer.url,
        tileCoordinates,
        timelineOverallStartDate,
        timelineOverallEndDate,
        token
      );

      const allLayerPromises = Promise.all(pelagosPromises);
      allPromises.push(allLayerPromises);

      allLayerPromises.then(rawTileData => {
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

    Promise.all(allPromises).then(() => {
      dispatch({
        type: COMPLETE_TILE_LOAD
      });
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
