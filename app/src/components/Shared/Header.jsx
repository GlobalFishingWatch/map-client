import React, { Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

import betaLogo from 'assets/logos/gfw_logo_beta.svg';
import defaultLogo from 'assets/logos/gfw_logo_hor.svg';
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

  /**
   * Return whether the route starts with the passed string
   *
   * @param {String} route
   * @returns {Boolean}
   */
  doesPathStartsWith(route) {
    const regex = new RegExp(route.replace('/', '\\/'));
    return regex.test(location.pathname);
  }

  render() {
    let userLinks;
    if (this.props.loggedUser) {
      const name = this.props.loggedUser.displayName.split(' ');
      userLinks = (
        <li className={styles.dropdown}>
          <a className={styles['login-link']}>{name[0]}</a>
          <ul className={styles['dropdown-content']}>
            <li>
              <a onClick={this.logout}>
                Logout
              </a>
            </li>
          </ul>
        </li>
      );
    } else {
      userLinks = (
        <li>
          <a onClick={this.login}>Login</a>
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
            classnames({ [styles['c-header']]: true, [styles['-map']]: this.doesPathStartsWith('/map') })
          }
        >
          <div
            className={
              classnames({ [baseStyle.wrap]: true, [baseStyle['-map']]: this.doesPathStartsWith('/map') })
            }
          >
            <div className={styles['contain-nav']}>
              <img
                onClick={() => this.setState({ mobileMenuVisible: true })}
                className={styles['icon-menu-mobile']}
                src={menuicon}
                alt="Menu toggle icon"
              />
              <Link
                to="/"
                className={styles['app-logo']}
              >
                <img
                  src={this.doesPathStartsWith('/map') ? betaLogo : defaultLogo}
                  alt="Global Fishing Watch"
                />
              </Link>

              <ShareIcon
                className={classnames(iconStyles.icon, iconStyles['icon-share'], styles['icon-share'])}
                onClick={this.props.openShareModal}
              />
              {/* TEMPORARILY REMOVE SHARE BUTTON
              {this.doesPathStartsWith('/map') && <span className={styles['share-header']}>
                <img src={shareIcon} alt="share icon"></img></span>}
              */}
              <ul className={styles.menu}>
                <li>
                  <Link className={this.doesPathStartsWith('/map') && styles['-active']} to="/map">Map</Link>
                </li>
                <li className={styles.dropdown}>
                  <a
                    className={
                      /\/articles-publications/.test(location.pathname)
                        ? classnames(styles['-active'], styles['-no-cursor']) : styles['-no-cursor']
                    }
                  >
                    News
                  </a>
                  <ul className={styles['dropdown-content']}>
                    <li>
                      <a
                        href={BLOG_URL}
                        rel="noopener noreferrer"
                        target="_blank"
                      >Blog</a>
                    </li>
                    <li><Link to="/articles-publications">Articles and Publications</Link></li>
                  </ul>
                </li>
                <li className={styles.dropdown}>
                  <a
                    className={
                      (
                        this.doesPathStartsWith('/faq')
                        || this.doesPathStartsWith('/tutorials')
                        || this.doesPathStartsWith('/definitions')
                      ) ? classnames(styles['-active'], styles['-no-cursor']) : styles['-no-cursor']
                    }
                  >
                    How to
                  </a>
                  <ul className={styles['dropdown-content']}>
                    <li><Link to="/faq">FAQ</Link></li>
                    <li><Link to="/tutorials">Tutorials</Link></li>
                    <li><Link to="/definitions">Definitions</Link></li>
                  </ul>
                </li>
                <li className={styles.dropdown}>
                  <a
                    className={(
                      this.doesPathStartsWith('/the-project')
                      || this.doesPathStartsWith('/partners')
                      || this.doesPathStartsWith('/research-program')
                      || this.doesPathStartsWith('/contact-us')
                    ) ? classnames(styles['-active'], styles['-no-cursor']) : styles['-no-cursor']}
                  >
                    About
                  </a>
                  <ul className={styles['dropdown-content']}>
                    <li><Link to="/the-project">The project</Link></li>
                    <li><Link to="/partners">Partners</Link></li>
                    <li><Link to="/research-program">Research program</Link></li>
                    <li><Link to="/contact-us">Contact us</Link></li>
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
