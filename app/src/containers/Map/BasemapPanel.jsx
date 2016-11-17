import { connect } from 'react-redux';
import BasemapPanel from '../../components/Map/BasemapPanel';
import { toggleLayerVisibility } from '../../actions/map';
import { BASEMAP_TYPES } from '../../constants';

const mapStateToProps = (state) => ({
  layers: state.map.layers.filter((l) => BASEMAP_TYPES.indexOf(l.type) !== -1)
});

const mapDispatchToProps = (dispatch) => ({
  toggleLayerVisibility: layer => {
    dispatch(toggleLayerVisibility(layer));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BasemapPanel);
