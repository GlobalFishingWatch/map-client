import { connect } from 'react-redux';
import SubMenu from 'components/MapPanels/rightControlPanel/components/SubMenu';
import { setSubmenu } from 'components/MapPanels/rightControlPanel/rightControlPanelActions';


const mapDispatchToProps = dispatch => ({
  setSubmenu: (submenuName) => {
    dispatch(setSubmenu(submenuName));
  }
});

export default connect(null, mapDispatchToProps)(SubMenu);
