import React, {Component, Image} from "react";
import {Link} from "react-router";
import home from "../../styles/components/c_menu.scss";
import logoimg from "../../assets/logos/gfw_logo_hor_second.png";


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
        <li>
          <Link to="#">News</Link>
          <ul>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/">Articles and Publications</Link></li>
          </ul>
        </li>
        <li>
          <Link to="#">How to</Link>
          <ul>
            <li><Link to="/">FAQ</Link></li>
            <li><Link to="/">Tutorials</Link></li>
            <li><Link to="/">Definitions</Link></li>
          </ul>
        </li>
        <li>
          <Link to="#">About</Link>
          <ul>
            <li><Link to="/">The project</Link></li>
            <li><Link to="/">Partners</Link></li>
            <li><Link to="/">Contact us</Link></li>
          </ul>
        </li>
        <li>
          {this.props.loggedUser && <Link to="#" >{this.props.loggedUser.displayName}</Link>}
          {!this.props.loggedUser && <Link to="#" onClick={this.login.bind(this)}>Login</Link>}
        </li>
      </ul>
    </nav>
  }
}

export default Header;
