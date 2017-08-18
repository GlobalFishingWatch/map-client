import { connect } from 'react-redux';
import SubMenu from 'rightControlPanel/components/SubMenu';
import { setSubmenu } from 'rightControlPanel/rightControlPanelActions';


const mapDispatchToProps = dispatch => ({
  setSubmenu: (submenuName) => {
    dispatch(setSubmenu(submenuName));
  }
});

export default connect(null, mapDispatchToProps)(SubMenu);
