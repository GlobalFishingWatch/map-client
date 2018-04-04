import { connect } from 'react-redux';
import ActivityLayers from 'activityLayers/components/ActivityLayers.jsx';
import { queryHeatmapVessels } from 'activityLayers/heatmapTilesActions';

const mapStateToProps = state => ({
  layers: state.layers.workspaceLayers,
  heatmapLayers: state.heatmap.heatmapLayers,
  timelineInnerExtentIndexes: state.filters.timelineInnerExtentIndexes,
  zoom: state.mapViewport.viewport.zoom,
  layerFilters: state.filterGroups.layerFilters
});

const mapDispatchToProps = dispatch => ({
  queryHeatmapVessels: (coords, isClick) => {
    dispatch(queryHeatmapVessels(coords, isClick));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivityLayers);
