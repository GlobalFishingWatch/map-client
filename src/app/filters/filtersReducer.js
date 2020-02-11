import {
  SET_FLAG_FILTERS,
  SET_INNER_TIMELINE_DATES,
  SET_INNER_TIMELINE_DATES_FROM_WORKSPACE,
  SET_OUTER_TIMELINE_DATES,
  SET_OVERALL_TIMELINE_DATES,
  SET_TIMELINE_HOVER_DATES,
} from 'app/filters/filtersActions'
import {
  TIMELINE_DEFAULT_INNER_START_DATE,
  TIMELINE_DEFAULT_INNER_END_DATE,
  TIMELINE_DEFAULT_OUTER_START_DATE,
  TIMELINE_DEFAULT_OUTER_END_DATE,
  TIMELINE_OVERALL_START_DATE,
  TIMELINE_OVERALL_END_DATE,
} from 'app/config'

const initialState = {
  timelineOverallExtent: [TIMELINE_OVERALL_START_DATE, TIMELINE_OVERALL_END_DATE],
  timelineOuterExtent: [TIMELINE_DEFAULT_OUTER_START_DATE, TIMELINE_DEFAULT_OUTER_END_DATE],
  timelineInnerExtent: [TIMELINE_DEFAULT_INNER_START_DATE, TIMELINE_DEFAULT_INNER_END_DATE],
  timelineOverExtent: [TIMELINE_DEFAULT_INNER_START_DATE, TIMELINE_DEFAULT_INNER_END_DATE],
  timelinePaused: true,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_INNER_TIMELINE_DATES_FROM_WORKSPACE:
    case SET_INNER_TIMELINE_DATES: {
      const timelineInnerExtent = action.payload
      return Object.assign({}, state, { timelineInnerExtent })
    }
    case SET_OUTER_TIMELINE_DATES:
      return Object.assign({}, state, {
        timelineOuterExtent: [
          new Date(Math.max(action.payload[0], state.timelineOverallExtent[0])),
          new Date(Math.min(action.payload[1], state.timelineOverallExtent[1])),
        ],
      })
    case SET_OVERALL_TIMELINE_DATES: {
      const timelineOverallExtent = [
        new Date(Math.min(action.payload[0], state.timelineOverallExtent[0])),
        new Date(Math.max(action.payload[1], state.timelineOverallExtent[1])),
      ]
      const timelineOuterExtent = [
        new Date(Math.max(timelineOverallExtent[0], state.timelineOuterExtent[0])),
        new Date(Math.min(timelineOverallExtent[1], state.timelineOuterExtent[1])),
      ]
      return Object.assign({}, state, {
        timelineOverallExtent,
        timelineOuterExtent,
      })
    }
    /** @deprecated use filterGroups logic instead */
    case SET_FLAG_FILTERS: {
      return Object.assign({}, state, {
        flags: action.payload.flagFilters,
        flagsLayers: action.payload.flagFiltersLayers,
      })
    }

    case SET_TIMELINE_HOVER_DATES: {
      const timelineOverExtent = action.payload
      const trimmedOverExtent = [
        new Date(Math.max(state.timelineInnerExtent[0].getTime(), timelineOverExtent[0].getTime())),
        new Date(Math.min(state.timelineInnerExtent[1].getTime(), timelineOverExtent[1].getTime())),
      ]
      return Object.assign({}, state, {
        timelineOverExtent: trimmedOverExtent,
      })
    }

    default:
      return state
  }
}
