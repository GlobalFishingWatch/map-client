import { connect } from 'react-redux';
import Timeline from '../components/map/timeline';
import { updateFilters } from '../actions/filters';

const mapStateToProps = state => {
  return {
    filters: state.filters
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateFilters: filters => {
      // console.log('t:mapDispatchToProps', filters)
      dispatch(updateFilters(filters));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
