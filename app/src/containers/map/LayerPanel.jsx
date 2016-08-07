import { connect } from 'react-redux';
import LayerPanel from '../../components/map/LayerPanel';
import { toggleLayerVisibility } from '../../actions/map';

const mapStateToProps = (state) => ({
  layers: state.map.layers
});

const mapDispatchToProps = (dispatch) => ({
  toggleLayerVisibility: (layer) => {
    dispatch(toggleLayerVisibility(layer));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerPanel);
