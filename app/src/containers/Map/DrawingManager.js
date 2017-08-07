import { connect } from 'react-redux';
import DrawingManager from 'components/Map/DrawingManager';
import { createArea } from 'actions/areas';

const mapStateToProps = state => ({
  map: state.map.googleMaps
});

const mapDispatchToProps = dispatch => ({
  createArea: (coordinates) => {
    dispatch(createArea(coordinates));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawingManager);
