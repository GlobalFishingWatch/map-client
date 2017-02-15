/* eslint-disable import/prefer-default-export */
import { getLayerLibrary } from 'actions/layerLibrary';

import {
  SET_TIMEBAR_CHART_DATA
} from 'actions';

export function loadTimebarChartData() {
  return (dispatch) => {
    fetch('/timebarData.json')
    .then(res => res.json())
    .then((data) => {
      dispatch({
        type: SET_TIMEBAR_CHART_DATA,
        payload: data
      });
      // TODO we shouldn't chain load timebar data -> workspace
      // they should be able to load in parallel but this will need a review
      // of the Timebar component
      dispatch(getLayerLibrary());
    });
  };
}
