import { connect } from 'react-redux';
import MenuMobile from '../components/Shared/MenuMobile';
import { setVisibleMenu } from '../actions/appearence';

const mapStateToProps = (state) => ({
  menuVisible: state.appearance.menuVisible
});

const mapDispatchToProps = (dispatch) => ({
  setVisibleMenu: (visible) => {
    dispatch(setVisibleMenu(visible));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuMobile);
