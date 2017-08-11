import { connect } from 'react-redux';
import DrawingManager from 'components/Map/DrawingManager';
import { updateWorkingAreaOfInterest } from 'actions/areas';

const mapStateToProps = state => ({
  map: state.map.googleMaps,
  polygonColor: state.areas.editingArea.color
});

const mapDispatchToProps = dispatch => ({
  updateWorkingAreaOfInterest: (area) => {
    dispatch(updateWorkingAreaOfInterest(area));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawingManager);
