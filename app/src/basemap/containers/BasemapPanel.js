import { connect } from 'react-redux';
import BasemapPanel from 'basemap/components/BasemapPanel';
import { setLayerInfoModal } from 'actions/map';
import { setBasemap } from 'basemap/basemapActions';

const mapStateToProps = state => ({
  activeBasemap: state.basemap.activeBasemap,
  basemaps: state.basemap.basemaps
});

const mapDispatchToProps = dispatch => ({
  setBasemap: (basemap) => {
    dispatch(setBasemap(basemap));
  },
  openLayerInfoModal: (modalParams) => {
    dispatch(setLayerInfoModal(modalParams));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BasemapPanel);
