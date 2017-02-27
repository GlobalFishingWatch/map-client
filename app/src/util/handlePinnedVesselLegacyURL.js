export const getSeriesGroupsFromVesselURL = (url) => {
  if (url !== undefined) {
    const seriesgroupFromURLRegex = /sub\/seriesgroup=(\d*)$/g;
    const seriesgroupFromURLMatches = seriesgroupFromURLRegex.exec(url);
    if (seriesgroupFromURLMatches) {
      return seriesgroupFromURLMatches[1];
    }
  }

  console.warn('Could not determine seriesgroup from legacy pinned vessel URL');
  return null;
};

export const getTilesetFromVesselURL = (url) => {
  if (url !== undefined) {
    const tilesetFromURLRegex = /tilesets\/((\w|-)*)\/sub\/seriesgroup=(\d*)$/g;
    const tilesetFromURLMatches = tilesetFromURLRegex.exec(url);
    if (tilesetFromURLMatches) {
      return tilesetFromURLMatches[1];
    }
  }

  console.warn('Could not determine tileset from legacy pinned vessel URL');
  return null;
};
