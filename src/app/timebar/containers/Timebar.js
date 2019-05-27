import { connect } from 'react-redux'
import Timebar from 'app/timebar/components/Timebar'
import {
  setInnerTimelineDates,
  setOuterTimelineDates,
  setPlayingStatus,
  setTimelineHoverDates,
  rewindTimeline,
  changeSpeed,
} from 'app/filters/filtersActions'

const mapStateToProps = (state) => ({
  timebarChartData: state.timebar.chartData,
  timelineOverallExtent: state.filters.timelineOverallExtent,
  timelineOuterExtent: state.filters.timelineOuterExtent,
  timelineInnerExtent: state.filters.timelineInnerExtent,
  timelinePaused: state.filters.timelinePaused,
  timelineSpeed: state.filters.timelineSpeed,
})

const mapDispatchToProps = (dispatch) => ({
  updateInnerTimelineDates: (dates) => {
    dispatch(setInnerTimelineDates(dates))
  },
  updateOuterTimelineDates: (dates, startChanged) => {
    dispatch(setOuterTimelineDates(dates, startChanged))
  },
  updatePlayingStatus: (paused) => {
    dispatch(setPlayingStatus(paused))
  },
  updateTimelineOverDates: (dates) => {
    dispatch(setTimelineHoverDates(dates))
  },
  rewind: () => {
    dispatch(rewindTimeline())
  },
  changeSpeed: (shouldDecrease) => {
    dispatch(changeSpeed(shouldDecrease))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timebar)
