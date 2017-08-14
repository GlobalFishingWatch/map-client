import PropTypes from 'prop-types';
import React from 'react';
import SubmenuStyles from 'styles/components/submenu.scss';
import InfoIcon from '-!babel-loader!svg-react-loader!assets/icons/info-icon.svg?name=InfoIcon';

function SubMenu({ title, icon, extraHeader, children, onBack, footer }) {
  return (
    <div className={SubmenuStyles.submenu}>
      <div className={SubmenuStyles.main}>
        <div className={SubmenuStyles.header} >
          <InfoIcon onClick={onBack} />
          <h2 className={SubmenuStyles.title} >{title}</h2>
          {extraHeader}
          <div className={SubmenuStyles.icon} >{icon}</div>
        </div>
        <div className={SubmenuStyles.content} >
          {children}
        </div>
      </div>
      {footer && <div className={SubmenuStyles.footer} >
        {footer}
      </div>}
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
