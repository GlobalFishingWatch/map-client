import React, { Component } from 'react';
import menuMobile from '../../../styles/components/c_mobile_menu.scss';

class MenuMobile extends Component {
  render() {
    return (<div className={menuMobile.c_mobile_menu}>
      <ul>
        <li>Map</li>
        <li>News</li>
        <ul className={menuMobile.submenu_mobile}>
          <li>Newsletter</li>
          <li>Articles</li>
          <li>Blog</li>
          <li>Case Studies</li>
        </ul>
        <li>How to</li>
        <ul className={menuMobile.submenu_mobile}>
          <li>FAQ</li>
          <li>Tutorials</li>
          <li>Definitions</li>
          <li>About</li>
        </ul>
        <ul className={menuMobile.submenu_mobile}>
          <li>The Project</li>
          <li>Partners</li>
          <li>Contact Us</li>
        </ul>
      </ul>
      <span className={menuMobile.button_login}>LOG IN</span>
      <p className={menuMobile.forgot_text}>Forgot your password? Not a member</p>
    </div>);
  }
}

export default MenuMobile;
