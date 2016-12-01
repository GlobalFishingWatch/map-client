import { connect } from 'react-redux';
import Timebar from '../../components/Map/Timebar';
import { setInnerTimelineDates, setOuterTimelineDates } from '../../actions/filters';

const mapStateToProps = state => ({
  filters: state.filters
});

const mapDispatchToProps = dispatch => ({
  updateInnerTimelineDates: filters => {
    dispatch(setInnerTimelineDates(filters));
  },
  updateOuterTimelineDates: filters => {
    dispatch(setOuterTimelineDates(filters));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Timebar);
