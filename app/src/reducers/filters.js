import {UPDATE_FILTERS, TIMELINE_DEFAULT_START_DATE, TIMELINE_DEFAULT_END_DATE,TIMELINE_OUTER_EXTENT,TIMELINE_INNER_EXTENT} from "../constants";

const initialState = {
  startDate: TIMELINE_DEFAULT_START_DATE,
  endDate: TIMELINE_DEFAULT_END_DATE,
  outerExtent: TIMELINE_OUTER_EXTENT,
  innerExtent: TIMELINE_INNER_EXTENT,
  flag: ''
};

export default function (state = initialState, action) {

  switch (action.type) {
    case UPDATE_FILTERS:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
