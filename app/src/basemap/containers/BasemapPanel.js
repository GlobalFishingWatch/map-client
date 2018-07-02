import { connect } from 'react-redux';
import BasemapPanel from 'basemap/components/BasemapPanel';
import { updateBasemap } from 'basemap/basemapActions';

const mapStateToProps = state => ({
  basemapLayers: state.basemap.basemapLayers
});

const mapDispatchToProps = dispatch => ({
  setBasemap: (basemapId) => {
    dispatch(updateBasemap(basemapId, true));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BasemapPanel);
