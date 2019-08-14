import { connect } from 'react-redux'
import Timebar from 'app/timebar/components/Timebar'
import {
  setInnerTimelineDates,
  setOuterTimelineDates,
  setTimelineHoverDates,
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
  updateTimelineOverDates: (dates) => {
    dispatch(setTimelineHoverDates(dates))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timebar)
