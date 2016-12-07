import { connect } from 'react-redux';
import FilterPanel from 'components/Map/FilterPanel';
import { setFlagFilter } from 'actions/filters';


const mapStateToProps = (state) => ({
  flag: state.filters.flag
});

const mapDispatchToProps = (dispatch) => ({
  setFlagFilter: flag => {
    dispatch(setFlagFilter(flag));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
