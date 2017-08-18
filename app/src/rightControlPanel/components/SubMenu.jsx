import PropTypes from 'prop-types';
import React from 'react';
import SubmenuStyles from 'styles/components/submenu.scss';

function SubMenu({ title, icon, extraHeader, children, onBack, footer }) {
  return (
    <div className={SubmenuStyles.submenu}>
      <div className={SubmenuStyles.main}>
        <div className={SubmenuStyles.header} >
          <div className={SubmenuStyles.titleContainer} onClick={onBack}>
            <button><span className={SubmenuStyles.back} /></button>
            <h2 className={SubmenuStyles.title} >{title}</h2>
            {extraHeader}
          </div>
          <div className={SubmenuStyles.icon} >{icon}</div>
        </div>
        <div className={SubmenuStyles.content} >
          {children}
        </div>
        {footer && <div className={SubmenuStyles.footer} >
          {footer}
        </div>}
      </div>
    </div>
  );
}

SubMenu.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.object,
  extraHeader: PropTypes.node,
  footer: PropTypes.node,
  children: PropTypes.node.isRequired,
  onBack: PropTypes.func.isRequired
};

export default SubMenu;
