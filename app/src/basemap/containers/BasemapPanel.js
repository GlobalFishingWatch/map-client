import { connect } from 'react-redux';
import BasemapPanel from 'basemap/components/BasemapPanel';
import { setBasemap } from 'map/mapStyleActions';

const mapStateToProps = state => ({
  activeBasemap: state.mapStyle.activeBasemap,
  basemaps: state.mapStyle.basemaps
});

const mapDispatchToProps = dispatch => ({
  setBasemap: (basemap) => {
    dispatch(setBasemap(basemap));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BasemapPanel);
