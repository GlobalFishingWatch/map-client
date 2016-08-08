import { connect } from 'react-redux';
import Share from '../../components/map/Share';

const mapStateToProps = state => ({
  workspaceId: state.map.workspaceId,
  error: state.map.shareModal.error
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Share);
