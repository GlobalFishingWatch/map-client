import { connect } from 'react-redux';
import BasemapPanel from '../../components/Map/BasemapPanel';
import { toggleLayerVisibility } from '../../actions/map';


const mapStateToProps = (state) => ({
  basemapLayers: state.map.basemapLayers
});

const mapDispatchToProps = (dispatch) => ({
  toggleLayerVisibility: layer => {
    dispatch(toggleLayerVisibility(layer));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BasemapPanel);
