import tilecover from '@mapbox/tile-cover/index';
import debounce from 'lodash/debounce';
import { PerspectiveMercatorViewport } from 'viewport-mercator-project';
import { getTile, releaseTiles, highlightVesselFromHeatmap } from './heatmapActions';

export const SET_CURRENTLY_VISIBLE_TILES = 'SET_CURRENTLY_VISIBLE_TILES';
export const SET_CURRENTLY_LOADED_TILES = 'SET_CURRENTLY_LOADED_TILES';

// restrict tilecover to a single zoom level
// could be customized to load less or more detailed tiles
const getTilecoverLimits = zoom => ({
  min_zoom: Math.ceil(zoom),
  max_zoom: Math.ceil(zoom)
});

const flushTileState = (forceLoadingAllVisibleTiles = false) => (dispatch, getState) => {
  const currentVisibleTiles = getState().heatmapTiles.currentVisibleTiles;
  let tilesToGet = [];
  const tilesToReleaseUids = [];

  if (forceLoadingAllVisibleTiles === true) {
    tilesToGet = currentVisibleTiles;
  } else {
    const currentLoadedTiles = getState().heatmapTiles.currentLoadedTiles;

    currentVisibleTiles.forEach((visibleTile) => {
      if (currentLoadedTiles.find(t => t.uid === visibleTile.uid) === undefined) {
        tilesToGet.push(visibleTile);
      }
    });

    currentLoadedTiles.forEach((loadedTile) => {
      if (currentVisibleTiles.find(t => t.uid === loadedTile.uid) === undefined) {
        tilesToReleaseUids.push(loadedTile.uid);
      }
    });
  }

  // console.log('force loading:', forceLoadingAllVisibleTiles)
  // console.log('visible', currentVisibleTiles.map(t => t.uid))
  // console.log('load', tilesToGet.map(t => t.uid))
  // console.log('release', tilesToReleaseUids)
  // console.log('----')

  tilesToGet.forEach((tile) => {
    dispatch(getTile(tile));
  });
  dispatch({
    type: SET_CURRENTLY_LOADED_TILES,
    payload: currentVisibleTiles
  });

  dispatch(releaseTiles(tilesToReleaseUids));
};

const _debouncedFlushState = (dispatch) => {
  dispatch(flushTileState());
};
const debouncedFlushState = debounce(_debouncedFlushState, 500);

export const updateHeatmapTilesFromViewport = (forceLoadingAllVisibleTiles = false) => {
  // if in transition, skip loading/releasing
  // else
  //   collect all tiles in viewport
  //   save them to reducer: currentVisibleTiles
  // if not zooming: flush immediately
  //   if forceLoadingAlVisiblelTiles
  //     get tiles from currentVisibleTiles
  //   else
  //     get tiles from currentVisibleTiles
  //     make delta with currentLoadedTiles
  //     get tiles from delta+
  //     release tiles from delta-
  //   save to reducer: currentVisibleTiles -> currentLoadedTiles
  // if zooming: debounced flush to avoid "tile spam"
  return (dispatch, getState) => {
    const mapViewport = getState().mapViewport;

    // do not allow any tile update during transitions (currently only zoom)
    // wait for the end of the transition to look at viewport and load matching tiles
    if (mapViewport.currentTransition !== null) {
      return;
    }

    const viewport = mapViewport.viewport;

    // instanciate a viewport instance to get lat/lon from screen top left/ bottom right bounds
    const boundsViewport = new PerspectiveMercatorViewport(viewport);
    const bounds = [
      boundsViewport.unproject([0, 0]),
      boundsViewport.unproject([viewport.width, viewport.height])
    ];

    const [wn, es] = bounds;
    const [w, s, e, n] = [wn[0], es[1], es[0], wn[1]];
    const geom = {
      type: 'Polygon',
      coordinates: [
        [[w, n], [e, n], [e, s], [w, s], [w, n]]
      ]
    };

    const limits = getTilecoverLimits(viewport.zoom);

    // using tilecover, get xyz tile coords as well as quadkey indexes (named uid through the app)
    const viewportTilesCoords = tilecover.tiles(geom, limits);
    const viewportTilesIndexes = tilecover.indexes(geom, limits);
    const visibleTiles = [];

    viewportTilesCoords.forEach((coords, i) => {
      const uid = viewportTilesIndexes[i];
      visibleTiles.push({
        tileCoordinates: {
          x: coords[0],
          y: coords[1],
          zoom: coords[2]
        },
        uid
      });
    });

    dispatch({
      type: SET_CURRENTLY_VISIBLE_TILES,
      payload: visibleTiles
    });

    const isMouseWheelZooming = mapViewport.prevZoom !== viewport.zoom;

    if (isMouseWheelZooming === false) {
      dispatch(flushTileState(forceLoadingAllVisibleTiles));
    } else {
      debouncedFlushState(dispatch);
    }
  };
};

export const queryHeatmapVessels = (coords, isClick = false) => {
  return (dispatch, getState) => {
    // use tilecover to get what tile quadkey/uid "belongs" to the point
    const geom = {
      type: 'Point',
      coordinates: [coords.longitude, coords.latitude]
    };
    const limits = getTilecoverLimits(getState().mapViewport.viewport.zoom);
    const viewportTilesIndexes = tilecover.indexes(geom, limits);
    const query = {
      ...coords,
      uid: viewportTilesIndexes[0]
    };

    // console.log(query);
    dispatch(highlightVesselFromHeatmap(query));
  };
};
