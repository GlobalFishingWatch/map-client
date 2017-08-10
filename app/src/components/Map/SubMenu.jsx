import PropTypes from 'prop-types';
import React from 'preact';
import ControlPanelStyles from 'styles/components/control_panel.scss';
import InfoIcon from 'babel!svg-react!assets/icons/info-icon.svg?name=InfoIcon';

function SubMenu({ title, icon, children, onBack }) {
  return (
    <div className={ControlPanelStyles.submenu}>
      <div className={ControlPanelStyles.submenuHeader} >
        <InfoIcon onClick={onBack} />
        <h2 className={ControlPanelStyles.submenuTitle} >{title}</h2>
        {icon}
      </div>
      {children}
    </div>
  );
}

SubMenu.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  onBack: PropTypes.func.isRequired
};

export default SubMenu;
