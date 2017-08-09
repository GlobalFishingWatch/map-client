import { connect } from 'react-redux';
import AreasPanel from 'components/Map/AreasPanel';
import { setDrawingMode } from 'actions/map';
import { saveArea, saveEditingArea } from 'actions/areas';

const mapStateToProps = state => ({
  drawing: state.map.drawing,
  editingArea: state.areas.editingArea
});

const mapDispatchToProps = dispatch => ({
  setDrawingMode: (value) => {
    dispatch(setDrawingMode(value));
  },
  saveArea: (name, color) => {
    dispatch(saveArea(name, color));
  },
  saveEditingArea: (area) => {
    dispatch(saveEditingArea(area));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AreasPanel);
