import PropTypes from 'prop-types'
import React, { Component } from 'react'
import MenuMobileStyles from 'styles/components/mobile-menu.module.scss'

const SITE_URL = process.env.REACT_APP_SITE_URL

class MenuMobile extends Component {
  render() {
    const { isUserLogged, login, logout, visible } = this.props
    const cssClass = visible
      ? `${MenuMobileStyles.mobileMenu} ${MenuMobileStyles._show}`
      : `${MenuMobileStyles.mobileMenu}`

    const backClass = visible
      ? `${MenuMobileStyles.menuBack} ${MenuMobileStyles._show}`
      : `${MenuMobileStyles.menuBack}`

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
          <div>
            <button
              className={MenuMobileStyles.buttonLogin}
              onClick={isUserLogged ? logout : login}
            >
              {isUserLogged ? 'log out' : 'log in'}
            </button>
          </div>
        </div>
      </div>
    )
  }
}

MenuMobile.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  isUserLogged: PropTypes.bool.isRequired,
}

export default MenuMobile
