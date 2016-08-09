import React, { Component } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import home from '../../../styles/components/c-menu.scss';
import logoimg from '../../../assets/logos/gfw_logo_hor_second.png';
import logoimgSecond from '../../../assets/logos/gfw_logo_hor_white.png';
import menuicon from '../../../assets/icons/menu_icon.svg';


class Header extends Component {

  constructor(props) {
    super(props);
    this.login = this.props.login.bind(this);
    this.logout = this.props.logout.bind(this);
  }

  render() {
    let userLinks;
    if (this.props.loggedUser) {
      userLinks = (
        <li className={home.dropdown}>
          <a>{this.props.loggedUser.displayName}</a>
          <ul className={home['dropdown-content']}>
            <li><a>Profile</a></li>
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
      <nav className={classNames({ [home['c-header']]: true, [home['-no-background']]: location.pathname === '/' })}>
        <img
          onClick={() => this.props.setVisibleMenu(true)}
          className={home['icon-menu-mobile']}
          src={menuicon}
          alt="Menu toggle icon"
        />
        <Link to="/">
          <img className={home['img-desktop']} src={logoimg} alt="Logo" />
          <img className={home['img-mobile']} src={logoimgSecond} alt="Logo" />
        </Link>
        <span className={home['share-header']}>Share</span>
        <ul className={home.menu}>
          <li>
            <Link className={location.pathname === '/map' ? home['-active'] : null} to="/map">Map</Link>
          </li>
          <li className={home.dropdown}>
            <a
              className={
                (location.pathname.startsWith('/blog') || location.pathname.startsWith('/articles-publications'))
                  ? home['-active'] : null
              }
            >
              News
            </a>
            <ul className={home['dropdown-content']}>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/articles-publications">Articles and Publications</Link></li>
            </ul>
          </li>
          <li className={home.dropdown}>
            <a
              className={
                (
                  location.pathname === '/faq'
                  || location.pathname === '/tutorials'
                  || location.pathname === '/definitions'
                ) ? home['-active'] : null
              }
            >
              How to
            </a>
            <ul className={home['dropdown-content']}>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/tutorials">Tutorials</Link></li>
              <li><Link to="/definitions">Definitions</Link></li>
            </ul>
          </li>
          <li className={home.dropdown}>
            <a
              className={(
                location.pathname === '/the-project'
                || location.pathname === '/partners'
                || location.pathname === '/contact-us'
              ) ? home['-active'] : null}
            >
              About
            </a>
            <ul className={home['dropdown-content']}>
              <li><Link to="/the-project">The project</Link></li>
              <li><Link to="/partners">Partners</Link></li>
              <li><Link to="/contact-us">Contact us</Link></li>
            </ul>
          </li>
          {userLinks}
        </ul>
      </nav>
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
