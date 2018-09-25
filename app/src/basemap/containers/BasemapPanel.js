import { connect } from 'react-redux';
import BasemapPanel from 'basemap/components/BasemapPanel';
import { showBasemap, toggleBasemapOption } from 'basemap/basemapActions';

const mapStateToProps = state => ({
  basemapLayers: state.basemap.basemapLayers
});

const mapDispatchToProps = dispatch => ({
  showBasemap: (basemapId) => {
    dispatch(showBasemap(basemapId));
  },
  toggleBasemapOption: (basemapOptionId) => {
    dispatch(toggleBasemapOption(basemapOptionId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BasemapPanel);
