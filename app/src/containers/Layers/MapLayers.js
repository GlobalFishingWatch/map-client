import { connect } from 'react-redux';
import MapLayers from 'components/Layers/MapLayers';
import { showPolygon } from 'actions/report';
import { getTile, releaseTile, queryHeatmap } from 'actions/heatmap';

const mapStateToProps = (state) => ({
  token: state.user.token,
  tilesetUrl: state.map.tilesetUrl,
  zoom: state.map.zoom,
  layers: state.layers,
  heatmap: state.heatmap,
  flag: state.filters.flag,
  timelineOverallExtent: state.filters.timelineOverallExtent, // TODO remove
  timelineInnerExtent: state.filters.timelineInnerExtent,
  timelineInnerExtentIndexes: state.filters.timelineInnerExtentIndexes,
  timelineOuterExtent: state.filters.timelineOuterExtent,
  timelineOverExtent: state.filters.timelineOverExtent,
  timelinePaused: state.filters.timelinePaused,
  vesselTrack: state.vesselInfo.track,
  reportLayerId: state.report.layerId
});

const mapDispatchToProps = (dispatch) => ({
  showPolygon: (id, description, latLng) => {
    dispatch(showPolygon(id, description, latLng));
  },
  createTile: (uid, coordinates, canvas) => {
    dispatch(getTile(uid, coordinates, canvas));
  },
  releaseTile: (uid) => {
    dispatch(releaseTile(uid));
  },
  queryHeatmap: (tileQuery, latLng) => {
    dispatch(queryHeatmap(tileQuery, latLng));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapLayers);
