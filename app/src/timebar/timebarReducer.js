import {
  SET_TIMEBAR_CHART_DATA
} from 'timebar/timebarActions';

const initialState = {
  chartData: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_TIMEBAR_CHART_DATA:
      return Object.assign({}, state, {
        chartData: action.payload
      });
    default:
      return state;
  }
}
