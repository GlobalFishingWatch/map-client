import { connect } from 'react-redux';
import SearchResult from 'components/Map/SearchResult';
import { addVessel } from 'actions/vesselInfo';

const mapDispatchToProps = (dispatch) => ({
  drawVessel: (vesselDetails) => {
    dispatch(addVessel(vesselDetails.seriesgroup, null, true));
  }
});

export default connect(null, mapDispatchToProps)(SearchResult);
