import PropTypes from 'prop-types';
import React from 'preact';
import ControlPanelStyles from 'styles/components/control_panel.scss';
import InfoIcon from 'babel!svg-react!assets/icons/info-icon.svg?name=InfoIcon';

function SubMenu({ title, icon, extraHeader, children, onBack }) {
  return (
    <div className={ControlPanelStyles.submenu}>
      <div className={ControlPanelStyles.submenuHeader} >
        <InfoIcon onClick={onBack} />
        <h2 className={ControlPanelStyles.submenuTitle} >{title}</h2>
        {extraHeader}
        <div className={ControlPanelStyles.icon} >{icon}</div>
      </div>
      {children}
    </div>
  );
}

SubMenu.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.object,
  extraHeader: PropTypes.object,
  children: PropTypes.node.isRequired,
  onBack: PropTypes.func.isRequired
};

export default SubMenu;
