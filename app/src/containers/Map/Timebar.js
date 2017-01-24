import { connect } from 'react-redux';
import Timebar from 'components/Map/Timebar';
import {
  setInnerTimelineDates,
  setOuterTimelineDates,
  setPlayingStatus,
  setTimelineHoverDates
} from 'actions/filters';
import {
  trackOuterTimelineRangeSwitch
} from 'actions/analytics';

const mapStateToProps = state => ({
  timelineOverallExtent: state.filters.timelineOverallExtent,
  timelineOuterExtent: state.filters.timelineOuterExtent,
  timelineInnerExtent: state.filters.timelineInnerExtent,
  timelinePaused: state.filters.timelinePaused
});

const mapDispatchToProps = dispatch => ({
  updateInnerTimelineDates: (dates) => {
    dispatch(setInnerTimelineDates(dates));
  },
  updateOuterTimelineDates: (dates) => {
    dispatch(setOuterTimelineDates(dates));
  },
  updatePlayingStatus: (paused) => {
    dispatch(setPlayingStatus(paused));
  },
  updateTimelineOverDates: (dates) => {
    dispatch(setTimelineHoverDates(dates));
  },
  trackOuterTimelineRangeSwitch: (dates) => {
    dispatch(trackOuterTimelineRangeSwitch(dates[0], dates[1]));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Timebar);
