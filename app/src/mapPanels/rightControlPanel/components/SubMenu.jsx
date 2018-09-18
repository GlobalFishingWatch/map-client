import PropTypes from 'prop-types';
import SubmenuStyles from 'styles/components/submenu.scss';
import Icon from 'src/components/Shared/Icon';
import React, { Component } from 'react';

class SubMenu extends Component {
  onCloseClick = () => {
    this.props.setSubmenu(null);
    if (typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  }

  render() {
    const { title, children, footer } = this.props;
    return (
      <div className={SubmenuStyles.submenu}>
        <div className={SubmenuStyles.main}>
          <div className={SubmenuStyles.header}>
            <div className={SubmenuStyles.titleContainer}>
              <h2 className={SubmenuStyles.title}>
                {title}
              </h2>
            </div>
            <div className={SubmenuStyles.icon} onClick={this.onCloseClick}>
              <Icon icon="close" activated />
            </div>
          </div>
          <div className={SubmenuStyles.content}>
            {children}
          </div>
          {footer && <div className={SubmenuStyles.footer}>
            {footer}
          </div>}
        </div>
      </div>
    );
  }
}

SubMenu.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.object,
  footer: PropTypes.node,
  setSubmenu: PropTypes.func,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func
};

export default SubMenu;
