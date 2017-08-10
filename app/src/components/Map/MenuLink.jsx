import PropTypes from 'prop-types';
import React from 'preact';
import ControlPanelStyles from 'styles/components/control_panel.scss';

function MenuLink({ title, icon, onClick }) {
  return (
    <div className={ControlPanelStyles.accordionItem} onClick={onClick}>
      <div className={ControlPanelStyles.accordionHeader} >
        <h2 className={ControlPanelStyles.accordionTitle} >{title}</h2>
        {icon}
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
