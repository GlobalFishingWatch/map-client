import {
  UPDATE_FILTERS,
  TIMELINE_DEFAULT_START_DATE,
  TIMELINE_DEFAULT_END_DATE,
  TIMELINE_INNER_EXTENT,
  SET_TIMELINE_DATES
} from '../actions';

const initialState = {
  startDate: TIMELINE_DEFAULT_START_DATE,
  endDate: TIMELINE_DEFAULT_END_DATE,
  timelineInnerExtent: TIMELINE_INNER_EXTENT,
  flag: ''
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_FILTERS:
      return Object.assign({}, state, action.payload);
    case SET_TIMELINE_DATES:
      return Object.assign({}, state, {
        timelineInnerExtent: action.payload
      });
    default:
      return state;
  }
}
