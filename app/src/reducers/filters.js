import moment from 'moment';
import {
  SET_INNER_TIMELINE_DATES,
  SET_OUTER_TIMELINE_DATES,
  SET_FLAG_FILTER,
  SET_PLAYING_STATUS,
  SET_TIMELINE_OVER_DATES
} from '../actions';
import {
  TIMELINE_DEFAULT_INNER_DATE_EXTENT,
  TIMELINE_DEFAULT_OUTER_DATE_EXTENT,
  TIMELINE_OVERALL_START_DATE
} from '../constants';

const initialState = {
  timelineOverallExtent: [TIMELINE_OVERALL_START_DATE, moment().subtract(3, 'days').toDate()],
  timelinePaused: true,
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
    case SET_PLAYING_STATUS:
      return Object.assign({}, state, {
        timelinePaused: action.payload
      });
    case SET_TIMELINE_OVER_DATES:
      return Object.assign({}, state, {
        timelineOverExtent: action.payload
      });
    default:
      return state;
  }
}
