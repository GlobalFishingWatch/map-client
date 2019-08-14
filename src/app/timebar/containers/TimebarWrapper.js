import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { maxBy } from 'lodash'
import TimebarWrapper from 'app/timebar/components/TimebarWrapper'
import {
  setInnerTimelineDates,
  setTimelineHoverDates,
  // setOuterTimelineDates,
} from 'app/filters/filtersActions'

const getInnerExtent = (state) => state.filters.timelineInnerExtent
const getOverallExtent = (state) => state.filters.timelineOverallExtent

const getStart = createSelector(
  [getInnerExtent],
  (innerExtent) => innerExtent[0].toISOString()
)
const getEnd = createSelector(
  [getInnerExtent],
  (innerExtent) => innerExtent[1].toISOString()
)
const getAbsoluteStart = createSelector(
  [getOverallExtent],
  (overallExtent) => overallExtent[0].toISOString()
)
const getAbsoluteEnd = createSelector(
  [getOverallExtent],
  (overallExtent) => overallExtent[1].toISOString()
)
const getActivity = createSelector(
  [(state) => state.timebar.chartData],
  (chartData) => {
    console.log(chartData)
    if (chartData === undefined || chartData === null || !chartData.length) return null
    const maxValueItem = maxBy(chartData, (d) => d.value)
    return chartData.map((d) => ({
      ...d,
      value: d.value / maxValueItem.value,
    }))
    return chartData
  }
)

const mapStateToProps = (state) => ({
  start: getStart(state),
  end: getEnd(state),
  absoluteStart: getAbsoluteStart(state),
  absoluteEnd: getAbsoluteEnd(state),
  activity: getActivity(state),
})

const mapDispatchToProps = (dispatch) => ({
  // updateOuterTimelineDates: (dates, startChanged) => {
  //   dispatch(setOuterTimelineDates(dates, startChanged))
  // },
  update: (start, end) => {
    // TODO update outer when needed
    dispatch(setInnerTimelineDates([new Date(start), new Date(end)]))
  },
  updateOver: (clientX, scale) => {
    const hoverStart = scale(clientX - 10)
    const hoverEnd = scale(clientX + 10)
    dispatch(setTimelineHoverDates([hoverStart, hoverEnd]))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimebarWrapper)
