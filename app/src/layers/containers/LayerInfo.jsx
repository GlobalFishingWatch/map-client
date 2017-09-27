import { connect } from 'react-redux';
import LayerInfo from 'layers/components/LayerInfo';

const mapStateToProps = state => ({
  info: state.map.layerModal.info
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LayerInfo);
