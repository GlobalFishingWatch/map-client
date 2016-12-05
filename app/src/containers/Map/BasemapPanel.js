import { connect } from 'react-redux';
import BasemapPanel from '../../components/Map/BasemapPanel';
import { setBasemap, setLayerInfoModal } from '../../actions/map';

const mapStateToProps = (state) => ({
  active_basemap: state.map.active_basemap,
  basemaps: state.map.basemaps
});

const mapDispatchToProps = (dispatch) => ({
  setBasemap: basemap => {
    dispatch(setBasemap(basemap));
  },
  openLayerInfoModal: modalParams => {
    dispatch(setLayerInfoModal(modalParams));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BasemapPanel);
