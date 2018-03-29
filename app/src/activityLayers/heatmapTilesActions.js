import tilecover from '@mapbox/tile-cover/index';
import { getTile } from './heatmapActions';

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
    console.log(w,s,e,n)
    const geom = {
      type: 'Polygon',
      coordinates: [
        [[w, n], [e, n], [e, s], [w, s], [w, n]]
      ]
    };
    //
    var limits = {
      min_zoom: Math.ceil(zoom),
      max_zoom: Math.ceil(zoom)
    };

    const updatedTilesCoords = tilecover.tiles(geom, limits);
    const updatedTilesIndexes = tilecover.indexes(geom, limits);
    const updatedTiles = updatedTilesCoords.map((coords, i) => {
      return {
        tileCoordinates: {
          x: coords[0],
          y: coords[1],
          zoom: coords[2]
        },
        uid: updatedTilesIndexes[i]
      };
    });


    console.log(updatedTilesCoords, updatedTilesIndexes, updatedTiles)
    // .filter(tile => getState().app.tilesIndexes.indexOf(tile.index) === -1);

    updatedTiles.forEach((referenceTile) => {
      dispatch(getTile(referenceTile));
    });

    //
    // dispatch({
    //   type: 'add_tiles',
    //   payload: updatedTiles
    // });

  };
};
