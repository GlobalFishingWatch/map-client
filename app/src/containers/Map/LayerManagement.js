import { connect } from 'react-redux';
import LayerManagement from 'components/Map/LayerManagement';
import { setLayerLibraryModalVisibility } from 'actions/map';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  openModal: () => {
    dispatch(setLayerLibraryModalVisibility(true));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerManagement);
