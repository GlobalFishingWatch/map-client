import { connect } from 'react-redux';
import ActivityLayers from 'activityLayers/components/ActivityLayers.jsx';

const mapStateToProps = state => ({
  viewport: state.mapViewport
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivityLayers);
