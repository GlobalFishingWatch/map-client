import { connect } from 'react-redux';
import AreasForm from 'areasOfInterest/components/AreasForm';
import { setDrawingMode } from 'actions/map';
import { saveAreaOfInterest, updateWorkingAreaOfInterest,
  setEditAreaIndex, updateAreaOfInterest } from 'areasOfInterest/areasOfInterestActions';

const mapStateToProps = state => ({
  isDrawing: state.map.isDrawing,
  editingArea: state.areas.editingArea,
  editAreaIndex: state.areas.editAreaindex
});

const mapDispatchToProps = dispatch => ({
  setDrawingMode: (value) => {
    dispatch(setDrawingMode(value));
  },
  saveAreaOfInterest: () => {
    dispatch(saveAreaOfInterest());
  },
  setEditAreaIndex: (index) => {
    dispatch(setEditAreaIndex(index));
  },
  updateAreaOfInterest: () => {
    dispatch(updateAreaOfInterest());
  },
  updateWorkingAreaOfInterest: (area) => {
    dispatch(updateWorkingAreaOfInterest(area));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AreasForm);
