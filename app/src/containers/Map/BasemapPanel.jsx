import { connect } from 'react-redux';
import BasemapPanel from '../../components/Map/BasemapPanel';
import { toggleVisibility } from '../../actions/vesselInfo';


const mapStateToProps = (state) => ({
  basemapLayers: state.map.basemapLayers
});

const mapDispatchToProps = (dispatch) => ({
  toggleVisibility: visibility => {
    dispatch(toggleVisibility(visibility));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BasemapPanel);
