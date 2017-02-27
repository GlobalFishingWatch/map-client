import React, { Component } from 'react';
import menuMobile from 'styles/components/c-mobile-menu.scss';

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
          <p className={menuMobile['forgot-text']} >
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
      <div className={cssClass} >
        <ul>
          <li><a href="#" >Map</a></li>
          <li>News</li>
          <ul className={menuMobile['submenu-mobile']} >
            <li><a href={BLOG_URL} target="_blank" rel="noopener noreferrer" >Blog</a></li>
            <li><a href={`${SITE_URL}/articles-publications`} >Articles and Publications</a></li>
          </ul>
          <li>How to</li>
          <ul className={menuMobile['submenu-mobile']} >
            <li><a href={`${SITE_URL}/faq`} >FAQ</a></li>
            <li><a href={`${SITE_URL}/tutorials`} >Tutorials</a></li>
            <li><a href={`${SITE_URL}/definitions`} >Definitions</a></li>
          </ul>
          <li>About</li>
          <ul className={menuMobile['submenu-mobile']} >
            <li><a href={`${SITE_URL}/the-project`} >The Project</a></li>
            <li><a href={`${SITE_URL}/partners`} >Partners</a></li>
            <li><a href={`${SITE_URL}/research-program`} >Research Program</a></li>
            <li><a href={`${SITE_URL}/contact-us`} >Contact Us</a></li>
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
