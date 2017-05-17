import React, { Component } from 'react';
import classnames from 'classnames';
import betaLogo from 'assets/logos/gfw_logo_beta.svg';
import menuicon from 'assets/icons/menu_icon.svg';
import MenuMobile from 'containers/MenuMobile';
import baseStyle from 'styles/_base.scss';
import styles from 'styles/components/shared/c-header.scss';
import iconStyles from 'styles/icons.scss';
import ShareIcon from 'babel!svg-react!assets/icons/share-icon.svg?name=ShareIcon';

class Header extends Component {

  constructor(props) {
    super(props);
    this.login = this.props.login.bind(this);
    this.logout = this.props.logout.bind(this);
    this.state = {
      mobileMenuVisible: false
    };
    this.closeMobileMenu = this.closeMobileMenu.bind(this);
  }

  closeMobileMenu() {
    this.setState({ mobileMenuVisible: false });
  }

  render() {
    const logoUrl = this.props.isEmbedded ? `${MAP_URL}?workspace=${this.props.urlWorkspaceId}` : SITE_URL;

    const target = this.props.isEmbedded ? '_blank' : '';

    return (
      <div>
        {(!this.props.isEmbedded && COMPLETE_MAP_RENDER) &&
        <MenuMobile
          visible={this.state.mobileMenuVisible}
          onClose={this.closeMobileMenu}
          onOpenSupportModal={this.props.setSupportModalVisibility}
        />
        }
        <nav
          className={
            classnames('c-header', { [styles['c-header']]: true, [styles['-map']]: true })
          }
        >
          <div
            className={
              classnames({ [baseStyle.wrap]: true, [baseStyle['-map']]: true })
            }
          >
            <div className={styles['contain-nav']} >
              {(!this.props.isEmbedded && COMPLETE_MAP_RENDER) &&
              <img
                onClick={() => this.setState({ mobileMenuVisible: true })}
                className={styles['icon-menu-mobile']}
                src={menuicon}
                alt="Menu toggle icon"
              />
              }
              {COMPLETE_MAP_RENDER &&
              <a
                target={target}
                href={logoUrl}
                className={styles['app-logo']}
              >
                <img
                  src={betaLogo}
                  alt="Global Fishing Watch"
                />
              </a>
              }
              {this.props.canShareWorkspaces &&
                <ShareIcon
                  className={classnames(iconStyles.icon, iconStyles['icon-share'], styles['icon-share'])}
                  onClick={this.props.openShareModal}
                />
              }
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

Header.propTypes = {
  logout: React.PropTypes.func,
  login: React.PropTypes.func,
  loggedUser: React.PropTypes.object,
  openShareModal: React.PropTypes.func,
  setSupportModalVisibility: React.PropTypes.func,
  setVisibleMenu: React.PropTypes.func,
  isEmbedded: React.PropTypes.bool,
  urlWorkspaceId: React.PropTypes.string,
  canShareWorkspaces: React.PropTypes.bool
};

export default Header;
