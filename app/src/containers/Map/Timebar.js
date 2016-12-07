import { connect } from 'react-redux';
import Timebar from 'components/Map/Timebar';
import {
  setInnerTimelineDates,
  setOuterTimelineDates,
  setPlayingStatus,
  setTimelineOverDates
} from 'actions/filters';

const mapStateToProps = state => ({
  filters: state.filters
});

const mapDispatchToProps = dispatch => ({
  updateInnerTimelineDates: dates => {
    dispatch(setInnerTimelineDates(dates));
  },
  updateOuterTimelineDates: dates => {
    dispatch(setOuterTimelineDates(dates));
  },
  updatePlayingStatus: paused => {
    dispatch(setPlayingStatus(paused));
  },
  updateTimelineOverDates: dates => {
    dispatch(setTimelineOverDates(dates));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Timebar);
