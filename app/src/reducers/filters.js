import {
  SET_INNER_TIMELINE_DATES,
  SET_OUTER_TIMELINE_DATES,
  SET_FLAG_FILTER
} from '../actions';
import {
  TIMELINE_DEFAULT_START_DATE,
  TIMELINE_DEFAULT_END_DATE,
  TIMELINE_INNER_DATE_EXTENT,
  TIMELINE_OUTER_DATE_EXTENT
} from '../constants';

const initialState = {
  startDate: TIMELINE_DEFAULT_START_DATE,
  endDate: TIMELINE_DEFAULT_END_DATE,
  timelineInnerExtent: TIMELINE_INNER_DATE_EXTENT,
  timelineOuterExtent: TIMELINE_OUTER_DATE_EXTENT,
  flag: ''
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_INNER_TIMELINE_DATES:
      return Object.assign({}, state, {
        timelineInnerExtent: action.payload
      });
    case SET_OUTER_TIMELINE_DATES:
      return Object.assign({}, state, {
        timelineOuterExtent: action.payload
      });
    case SET_FLAG_FILTER:
      return Object.assign({}, state, {
        flag: action.payload
      });
    default:
      return state;
  }
}
