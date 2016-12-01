import {
  SET_FLAG_FILTER,
  SET_INNER_TIMELINE_DATES,
  SET_OUTER_TIMELINE_DATES
} from '../actions';

export function setFlagFilter(flag) {
  return {
    type: SET_FLAG_FILTER,
    payload: flag
  };
}

export function setInnerTimelineDates(innerTimelineDates) {
  return {
    type: SET_INNER_TIMELINE_DATES,
    payload: innerTimelineDates
  };
}

export function setOuterTimelineDates(outerTimelineDates) {
  return {
    type: SET_OUTER_TIMELINE_DATES,
    payload: outerTimelineDates
  };
}
