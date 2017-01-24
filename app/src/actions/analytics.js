import { GA_SEARCH_RESULT_CLICKED, GA_VESSEL_POINT_CLICKED } from 'actions';

/**
 * Only add here actions that are GA-exclusive.
 * These aim at removing ambiguities in other actions.
 */
export function trackSearchResultClicked(seriesGroup) {
  return (dispatch) => {
    dispatch({
      type: GA_SEARCH_RESULT_CLICKED,
      payload: seriesGroup
    });
  };
}

export function trackVesselPointClicked(seriesGroup) {
  return (dispatch) => {
    dispatch({
      type: GA_VESSEL_POINT_CLICKED,
      payload: seriesGroup
    });
  };
}
