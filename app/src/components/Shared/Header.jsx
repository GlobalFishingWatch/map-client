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
    let userLinks;
    if (this.props.loggedUser) {
      const name = this.props.loggedUser.displayName.split(' ');
      userLinks = (
        <li className={styles.dropdown} >
          <a className={styles['login-a']} >{name[0]}</a>
          <ul className={styles['dropdown-content']} >
            <li>
              <a onClick={this.logout} >
                Logout
              </a>
            </li>
          </ul>
        </li>
      );
    } else {
      userLinks = (
        <li>
          <a onClick={this.login} >Login</a>
        </li>
      );
    }

    return (
      <div>
        <MenuMobile
          visible={this.state.mobileMenuVisible}
          onClose={this.closeMobileMenu}
          onOpenSupportModal={this.props.setSupportModalVisibility}
        />
        <nav
          className={
            classnames({ [styles['c-header']]: true, [styles['-map']]: true })
          }
        >
          <div
            className={
              classnames({ [baseStyle.wrap]: true, [baseStyle['-map']]: true })
            }
          >
            <div className={styles['contain-nav']} >
              <img
                onClick={() => this.setState({ mobileMenuVisible: true })}
                className={styles['icon-menu-mobile']}
                src={menuicon}
                alt="Menu toggle icon"
              />
              <a
                href={`${SITE_URL}/`}
                className={styles['app-logo']}
              >
                <img
                  src={betaLogo}
                  alt="Global Fishing Watch"
                />
              </a>

              <ShareIcon
                className={classnames(iconStyles.icon, iconStyles['icon-share'], styles['icon-share'])}
                onClick={this.props.openShareModal}
              />
              <ul className={styles.menu} >
                <li>
                  <a className={styles['-active']} href="#" >Map</a>
                </li>
                <li className={styles.dropdown} >
                  <a
                    className={
                      /\/articles-publications/.test(location.pathname)
                        ? classnames(styles['-active'], styles['-no-cursor']) : styles['-no-cursor']
                    }
                  >
                    News
                  </a>
                  <ul className={styles['dropdown-content']} >
                    <li>
                      <a
                        href={BLOG_URL}
                        rel="noopener noreferrer"
                        target="_blank"
                      >Blog</a>
                    </li>
                    <li><a href={`${SITE_URL}/articles-publications`} >Articles and Publications</a></li>
                  </ul>
                </li>
                <li className={styles.dropdown} >
                  <a
                    className={styles['-no-cursor']}
                  >
                    How to
                  </a>
                  <ul className={styles['dropdown-content']} >
                    <li><a href={`${SITE_URL}/faq`} >FAQ</a></li>
                    <li><a href={`${SITE_URL}/tutorials`} >Tutorials</a></li>
                    <li><a href={`${SITE_URL}/definitions`} >Definitions</a></li>
                  </ul>
                </li>
                <li className={styles.dropdown} >
                  <a
                    className={styles['-no-cursor']}
                  >
                    About
                  </a>
                  <ul className={styles['dropdown-content']} >
                    <li><a href={`${SITE_URL}/the-project`} >The project</a></li>
                    <li><a href={`${SITE_URL}/partners`} >Partners</a></li>
                    <li><a href={`${SITE_URL}/research-program`} >Research program</a></li>
                    <li><a href={`${SITE_URL}/contact-us`} >Contact us</a></li>
                  </ul>
                </li>
                {userLinks}
              </ul>
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
  setVisibleMenu: React.PropTypes.func
};

export default Header;
