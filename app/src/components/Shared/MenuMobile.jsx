import React, { Component } from 'react';
import menuMobile from 'styles/components/c-mobile-menu.scss';
import { Link } from 'react-router';

class MenuMobile extends Component {

  onClickSupoport(e) {
    e.preventDefault();

    this.props.onClose();
    this.props.setSupportModalVisibility(true);
  }

  render() {
    const cssClass = this.props.visible ?
      `${menuMobile['c-mobile-menu']} ${menuMobile['-show']}` : `${menuMobile['c-mobile-menu']}`;

    const backClass = this.props.visible ?
      `${menuMobile['menu-back']} ${menuMobile['-show']}` : `${menuMobile['menu-back']}`;

    let userLinks;
    if (this.props.loggedUser) {
      userLinks = (
        <div>
          <button
            className={menuMobile['button-login']}
            onClick={this.props.logout}
          >
            log out
          </button>
        </div>
      );
    } else {
      userLinks = (
        <div>
          <button
            className={menuMobile['button-login']}
            onClick={this.props.login}
          >
            log in
          </button>
          <p className={menuMobile['forgot-text']}>
            <a
              href="https://trial-globalfishingwatch.cs43.force.com/gfw/GFWResetPassword"
              className={menuMobile['forgot-password']}
            >
              Reset password
            </a>
          </p>
        </div>
      );
    }

    return (<div>
      <div
        onClick={this.props.onClose}
        className={backClass}
      />
      <div className={cssClass}>
        <ul>
          <li><Link to="/map">Map</Link></li>
          <li>News</li>
          <ul className={menuMobile['submenu-mobile']}>
            <li><a href={BLOG_URL} target="_blank" rel="noopener noreferrer">Blog</a></li>
            <li><Link to="/articles-publications">Articles and Publications</Link></li>
          </ul>
          <li>How to</li>
          <ul className={menuMobile['submenu-mobile']}>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/tutorials">Tutorials</Link></li>
            <li><Link to="/definitions">Definitions</Link></li>
          </ul>
          <li>About</li>
          <ul className={menuMobile['submenu-mobile']}>
            <li><Link to="/the-project">The Project</Link></li>
            <li><Link to="/partners">Partners</Link></li>
            <li><Link to="/research-program">Research Program</Link></li>
            <li><Link to="/contact-us">Contact Us</Link></li>
          </ul>
        </ul>
        {userLinks}
      </div>
    </div>);
  }
}

MenuMobile.propTypes = {
  visible: React.PropTypes.bool,
  onClose: React.PropTypes.func,
  logout: React.PropTypes.func,
  login: React.PropTypes.func,
  loggedUser: React.PropTypes.object,
  setSupportModalVisibility: React.PropTypes.func
};

export default MenuMobile;
