import PropTypes from 'prop-types';
import React, { Component } from 'preact';
import MenuMobileStyles from 'styles/components/mobile-menu.scss';

class MenuMobile extends Component {

  render() {
    const cssClass = this.props.visible ?
      `${MenuMobileStyles.mobileMenu} ${MenuMobileStyles._show}` : `${MenuMobileStyles.mobileMenu}`;

    const backClass = this.props.visible ?
      `${MenuMobileStyles.menuBack} ${MenuMobileStyles._show}` : `${MenuMobileStyles.menuBack}`;

    let userLinks;
    if (this.props.loggedUser) {
      userLinks = (
        <div>
          <button
            className={MenuMobileStyles.buttonLogin}
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
            className={MenuMobileStyles.buttonLogin}
            onClick={this.props.login}
          >
            log in
          </button>
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
          <li><a href={SITE_URL} >Home</a></li>
          <li>News</li>
          <ul className={MenuMobileStyles.submenuMobile} >
            <li><a href={BLOG_URL} target="_blank" rel="noopener noreferrer" >Blog</a></li>
            <li><a href={`${SITE_URL}/articles-publications`} >Articles and Publications</a></li>
          </ul>
          <li>How to</li>
          <ul className={MenuMobileStyles.submenuMobile} >
            <li><a href={`${SITE_URL}/faq`} >FAQ</a></li>
            <li><a href={`${SITE_URL}/tutorials`} >Tutorials</a></li>
            <li><a href={`${SITE_URL}/definitions`} >Definitions</a></li>
          </ul>
          <li>About</li>
          <ul className={MenuMobileStyles.submenuMobile} >
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
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  logout: PropTypes.func,
  login: PropTypes.func,
  loggedUser: PropTypes.object,
  setSupportModalVisibility: PropTypes.func,
  beforeLeave: PropTypes.func
};

export default MenuMobile;
