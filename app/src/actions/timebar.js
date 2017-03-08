/* eslint-disable import/prefer-default-export */
import { getLayerLibrary } from 'actions/layerLibrary';
import {
  SET_TIMEBAR_CHART_DATA
} from 'actions';

export function loadTimebarChartData(startDate, endDate) {
  const start = parseInt(startDate.getUTCFullYear(), 10);
  const end = parseInt(endDate.getUTCFullYear(), 10);
  return (dispatch) => {
    const chartData = [];
    for (let i = 0; i <= (end - start); i += 1) {
      const req = fetch(`${TIMEBAR_DATA_URL}/${start + i}-${start + 1 + i}.json`)
        .then(res => res.json());
      chartData.push(req);
    }
    Promise.all(chartData)
      .then((jsonList) => {
        let payload = [];
        jsonList.forEach((list) => {
          payload = [...payload, ...list];
        });
        return payload;
      })
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
