import { GA_SEARCH_RESULT_CLICKED, GA_VESSEL_POINT_CLICKED, GA_MAP_POINT_CLICKED } from 'actions';

/**
 * Only add here actions that are GA-exclusive.
 * These aim at removing ambiguities in other actions.
 */
export function trackSearchResultClicked(tilesetUrl, seriesgroup) {
  return (dispatch) => {
    dispatch({
      type: GA_SEARCH_RESULT_CLICKED,
      payload: { tilesetUrl, seriesgroup }
    });
  };
}

export function trackVesselPointClicked(tilesetUrl, seriesgroup) {
  return (dispatch) => {
    dispatch({
      type: GA_VESSEL_POINT_CLICKED,
      payload: { tilesetUrl, seriesgroup }
    });
  };
}

export function trackMapClicked(lat, long, type) {
  return (dispatch) => {
    dispatch({
      type: GA_MAP_POINT_CLICKED,
      payload: { lat, long, type }
    });
  };
}
