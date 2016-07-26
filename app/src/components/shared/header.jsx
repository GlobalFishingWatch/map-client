import React, {Component, Image} from "react";
import {Link} from "react-router";
import home from "../../../styles/components/c_menu.scss";
import logoimg from "../../../assets/logos/gfw_logo_hor_second.png";


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

    return <nav className={home.c_menu}>
      <Link to="/">
        <img src={logoimg}></img>
      </Link>
      <ul>
        <li>
          <Link to="/map">Map</Link>
        </li>
        <li className={home.dropdown}>
          <Link to="#">News</Link>
          <ul className={home.dropdown_content}>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/articles-publications">Articles and Publications</Link></li>
          </ul>
        </li>
        <li className={home.dropdown}>
          <Link to="#">How to</Link>
          <ul className={home.dropdown_content}>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/tutorials">Tutorials</Link></li>
            <li><Link to="/definitions">Definitions</Link></li>
          </ul>
        </li>
        <li className={home.dropdown}>
          <Link to="#">About</Link>
          <ul className={home.dropdown_content}>
            <li><Link to="/the-project">The project</Link></li>
            <li><Link to="/partners">Partners</Link></li>
            <li><Link to="/contact-us">Contact us</Link></li>
          </ul>
        </li>
        {userLinks}
      </ul>
    </nav>
  }
}

export default Header;
