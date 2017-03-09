import {
  GA_SEARCH_RESULT_CLICKED,
  GA_VESSEL_POINT_CLICKED,
  GA_MAP_POINT_CLICKED,
  GA_OUTSIDE_LINK_CLICKED
} from 'actions';

/**
 * Only add here actions that are GA-exclusive.
 * These aim at removing ambiguities in other actions.
 */
export function trackSearchResultClicked(tilesetUrl, seriesgroup) {
  return (dispatch, getState) => {
    const state = getState();
    const vesselIndex = state.vesselInfo.vessels.findIndex(vessel => vessel.seriesgroup === seriesgroup);
    // name can be undefinedl, but GA doesn't support objects as a label, so if undefined name will be removed on stringify
    const name = state.vesselInfo.vessels[vesselIndex].vesselname;
    dispatch({
      type: GA_SEARCH_RESULT_CLICKED,
      payload: { tilesetUrl, seriesgroup, name }
    });
  };
}

export function trackVesselPointClicked(tilesetUrl, seriesgroup) {
  return (dispatch, getState) => {
    const state = getState();
    const vesselIndex = state.vesselInfo.vessels.findIndex(vessel => vessel.seriesgroup === seriesgroup);
    // name can be undefinedl, but GA doesn't support objects as a label, so if undefined name will be removed on stringify
    const name = state.vesselInfo.vessels[vesselIndex].vesselname;
    dispatch({
      type: GA_VESSEL_POINT_CLICKED,
      payload: { tilesetUrl, seriesgroup, name }
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

export function trackExternalLinkClicked(link) {
  return (dispatch) => {
    dispatch({ type: GA_OUTSIDE_LINK_CLICKED, payload: link });
    window.location = link;
  };
}
