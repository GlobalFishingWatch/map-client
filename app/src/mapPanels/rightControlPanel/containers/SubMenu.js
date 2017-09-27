import { connect } from 'react-redux';
import SubMenu from 'mapPanels/rightControlPanel/components/SubMenu';
import { setSubmenu } from 'mapPanels/rightControlPanel/rightControlPanelActions';


const mapDispatchToProps = dispatch => ({
  setSubmenu: (submenuName) => {
    dispatch(setSubmenu(submenuName));
  }
});

export default connect(null, mapDispatchToProps)(SubMenu);
