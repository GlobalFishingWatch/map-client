export function createTile(canvas) {
  return (dispatch, getState) => {
    const layers = getState().heatmap;
    Object.keys(layers).forEach(layerId => {
      console.log(layerId);
      const layer = layers[layerId];
      const tiles = layer.tiles;
      canvas.index = tiles.length;
      tiles.push(canvas);
    });
  };
}

export function releaseTile(canvas) {
  return (dispatch, getState) => {
    const layers = getState().heatmap;
    Object.keys(layers).forEach(layerId => {
      console.log(layerId);
      const layer = layers[layerId];
      const tiles = layer.tiles;
      const index = tiles.indexOf(canvas);
      if (index === -1) {
        console.warn('unknown tile released', index);
        return;
      }
      console.warn('released tile #', index);
      tiles.splice(index, 1);
    });
  };
}
