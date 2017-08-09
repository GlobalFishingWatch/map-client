import { connect } from 'react-redux';
import AreasForm from 'components/Map/AreasForm';
import { setDrawingMode } from 'actions/map';
import { saveArea, updateWorkingAreaOfInterest } from 'actions/areas';

const mapStateToProps = state => ({
  drawing: state.map.drawing,
  editingArea: state.areas.editingArea
});

const mapDispatchToProps = dispatch => ({
  setDrawingMode: (value) => {
    dispatch(setDrawingMode(value));
  },
  saveArea: () => {
    dispatch(saveArea());
  },
  updateWorkingAreaOfInterest: (area) => {
    dispatch(updateWorkingAreaOfInterest(area));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AreasForm);
