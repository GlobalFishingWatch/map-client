import React, { Component } from 'react';
import menuMobile from '../../../styles/components/c-mobile-menu.scss';

class MenuMobile extends Component {

  render() {
    console.log(this);
    const cssClass = this.props.menuVisible ?
      `${menuMobile['c-mobile-menu']} ${menuMobile['-show']}` : `${menuMobile['c-mobile-menu']}`;

    const backClass = this.props.menuVisible ?
      `${menuMobile['menu-back']} ${menuMobile['-show']}` : `${menuMobile['menu-back']}`;

    return (<div>
      <div
        onClick={() => this.props.setVisibleMenu(false)}
        className={backClass}
      ></div>
      <div className={cssClass}>
        <ul>
          <li>Map</li>
          <li>News</li>
          <ul className={menuMobile['submenu-mobile']}>
            <li>Newsletter</li>
            <li>Articles</li>
            <li>Blog</li>
            <li>Case Studies</li>
          </ul>
          <li>How to</li>
          <ul className={menuMobile['submenu-mobile']}>
            <li>FAQ</li>
            <li>Tutorials</li>
            <li>Definitions</li>
            <li>About</li>
          </ul>
          <ul className={menuMobile['submenu-mobile']}>
            <li>The Project</li>
            <li>Partners</li>
            <li>Contact Us</li>
          </ul>
        </ul>
        <span className={menuMobile['button-login']}>LOG IN</span>
        <p className={menuMobile['forgot-text']}>Forgot your password? Not a member</p>
      </div>
    </div>);
  }
}

MenuMobile.propTypes = {
  menuVisible: React.PropTypes.bool,
  setVisibleMenu: React.PropTypes.func
};

export default MenuMobile;
