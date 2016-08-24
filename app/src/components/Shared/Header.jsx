import React, { Component } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import styles from '../../../styles/components/shared/c-header.scss';
import baseStyle from '../../../styles/_base.scss';
import logoimg from '../../../assets/logos/gfw_logo_hor_second.png';
import logoimgSecond from '../../../assets/logos/gfw_logo_hor_white.png';
import menuicon from '../../../assets/icons/menu_icon.svg';
import MenuMobile from './../../containers/MenuMobile';

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
      userLinks = (
        <li className={styles.dropdown}>
          <a>{this.props.loggedUser.displayName}</a>
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
        />
        <nav
          className={
            classNames({ [styles['c-header']]: true, [styles['-map']]: location.pathname === '/map' })
          }
        >
          <div
            className={
              classNames({ [baseStyle.wrap]: true, [baseStyle['-map']]: location.pathname === '/map' })
            }
          >
            <div className={styles['contain-nav']}>
              <div className={styles['logo-menu']}>
                <img
                  onClick={() => this.setState({ mobileMenuVisible: true })}
                  className={styles['icon-menu-mobile']}
                  src={menuicon}
                  alt="Menu toggle icon"
                />
                <Link to="/">
                  <img
                    className={location.pathname === '/' ? styles['img-home'] : styles['img-sub-page']}
                    src={location.pathname === '/' ? logoimg : logoimgSecond} alt="Logo"
                  />
                </Link>
              </div>
              <span className={styles['share-header']}>Share</span>
              <ul className={styles.menu}>
                <li>
                  <Link className={location.pathname === '/map' ? styles['-active'] : null} to="/map">Map</Link>
                </li>
                <li className={styles.dropdown}>
                  <a
                    className={
                      (location.pathname.startsWith('/blog') || location.pathname.startsWith('/articles-publications'))
                        ? styles['-active'] : null
                    }
                  >
                    News
                  </a>
                  <ul className={styles['dropdown-content']}>
                    <li><Link to="/blog">Blog</Link></li>
                    <li><Link to="/articles-publications">Articles and Publications</Link></li>
                  </ul>
                </li>
                <li className={styles.dropdown}>
                  <a
                    className={
                      (
                        location.pathname === '/faq'
                        || location.pathname === '/tutorials'
                        || location.pathname === '/definitions'
                      ) ? styles['-active'] : null
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
                      location.pathname === '/the-project'
                      || location.pathname === '/partners'
                      || location.pathname === '/contact-us'
                    ) ? styles['-active'] : null}
                  >
                    About
                  </a>
                  <ul className={styles['dropdown-content']}>
                    <li><Link to="/the-project">The project</Link></li>
                    <li><Link to="/partners">Partners</Link></li>
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
  setVisibleMenu: React.PropTypes.func
};

export default Header;
