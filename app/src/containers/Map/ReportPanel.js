import { connect } from 'react-redux';
import ReportPanel from 'components/Map/ReportPanel';
import { deletePolygon, discardReport, sendReport } from 'actions/report';

const mapStateToProps = (state) => ({
  polygons: state.report.polygons,
  visible: state.report.layerId !== null,
  layerTitle: state.report.layerTitle
});

const mapDispatchToProps = (dispatch) => ({
  onDiscardReport: () => {
    dispatch(discardReport());
  },
  onRemovePolygon: (index) => {
    dispatch(deletePolygon(index));
  },
  onSendReport: () => {
    dispatch(sendReport());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ReportPanel);
