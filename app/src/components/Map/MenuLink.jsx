import PropTypes from 'prop-types';
import React from 'react';
import MenuLinkStyles from 'styles/components/menu-link.scss';
import ControlPanelStyles from 'styles/components/control_panel.scss';

function MenuLink({ title, icon, onClick }) {
  return (
    <div className={MenuLinkStyles.menuLink} onClick={onClick}>
      <div className={MenuLinkStyles.header} >
        <h2 className={MenuLinkStyles.title} >{title}</h2>
        <div className={ControlPanelStyles.icon} >{icon}</div>
      </div>
    </div>
  );
}

MenuLink.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};

export default MenuLink;
