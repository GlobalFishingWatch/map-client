import { connect } from 'react-redux';
import LayerManagementModal from 'layers/components/LayerManagementModal';

const mapStateToProps = state => ({
  status: state.customLayer.status
});

export default connect(mapStateToProps, null)(LayerManagementModal);
