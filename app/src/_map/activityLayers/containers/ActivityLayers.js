import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import ActivityLayers from '../components/ActivityLayers.jsx';
import { queryHeatmapVessels } from '../heatmapTilesActions';
import { exportNativeViewport } from '../../map/mapViewportActions';

const getTracks = state => state.mapTracks;
const getVessels = state => state.vesselInfo.vessels;
// TODO: eventually tracks will be connected like this:
// const getTracks = (state, ownProps) => ownProps.workspace.vessels;
const getEncounter = state => state.encounters.encountersInfo;

const getAllTracks = createSelector(
  [getTracks, getVessels, getEncounter],
  (tracks, vessels, encounter) => {
    const allTracks = tracks.map((track) => {
      let matchingVessel;
      if (encounter !== null && encounter !== undefined) {
        matchingVessel = encounter.vessels.find(vessel => vessel.seriesgroup === track.seriesgroup);
      } else {
        matchingVessel = vessels.find(vessel =>
          vessel.seriesgroup === track.seriesgroup &&
          (vessel.series === track.series || vessel.series === undefined)
        );
      }
      if (matchingVessel === undefined || (matchingVessel.visible === false && matchingVessel.shownInInfoPanel === false)) {
        return null;
      }
      return { ...track, color: matchingVessel.color };
    });
    return allTracks.filter(t => t !== null);
  }
);

const mapStateToProps = (state, ownProps) => ({
  layers: state.layers.workspaceLayers, // OUTSIDE
  heatmapLayers: state.heatmap.heatmapLayers,
  timelineInnerExtentIndexes: state.filters.timelineInnerExtentIndexes, // OUTSIDE
  timelineOverExtentIndexes: state.filters.timelineOverExtentIndexes, // OUTSIDE
  highlightedVessels: state.heatmap.highlightedVessels,
  highlightedClickedVessel: state.heatmap.highlightedClickedVessel,
  viewport: state.mapViewport.viewport,
  zoom: state.mapViewport.viewport.zoom,
  leftWorldScaled: state.mapViewport.leftWorldScaled,
  rightWorldScaled: state.mapViewport.rightWorldScaled,
  layerFilters: state.filterGroups.layerFilters, // OUTSIDE
  allTracks: getAllTracks(state, ownProps), // OUTSIDE (vesselInfo)
  highlightedTrack: state.vesselInfo.highlightedTrack // OUTSIDE
});

const mapDispatchToProps = dispatch => ({
  queryHeatmapVessels: (coords) => {
    dispatch(queryHeatmapVessels(coords));
  },
  exportNativeViewport: (viewport) => {
    dispatch(exportNativeViewport(viewport));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivityLayers);
