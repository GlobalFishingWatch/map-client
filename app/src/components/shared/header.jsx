import React, { Component } from 'react';
import { Link } from 'react-router';
import home from '../../../styles/components/c_menu.scss';
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
      userLinks = (<li className={home.dropdown}>
        <Link to="#">{this.props.loggedUser.displayName}</Link>
        <ul className={home.dropdown_content}>
          <li><Link to="#">Profile</Link></li>
          <li>
            <a
              href="javascript:;"
              onClick={this.logout}
            >Logout</a></li>
        </ul>
      </li>);
    } else {
      userLinks = (<li><a
        href="javascript:;"
        onClick={this.login}
      >Login</a></li>);
    }


    return (<header className={home.c_header_menu} id={location.pathname === '/map' ? 'menu_transparent' : null}>
      <style
        dangerouslySetInnerHTML={{
          __html: `#menu_selected:after{
        content: "";
        display:block;
        height: 4px;
        border-radius: 100px;
        background-color: #ffffff;
        margin-top:1px;
        }`
        }}
      />
      <nav className={home.c_menu}>
        <img
          onClick={() => this.props.setVisibleMenu(true)}
          className={home.icon_menu_mobile}
          src={menuicon}
          alt="Logo"
        />
        <Link to="/">
          <img className={home.img_desktop} src={logoimg} alt="Logo" />
          <img className={home.img_mobile} src={logoimgSecond} alt="Logo" />
        </Link>
        <span className={home.share_header}>Share</span>
        <ul>
          <li>
            <Link id={location.pathname === '/map' ? 'menu_selected' : null} to="/map">Map</Link>
          </li>
          <li className={home.dropdown}>
            <Link
              id={
                (location.pathname === '/blog' || location.pathname === '/articles-publications')
                  ? 'menu_selected' : null
              }
              to="#"
            >News</Link>
            <ul className={home.dropdown_content}>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/articles-publications">Articles and Publications</Link></li>
            </ul>
          </li>
          <li className={home.dropdown}>
            <Link
              id={
                (
                  location.pathname === '/faq'
                  || location.pathname === '/tutorials'
                  || location.pathname === '/definitions'
                ) ? 'menu_selected' : null
              }
              to="#"
            >How to</Link>
            <ul className={home.dropdown_content}>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/tutorials">Tutorials</Link></li>
              <li><Link to="/definitions">Definitions</Link></li>
            </ul>
          </li>
          <li className={home.dropdown}>
            <Link
              to="#"
              id={(
                location.pathname === '/the-project'
                || location.pathname === '/partners'
                || location.pathname === '/contact-us'
              ) ? 'menu_selected' : null}
            >About</Link>
            <ul className={home.dropdown_content}>
              <li><Link to="/the-project">The project</Link></li>
              <li><Link to="/partners">Partners</Link></li>
              <li><Link to="/contact-us">Contact us</Link></li>
            </ul>
          </li>
          {userLinks}
        </ul>
      </nav>
    </header>);
  }
}

Header.propTypes = {
  logout: React.PropTypes.func,
  login: React.PropTypes.func,
  loggedUser: React.PropTypes.object,
  setVisibleMenu: React.PropTypes.func
};

export default Header;
