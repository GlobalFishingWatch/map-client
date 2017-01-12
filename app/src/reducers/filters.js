import {
  SET_INNER_TIMELINE_DATES,
  SET_OUTER_TIMELINE_DATES,
  SET_FLAG_FILTER,
  SET_PLAYING_STATUS,
  SET_TIMELINE_OVER_DATES
} from 'actions';
import {
  TIMELINE_DEFAULT_INNER_START_DATE,
  TIMELINE_DEFAULT_INNER_END_DATE,
  TIMELINE_DEFAULT_OUTER_START_DATE,
  TIMELINE_DEFAULT_OUTER_END_DATE,
  TIMELINE_OVERALL_START_DATE,
  TIMELINE_OVERALL_END_DATE
} from 'constants';
import { getTimeAtPrecision, getOffsetedTimeAtPrecision } from 'actions/helpers/heatmapTileData';

const timelineOverallStartDateOffset = getTimeAtPrecision(TIMELINE_OVERALL_START_DATE);
const initialState = {
  timelineOverallExtent: [TIMELINE_OVERALL_START_DATE, TIMELINE_OVERALL_END_DATE],
  timelineOuterExtent: [TIMELINE_DEFAULT_OUTER_START_DATE, TIMELINE_DEFAULT_OUTER_END_DATE],
  timelineOverallStartDateOffset,
  timelineInnerExtent: [TIMELINE_DEFAULT_INNER_START_DATE, TIMELINE_DEFAULT_INNER_END_DATE],
  timelineInnerExtentIndexes: [
    getOffsetedTimeAtPrecision(TIMELINE_DEFAULT_INNER_START_DATE.getTime(), timelineOverallStartDateOffset),
    getOffsetedTimeAtPrecision(TIMELINE_DEFAULT_INNER_END_DATE.getTime(), timelineOverallStartDateOffset)
  ],
  timelinePaused: true,
  flag: ''
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_INNER_TIMELINE_DATES: {
      const timelineInnerExtent = action.payload;
      const startTimestamp = timelineInnerExtent[0].getTime();
      const endTimestamp = timelineInnerExtent[1].getTime();
      const startIndex = getOffsetedTimeAtPrecision(startTimestamp, state.timelineOverallStartDateOffset);
      const endIndex = getOffsetedTimeAtPrecision(endTimestamp, state.timelineOverallStartDateOffset);
      const timelineInnerExtentIndexes = [startIndex, endIndex];

      return Object.assign({}, state, {
        timelineInnerExtent,
        timelineInnerExtentIndexes
      });
    }
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
