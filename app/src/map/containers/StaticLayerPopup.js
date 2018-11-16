import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import StaticLayerPopup from 'map/components/StaticLayerPopup.jsx';
import { toggleCurrentReportPolygon } from 'report/reportActions';
// TODO MAP MODULE
// import { clearPopup } from 'map/mapInteractionActions.js';

const getWorkspaceLayers = state => state.layers.workspaceLayers;
const getReport = state => state.report;
const getEvent = (state, ownProps) => ownProps.event;

const getPopupData = createSelector(
  [getWorkspaceLayers, getReport, getEvent],
  (workspaceLayers, report, event) => {
    console.log(event)
    const layerId = event.layer.id;
    const staticLayer = workspaceLayers.find(l => l.id === layerId);

    const layerIsInReport = report.layerId === layerId;
    // if (metaFields === null || (FEATURE_FLAG_EXTENDED_POLYGON_LAYERS === false && layerIsInReport === false)) {
    //   return;
    // }

    const isInReport = (layerIsInReport === true)
      ? report.polygons.find(polygon => polygon.reportingId === event.target.properties.reporting_id)
      : null;

    return {
      layerTitle: staticLayer.title,
      fields: event.target.fields,
      isInReport
    };
  }
);

const mapStateToProps = (state, ownProps) => ({
  popup: getPopupData(state, ownProps)
});

const mapDispatchToProps = dispatch => ({
  toggleCurrentReportPolygon: () => {
    dispatch(toggleCurrentReportPolygon());
  },
  // clearPopup: () => {
  //   dispatch(clearPopup());
  // }
});

export default connect(mapStateToProps, mapDispatchToProps)(StaticLayerPopup);
