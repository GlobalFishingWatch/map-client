import { connect } from 'react-redux';
import AreasForm from 'areasOfInterest/components/AreasForm';
import { setDrawingMode } from 'actions/map';
import { saveAreaOfInterest, updateWorkingAreaOfInterest } from 'areasOfInterest/areasOfInterestActions';

const mapStateToProps = state => ({
  isDrawing: state.map.isDrawing,
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
