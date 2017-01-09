import { connect } from 'react-redux';
import LayerManagement from 'components/Map/LayerManagement';
import { setLayerLibraryModalVisivility } from 'actions/map';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  setLayerLibraryModalVisivility: () => {
    dispatch(setLayerLibraryModalVisivility(true));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerManagement);
