import {UPDATE_FILTERS, TIMELINE_DEFAULT_START_DATE, TIMELINE_DEFAULT_END_DATE} from "../constants";

const initialState = {
  startDate: TIMELINE_DEFAULT_START_DATE,
  endDate: TIMELINE_DEFAULT_END_DATE,
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
