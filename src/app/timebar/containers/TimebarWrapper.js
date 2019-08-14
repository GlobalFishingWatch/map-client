import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import TimebarWrapper from 'app/timebar/components/TimebarWrapper'
import {
  setInnerTimelineDates,
  // setOuterTimelineDates,
  // setPlayingStatus,
  // setTimelineHoverDates,
  // rewindTimeline,
  // changeSpeed,
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

const mapStateToProps = (state) => ({
  start: getStart(state),
  end: getEnd(state),
  absoluteStart: getAbsoluteStart(state),
  absoluteEnd: getAbsoluteEnd(state),
  // timebarChartData: state.timebar.chartData,
  // timelineOverallExtent: state.filters.timelineOverallExtent,
  // timelineOuterExtent: state.filters.timelineOuterExtent,
  // timelineInnerExtent: state.filters.timelineInnerExtent,
  // timelinePaused: state.filters.timelinePaused,
  // timelineSpeed: state.filters.timelineSpeed,
})

const mapDispatchToProps = (dispatch) => ({
  // updateInnerTimelineDates: (dates) => {
  //   dispatch(setInnerTimelineDates(dates))
  // },
  // updateOuterTimelineDates: (dates, startChanged) => {
  //   dispatch(setOuterTimelineDates(dates, startChanged))
  // },
  // updatePlayingStatus: (paused) => {
  //   dispatch(setPlayingStatus(paused))
  // },
  // updateTimelineOverDates: (dates) => {
  //   dispatch(setTimelineHoverDates(dates))
  // },
  // rewind: () => {
  //   dispatch(rewindTimeline())
  // },
  // changeSpeed: (shouldDecrease) => {
  //   dispatch(changeSpeed(shouldDecrease))
  // },
  update: (start, end) => {
    console.log(start, end)
    dispatch(setInnerTimelineDates([new Date(start), new Date(end)]))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimebarWrapper)
