import PropTypes from 'prop-types';
import React from 'react';
import SubmenuStyles from 'styles/components/submenu.scss';
import InfoIcon from '-!babel-loader!svg-react-loader!assets/icons/info-icon.svg?name=InfoIcon';

function SubMenu({ title, icon, extraHeader, children, onBack }) {
  return (
    <div className={SubmenuStyles.submenu}>
      <div className={SubmenuStyles.header} >
        <div className={SubmenuStyles.titleContainer} >
          <InfoIcon onClick={onBack} />
          <h2 className={SubmenuStyles.title} >{title}</h2>
          {extraHeader}
        </div>
        <div className={SubmenuStyles.icon} >{icon}</div>
      </div>
      <div className={SubmenuStyles.content} >
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
