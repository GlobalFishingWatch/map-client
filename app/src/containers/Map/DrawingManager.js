import { connect } from 'react-redux';
import DrawingManager from 'components/Map/DrawingManager';
import { saveEditingArea } from 'actions/areas';

const mapStateToProps = state => ({
  map: state.map.googleMaps,
  polygonColor: state.areas.editingArea.color,
});

const mapDispatchToProps = dispatch => ({
  saveEditingArea: (area) => {
    dispatch(saveEditingArea(area));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawingManager);
