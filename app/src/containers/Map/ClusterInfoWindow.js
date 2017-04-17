import { connect } from 'react-redux';
import ClusterInfoWindow from 'components/Map/ClusterInfoWindow';
// import { toggleReportPolygon, clearPolygon } from 'actions/report';

const mapStateToProps = state => ({
  isCluster: state.heatmap.highlightedVessel.isCluster,
  latLng: state.heatmap.highlightedVessel.latLng
});

// const mapDispatchToProps = dispatch => ({
//   toggleReportPolygon: (polygonId) => {
//     dispatch(toggleReportPolygon(polygonId));
//   },
//   clearPolygon: () => {
//     dispatch(clearPolygon());
//   }
// });

export default connect(mapStateToProps, null)(ClusterInfoWindow);
