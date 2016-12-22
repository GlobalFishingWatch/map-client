import { connect } from 'react-redux';
import ReportPanel from 'components/Map/ReportPanel';

const mapStateToProps = (state) => ({
  polygons: state.map.report.polygons
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ReportPanel);
