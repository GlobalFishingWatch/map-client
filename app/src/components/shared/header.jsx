import React, {Component, Image} from "react";
import {Link} from "react-router";
import home from "../../../styles/components/c_menu.scss";
import logoimg from "../../../assets/logos/gfw_logo_hor_second.png";


class Header extends Component {
  login() {
    let url = "https://skytruth-pleuston.appspot.com/v1/authorize?response_type=token&client_id=asddafd&redirect_uri=" + window.location;
    window.location = url;
  }

  render() {
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
        <li>
          {this.props.loggedUser && <Link to="#">{this.props.loggedUser.displayName}</Link>}
          {!this.props.loggedUser && <Link to="#" onClick={this.login.bind(this)}>Login</Link>}
        </li>
      </ul>
    </nav>
  }
}

export default Header;
