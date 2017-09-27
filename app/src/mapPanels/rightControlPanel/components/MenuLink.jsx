import PropTypes from 'prop-types';
import React from 'react';
import MenuLinkStyles from 'styles/components/menu-link.scss';
import ControlPanelStyles from 'styles/components/control_panel.scss';
import classnames from 'classnames';

function MenuLink({ title, icon, badge, onClick }) {
  return (
    <div className={MenuLinkStyles.menuLink} onClick={onClick}>
      <div className={MenuLinkStyles.header} >
        <h2 className={MenuLinkStyles.title} >{title}</h2>
        <div className={classnames(MenuLinkStyles.iconContainer, { [MenuLinkStyles.hasBadge]: badge > 0 })} >
          {(badge > 0) && <div className={MenuLinkStyles.badge} >{badge}</div>}
          <div className={ControlPanelStyles.icon} >{icon}</div>
        </div>
      </div>
    </div>
  );
}

MenuLink.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  badge: PropTypes.number,
  onClick: PropTypes.func.isRequired
};

export default MenuLink;
