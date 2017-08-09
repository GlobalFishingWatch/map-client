import { connect } from 'react-redux';
import AreasPanel from 'components/Map/AreasPanel';
import { setDrawingMode } from 'actions/map';
import { saveAreaOfInterest, updateWorkingAreaOfInterest, toggleAreaVisibility } from 'actions/areas';

const mapStateToProps = state => ({
  areas: state.areas.data
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
  },
  toggleAreaVisibility: (areaIndex) => {
    dispatch(toggleAreaVisibility(areaIndex));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AreasPanel);