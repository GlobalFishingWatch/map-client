import tilecover from '@mapbox/tile-cover/index';
import debounce from 'lodash/debounce';
import { getTile, releaseTiles } from './heatmapActions';

export const ADD_TILES_TO_VIEWPORT = 'ADD_TILES_TO_VIEWPORT';
export const MARK_TILES_FOR_RELEASE = 'MARK_TILES_FOR_RELEASE';
export const RELEASE_VIEWPORT_TILES = 'RELEASE_VIEWPORT_TILES';

export const markTilesForRelease = releasedTilesUids => ({
  type: MARK_TILES_FOR_RELEASE,
  payload: releasedTilesUids
});

const releaseViewportTiles = debounce((dispatch, getState) => {
  console.log('release', getState().heatmapTiles.tilesUidsMarkedForRelease);
  dispatch(releaseTiles(getState().heatmapTiles.tilesUidsMarkedForRelease));
  dispatch({
    type: RELEASE_VIEWPORT_TILES
  });
}, 1000);
const releaseViewportTilesDebounced = () => releaseViewportTiles;

export const updateHeatmapTilesFromViewport = () => {
  return (dispatch, getState) => {
    const bounds = getState().mapViewport.bounds;

    if (bounds === null) {
      return;
    }
    const viewport = getState().mapViewport.viewport;
    const zoom = viewport.zoom;
    const [wn, es] = bounds;
    const [w, s, e, n] = [wn[0], es[1], es[0], wn[1]];
    const geom = {
      type: 'Polygon',
      coordinates: [
        [[w, n], [e, n], [e, s], [w, s], [w, n]]
      ]
    };
    //
    const limits = {
      min_zoom: Math.ceil(zoom),
      max_zoom: Math.ceil(zoom)
    };

    const viewportTilesCoords = tilecover.tiles(geom, limits);
    const viewportTilesIndexes = tilecover.indexes(geom, limits);
    const updatedTiles = [];

    viewportTilesCoords.forEach((coords, i) => {
      const uid = viewportTilesIndexes[i];
      const isNewTile = getState().heatmapTiles.tilesUidsInViewport.indexOf(uid) === -1;
      if (isNewTile) {
        updatedTiles.push({
          tileCoordinates: {
            x: coords[0],
            y: coords[1],
            zoom: coords[2]
          },
          uid
        });
      }
    });

    const releasedTilesUids = [];
    getState().heatmapTiles.tilesUidsInViewport.forEach((tileUidInViewport) => {
      if (viewportTilesIndexes.indexOf(tileUidInViewport) === -1) {
        releasedTilesUids.push(tileUidInViewport);
      }
    });

    console.log('loading', updatedTiles.map(tile => tile.uid));

    updatedTiles.forEach((referenceTile) => {
      dispatch(getTile(referenceTile));
    });

    dispatch({
      type: ADD_TILES_TO_VIEWPORT,
      payload: updatedTiles.map(tile => tile.uid)
    });

    dispatch(markTilesForRelease(releasedTilesUids));

    // TODO debounce this
    dispatch(releaseViewportTilesDebounced());
  };
};
