import { trackInnerTimelineChange } from 'app/analytics/analyticsActions'
import { TIMELINE_MIN_INNER_EXTENT } from 'app/config'

export const SAVE_FILTER_GROUP = 'SAVE_FILTER_GROUP'
export const SET_FILTER_GROUP_MODAL_VISIBILITY = 'SET_FILTER_GROUP_MODAL_VISIBILITY'
export const SET_FILTER_GROUP_VISIBILITY = 'SET_FILTER_GROUP_VISIBILITY'
export const SET_FLAG_FILTERS = 'SET_FLAG_FILTERS'
export const SET_INNER_TIMELINE_DATES = 'SET_INNER_TIMELINE_DATES'
export const SET_INNER_TIMELINE_DATES_FROM_WORKSPACE = 'SET_INNER_TIMELINE_DATES_FROM_WORKSPACE'
export const SET_OUTER_TIMELINE_DATES = 'SET_OUTER_TIMELINE_DATES'
export const SET_OVERALL_TIMELINE_DATES = 'SET_OVERALL_TIMELINE_DATES'
export const SET_PLAYING_STATUS = 'SET_PLAYING_STATUS'
export const SET_TIMELINE_HOVER_DATES = 'SET_TIMELINE_HOVER_DATES'

const getRangeDuration = (range) => range[1].getTime() - range[0].getTime()

export function setInnerTimelineDates(innerTimelineDates) {
  return (dispatch, getState) => {
    trackInnerTimelineChange(dispatch, innerTimelineDates, getState().filters.timelineInnerExtent)

    dispatch({
      type: SET_INNER_TIMELINE_DATES,
      payload: innerTimelineDates,
    })
  }
}

export function setOuterTimelineDates(outerTimelineDates) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_OUTER_TIMELINE_DATES,
      payload: outerTimelineDates,
    })
  }
}

export function setTimelineHoverDates(overDates) {
  return {
    type: SET_TIMELINE_HOVER_DATES,
    payload: overDates,
  }
}

// change Timebar bounds, so that
// - outer bounds fits time range of tracks (filtered by series if applicable)
// - outer bounds is not less than a week
// - inner bounds start is moved to beginning of outer bounds if it's outside
// - inner bounds end is moved to fit in outer bounds
export function fitTimelineToTrack(tracksExtent) {
  return (dispatch, getState) => {
    let tracksDuration = tracksExtent[1] - tracksExtent[0]

    if (tracksDuration < TIMELINE_MIN_INNER_EXTENT) {
      tracksExtent[1] = tracksExtent[0] + TIMELINE_MIN_INNER_EXTENT
      tracksDuration = TIMELINE_MIN_INNER_EXTENT
    }

    const currentInnerExtent = getState().filters.timelineInnerExtent
    const currentInnerExtentStart = currentInnerExtent[0].getTime()
    const currentInnerExtentEnd = currentInnerExtent[1].getTime()
    const currentInnerDuration = currentInnerExtentEnd - currentInnerExtentStart
    let newInnerExtentStart = currentInnerExtentStart
    let newInnerExtentEnd = currentInnerExtentEnd

    if (newInnerExtentStart < tracksExtent[0] || newInnerExtentStart > tracksExtent[1]) {
      newInnerExtentStart = tracksExtent[0]
      newInnerExtentEnd = newInnerExtentStart + currentInnerDuration
    }

    if (newInnerExtentEnd > tracksExtent[1]) {
      newInnerExtentEnd = newInnerExtentStart + tracksDuration * 0.1
    }

    dispatch(setInnerTimelineDates([new Date(newInnerExtentStart), new Date(newInnerExtentEnd)]))
    dispatch(setOuterTimelineDates([new Date(tracksExtent[0]), new Date(tracksExtent[1])]))
  }
}
