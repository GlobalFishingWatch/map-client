import { connect } from 'react-redux';
import AreasForm from 'components/Map/AreasForm';
import { setDrawingMode } from 'actions/map';
import { saveAreaOfInterest, updateWorkingAreaOfInterest } from 'actions/areas';

const mapStateToProps = state => ({
  drawing: state.map.drawing,
  editingArea: state.areas.editingArea
});

const mapDispatchToProps = dispatch => ({
  setDrawingMode: (value) => {
    dispatch(setDrawingMode(value));
  },
  saveAreaOfInterest: () => {
    dispatch(saveAreaOfInterest());
  },
  updateWorkingAreaOfInterest: (area) => {
    dispatch(updateWorkingAreaOfInterest(area));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AreasForm);
