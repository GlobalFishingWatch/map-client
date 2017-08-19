import PropTypes from 'prop-types';
import SubmenuStyles from 'styles/components/submenu.scss';
import React, { Component } from 'react';

class SubMenu extends Component {

  constructor() {
    super();
    this.onBackClick = this.onBackClick.bind(this);
  }

  onBackClick() {
    this.props.setSubmenu(null);
    if (typeof this.props.onBack === 'function') {
      this.props.onBack();
    }
  }

  render() {
    const { title, icon, extraHeader, children, footer } = this.props;
    return (
      <div className={SubmenuStyles.submenu} >
        <div className={SubmenuStyles.main} >
          <div className={SubmenuStyles.header} >
            <div className={SubmenuStyles.titleContainer} onClick={this.onBackClick} >
              <button ><span className={SubmenuStyles.back} /></button >
              <h2 className={SubmenuStyles.title} >{title}</h2 >
              {extraHeader}
            </div >
            <div className={SubmenuStyles.icon} >{icon}</div >
          </div >
          <div className={SubmenuStyles.content} >
            {children}
          </div >
          {footer && <div className={SubmenuStyles.footer} >
            {footer}
          </div >}
        </div >
      </div >
    );
  }
}

SubMenu.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.object,
  extraHeader: PropTypes.node,
  footer: PropTypes.node,
  setSubmenu: PropTypes.func,
  children: PropTypes.node.isRequired,
  onBack: PropTypes.func
};

export default SubMenu;
