import { connect } from 'react-redux';
import ClusterInfoWindow from 'components/Map/ClusterInfoWindow';

const mapStateToProps = state => ({
  clickableCluster: state.heatmap.highlightedVessels.clickableCluster,
  latLng: state.heatmap.highlightedVessels.latLng
});

export default connect(mapStateToProps, null)(ClusterInfoWindow);
