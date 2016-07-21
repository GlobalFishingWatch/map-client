import React, {Component, Image} from "react";
import {Link} from "react-router";
import home from "../../styles/components/c_menu.scss";
import logoimg from "../../assets/logos/gfw_logo_hor.png";


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
          <Link to="/news">News</Link>
        </li>
        <li>
          <Link to="/">How to</Link>
        </li>
        <li>
          <Link to="/">About</Link>
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
