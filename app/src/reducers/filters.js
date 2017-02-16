import {
  SET_INNER_TIMELINE_DATES,
  SET_INNER_TIMELINE_DATES_FROM_WORKSPACE,
  SET_OUTER_TIMELINE_DATES,
  SET_FLAG_FILTERS,
  SET_PLAYING_STATUS,
  SET_TIMELINE_HOVER_DATES,
  SET_OVERALL_TIMELINE_DATES
} from 'actions';
import {
  TIMELINE_DEFAULT_INNER_START_DATE,
  TIMELINE_DEFAULT_INNER_END_DATE,
  TIMELINE_DEFAULT_OUTER_START_DATE,
  TIMELINE_DEFAULT_OUTER_END_DATE,
  TIMELINE_OVERALL_START_DATE,
  TIMELINE_OVERALL_END_DATE
} from 'constants';
import { getOffsetedTimeAtPrecision } from 'actions/helpers/heatmapTileData';

const initialState = {
  timelineOverallExtent: [TIMELINE_OVERALL_START_DATE, TIMELINE_OVERALL_END_DATE],
  timelineOuterExtent: [TIMELINE_DEFAULT_OUTER_START_DATE, TIMELINE_DEFAULT_OUTER_END_DATE],
  timelineInnerExtent: [TIMELINE_DEFAULT_INNER_START_DATE, TIMELINE_DEFAULT_INNER_END_DATE],
  timelineInnerExtentIndexes: [
    getOffsetedTimeAtPrecision(TIMELINE_DEFAULT_INNER_START_DATE.getTime()),
    getOffsetedTimeAtPrecision(TIMELINE_DEFAULT_INNER_END_DATE.getTime())
  ],
  timelinePaused: true,
  flags: [],
  flagsLayers: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_INNER_TIMELINE_DATES_FROM_WORKSPACE:
    case SET_INNER_TIMELINE_DATES: {
      const timelineInnerExtent = action.payload;
      const startTimestamp = timelineInnerExtent[0].getTime();
      const endTimestamp = timelineInnerExtent[1].getTime();
      const startIndex = getOffsetedTimeAtPrecision(startTimestamp);
      const endIndex = getOffsetedTimeAtPrecision(endTimestamp);
      const timelineInnerExtentIndexes = [startIndex, endIndex];

      return Object.assign({}, state, {
        timelineInnerExtent, timelineInnerExtentIndexes
      });
    }
    case SET_OUTER_TIMELINE_DATES:
      return Object.assign({}, state, {
        timelineOuterExtent: [
          new Date(Math.max(action.payload[0], state.timelineOverallExtent[0])),
          new Date(Math.min(action.payload[1], state.timelineOverallExtent[1]))
        ]
      });
    case SET_OVERALL_TIMELINE_DATES: {
      const timelineOverallExtent = [
        new Date(Math.min(action.payload[0], state.timelineOverallExtent[0])),
        new Date(Math.max(action.payload[1], state.timelineOverallExtent[1]))
      ];
      const timelineOuterExtent = [
        new Date(Math.max(timelineOverallExtent[0], state.timelineOuterExtent[0])),
        new Date(Math.min(timelineOverallExtent[1], state.timelineOuterExtent[1]))
      ];
      return Object.assign({}, state, {
        timelineOverallExtent,
        timelineOuterExtent
      });
    }
    case SET_FLAG_FILTERS:
      return Object.assign({}, state, {
        flags: action.payload.flagFilters, flagsLayers: action.payload.flagFiltersLayers
      });
    case SET_PLAYING_STATUS:
      return Object.assign({}, state, {
        timelinePaused: action.payload
      });
    case SET_TIMELINE_HOVER_DATES:
      return Object.assign({}, state, {
        timelineOverExtent: action.payload
      });
    default:
      return state;
  }
}
