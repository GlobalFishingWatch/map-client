import {TIMELINE_DEFAULT_START_DATE, TIMELINE_DEFAULT_END_DATE} from "../constants";

const initialState = {
  startDate: TIMELINE_DEFAULT_START_DATE,
  endDate: TIMELINE_DEFAULT_END_DATE,
  flag: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
};
