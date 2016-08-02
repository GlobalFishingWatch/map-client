import React, { Component, Image } from 'react';
import { Link } from 'react-router';
import home from '../../../styles/components/c_menu.scss';
import logoimg from '../../../assets/logos/gfw_logo_hor_second.png';
import logoimg_second from '../../../assets/logos/gfw_logo_hor_white.png';
import menuicon from '../../../assets/icons/menu_icon.svg';


class Header extends Component {
  render() {

    let userLinks;
    if (this.props.loggedUser) {
      userLinks = (<li className={home.dropdown}>
        <Link to="#">{this.props.loggedUser.displayName}</Link>
        <ul className={home.dropdown_content}>
          <li><Link to="#">Profile</Link></li>
          <li><a href="javascript:;" onClick={this.props.logout.bind(this)}>Logout</a></li>
        </ul>
      </li>)
    } else {
      userLinks = <li><a href="javascript:;" onClick={this.props.login.bind(this)}>Login</a></li>
    }


    return <header className={home.c_header_menu} id={location.pathname === "/map" ? 'menu_transparent' : null}>
      <style
        dangerouslySetInnerHTML={{__html: "\n#menu_selected:after{\n\tcontent: \"\";\n\tdisplay:block;\n\theight: 4px;\n  border-radius: 100px;\n  background-color: #ffffff;\n\tmargin-top:1px;\n}\n"}} />
      <nav className={home.c_menu}>
        <img onClick={()=>this.props.setVisibleMenu(true)} className={home.icon_menu_mobile} src={menuicon}></img>
        <Link to="/">
          <img className={home.img_desktop} src={logoimg}></img>
          <img className={home.img_mobile} src={logoimg_second}></img>
        </Link>
        <span className={home.share_header}>Share</span>
        <ul>
          <li>
            <Link id={location.pathname === "/map" ? 'menu_selected' : null} to="/map">Map</Link>
          </li>
          <li className={home.dropdown}>
            <Link
              id={location.pathname === "/blog" || location.pathname === "/articles-publications" ? 'menu_selected' : null}
              to="#">News</Link>
            <ul className={home.dropdown_content}>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/articles-publications">Articles and Publications</Link></li>
            </ul>
          </li>
          <li className={home.dropdown}>
            <Link
              id={location.pathname === "/faq" || location.pathname === "/tutorials" || location.pathname === "/definitions" ? 'menu_selected' : null}
              to="#">How to</Link>
            <ul className={home.dropdown_content}>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/tutorials">Tutorials</Link></li>
              <li><Link to="/definitions">Definitions</Link></li>
            </ul>
          </li>
          <li className={home.dropdown}>
            <Link to="#"
                  id={location.pathname === "/the-project" || location.pathname === "/partners" || location.pathname === "/contact-us" ? 'menu_selected' : null}>About</Link>
            <ul className={home.dropdown_content}>
              <li><Link to="/the-project">The project</Link></li>
              <li><Link to="/partners">Partners</Link></li>
              <li><Link to="/contact-us">Contact us</Link></li>
            </ul>
          </li>
          {userLinks}
        </ul>
      </nav>
    </header>
  }
}

export default Header;
