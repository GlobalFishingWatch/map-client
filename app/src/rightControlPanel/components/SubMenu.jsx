import PropTypes from 'prop-types';
import React from 'react';
import ControlPanelStyles from 'styles/components/control_panel.scss';
import InfoIcon from '-!babel-loader!svg-react-loader!assets/icons/info-icon.svg?name=InfoIcon';

function SubMenu({ title, icon, extraHeader, children, onBack }) {
  return (
    <div className={ControlPanelStyles.submenu}>
      <div className={ControlPanelStyles.submenuHeader} >
        <InfoIcon onClick={onBack} />
        <h2 className={ControlPanelStyles.submenuTitle} >{title}</h2>
        {extraHeader}
        <div className={ControlPanelStyles.icon} >{icon}</div>
      </div>
      <div className={ControlPanelStyles.submenuContent} >
        {children}
      </div>
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
