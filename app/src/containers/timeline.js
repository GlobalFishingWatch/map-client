import { connect } from 'react-redux';
import Timeline from '../components/map/Timeline';
import { updateFilters } from '../actions/filters';

const mapStateToProps = state => ({
  filters: state.filters
});

const mapDispatchToProps = dispatch => ({
  updateFilters: filters => {
    // console.log('t:mapDispatchToProps', filters)
    dispatch(updateFilters(filters));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
