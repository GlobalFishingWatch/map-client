import { connect } from 'react-redux';
import DrawingManager from 'components/Map/DrawingManager';
import { saveCoordinates } from 'actions/areas';

const mapStateToProps = state => ({
  map: state.map.googleMaps
});

const mapDispatchToProps = dispatch => ({
  saveCoordinates: (coordinates) => {
    dispatch(saveCoordinates(coordinates));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawingManager);
