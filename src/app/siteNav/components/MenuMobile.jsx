import PropTypes from 'prop-types'
import React, { Component } from 'react'
import MenuMobileStyles from 'styles/components/mobile-menu.module.scss'

const SITE_URL = process.env.REACT_APP_SITE_URL

class MenuMobile extends Component {
  render() {
    const cssClass = this.props.visible
      ? `${MenuMobileStyles.mobileMenu} ${MenuMobileStyles._show}`
      : `${MenuMobileStyles.mobileMenu}`

    const backClass = this.props.visible
      ? `${MenuMobileStyles.menuBack} ${MenuMobileStyles._show}`
      : `${MenuMobileStyles.menuBack}`

    let userLinks
    if (this.props.loggedUser) {
      userLinks = (
        <div>
          <button className={MenuMobileStyles.buttonLogin} onClick={this.props.logout}>
            log out
          </button>
        </div>
      )
    } else {
      userLinks = (
        <div>
          <button className={MenuMobileStyles.buttonLogin} onClick={this.props.login}>
            log in
          </button>
        </div>
      )
    }

    return (
      <div>
        <div onClick={this.props.onClose} className={backClass} />
        <div className={cssClass}>
          <ul>
            <li>
              <a href={SITE_URL}>Home</a>
            </li>
            <li>
              <a href={`${SITE_URL}/about-us/`}>About Us</a>
            </li>
            <li>
              <a href={`${SITE_URL}/transparency-platform/`}>Our Platform</a>
            </li>
            <li>
              <a href={`${SITE_URL}/initiatives/`}>Our Initiatives</a>
            </li>
            <li>
              <a href={`${SITE_URL}/research/`}>Research</a>
            </li>
            <li>Get Help</li>
            <ul className={MenuMobileStyles.submenuMobile}>
              <li>
                <a href={`${SITE_URL}/tutorials/`}>Tutorials</a>
              </li>
              <li>
                <a href={`${SITE_URL}/map-use/`}>Map Help</a>
              </li>
              <li>
                <a href={`${SITE_URL}/data-help/`}>Data Help</a>
              </li>
              <li>
                <a href={`${SITE_URL}/definitions/`}>Definitions</a>
              </li>
            </ul>
            <li>
              <a href={`${SITE_URL}/sitemap/`}>Site Map</a>
            </li>
          </ul>
          {userLinks}
        </div>
      </div>
    )
  }
}

MenuMobile.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  logout: PropTypes.func,
  login: PropTypes.func,
  loggedUser: PropTypes.object,
  setSupportModalVisibility: PropTypes.func,
  beforeLeave: PropTypes.func,
}

export default MenuMobile
