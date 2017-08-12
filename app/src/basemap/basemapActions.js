import {
  SET_BASEMAP
} from 'actions';


export function setBasemap(basemap) {
  return {
    type: SET_BASEMAP,
    payload: basemap
  };
}

