export const mapHover = (lat, long, features) => {
  return (dispatch, getState) => {
    // TODO Only hover features if current highlightedVessels is empty
    console.log(lat, long, features);
  };
};

export const mapClick = (lat, long, features) => {
  return (dispatch, getState) => {
    // TODO trigger popup if current highlightedVessels is empty
    // TODO else trigger getVesselFromHeatmap on heatmapActions
    console.log(lat, long, features);
  };
};
