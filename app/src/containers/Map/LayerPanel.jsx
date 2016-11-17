import { connect } from 'react-redux';
import LayerPanel from '../../components/Map/LayerPanel';
import { toggleLayerVisibility, setLayerOpacity } from '../../actions/map';
import { BASEMAP_TYPES } from '../../constants';

const mapStateToProps = (state) => ({
  layers: state.map.layers.filter((l) => BASEMAP_TYPES.indexOf(l.type) === -1)
});

const mapDispatchToProps = (dispatch) => ({
  toggleLayerVisibility: (layer) => {
    dispatch(toggleLayerVisibility(layer));
  },
  setLayerOpacity: (transparency, layer) => {
    dispatch(setLayerOpacity(transparency, layer));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerPanel);
