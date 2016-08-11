import { connect } from 'react-redux';
import Timebar from '../../components/Map/Timebar';
import { updateFilters } from '../../actions/filters';

const mapStateToProps = state => ({
  filters: state.filters
});

const mapDispatchToProps = dispatch => ({
  updateFilters: filters => {
    dispatch(updateFilters(filters));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Timebar);
