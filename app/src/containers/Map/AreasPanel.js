import { connect } from 'react-redux';
import AreasPanel from 'components/Map/AreasPanel';
import { setDrawingMode } from 'actions/map';

const mapStateToProps = state => ({
  drawing: state.map.drawing,
  editingArea: state.areas.editingArea
});

const mapDispatchToProps = dispatch => ({
  setDrawingMode: (value) => {
    dispatch(setDrawingMode(value));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AreasPanel);
