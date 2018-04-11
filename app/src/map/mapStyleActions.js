export const SET_BASEMAP = 'SET_BASEMAP';

export function setBasemap(basemap) {
  return {
    type: SET_BASEMAP,
    payload: basemap
  };
}

