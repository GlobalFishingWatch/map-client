import { GA_SEARCH_RESULT_CLICKED, GA_VESSEL_POINT_CLICKED } from 'actions';

/**
 * Only add here actions that are GA-exclusive.
 * These aim at removing ambiguities in other actions.
 */
export function trackSearchResultClicked(seriesgroup, vesselname) {
  return (dispatch) => {
    dispatch({
      type: GA_SEARCH_RESULT_CLICKED,
      payload: {
        seriesgroup,
        vesselname
      }
    });
  };
}

export function trackVesselPointClicked(seriesgroup, vesselname) {
  return (dispatch) => {
    dispatch({
      type: GA_VESSEL_POINT_CLICKED,
      payload: {
        seriesgroup,
        vesselname
      }
    });
  };
}
