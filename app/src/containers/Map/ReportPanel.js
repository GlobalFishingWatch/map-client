import { connect } from 'react-redux';
import ReportPanel from 'components/Map/ReportPanel';

const mapStateToProps = (state) => ({
  polygons: state.report.polygons
});

const mapDispatchToProps = () => ({
  onDiscardReport: () => {
    // replace this with an action
    console.info('onDiscardReport');
  },
  onRemovePolygon: () => {
    // replace this with an action
    console.info('onRemovePolygon');
  },
  onSendReport: () => {
    // replace this with an action
    console.info('onSendReport');
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ReportPanel);
