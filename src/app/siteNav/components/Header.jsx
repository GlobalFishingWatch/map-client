import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classnames from 'classnames'
import logo from 'assets/logos/gfw_logo.svg'
import menuicon from 'assets/icons/menu.svg'
import MenuMobile from 'app/siteNav/containers/MenuMobile'
import WrapStyles from 'styles/wrap.module.scss'
import HeaderStyles from 'styles/components/shared/header.module.scss'
import iconStyles from 'styles/icons.module.scss'
import { ReactComponent as ShareIcon } from 'assets/icons/share.svg'

const COMPLETE_MAP_RENDER = process.env.REACT_APP_COMPLETE_MAP_RENDER === true

class Header extends Component {
  constructor(props) {
    super(props)
    this.login = this.props.login.bind(this)
    this.logout = this.props.logout.bind(this)
    this.state = {
      mobileMenuVisible: false,
    }
    this.closeMobileMenu = this.closeMobileMenu.bind(this)
  }

  closeMobileMenu() {
    this.setState({ mobileMenuVisible: false })
  }

  render() {
    const isEmbedded = this.props.isEmbedded
    const logoUrl = isEmbedded
      ? `${process.env.REACT_APP_MAP_URL}?workspace=${this.props.urlWorkspaceId}`
      : process.env.SITE_URL

    const target = isEmbedded ? '_blank' : ''

    return (
      <div>
        <div className={HeaderStyles.preview} />
        {/* <button onClick={this.props.logout}>LOGOUT</button> */}
        {!this.props.isEmbedded && !COMPLETE_MAP_RENDER && (
          <MenuMobile
            visible={this.state.mobileMenuVisible}
            onClose={this.closeMobileMenu}
            onOpenSupportModal={this.props.setSupportModalVisibility}
          />
        )}
        <nav className={classnames('c-header', HeaderStyles.header, HeaderStyles._map)}>
          <div className={classnames(WrapStyles.wrap, WrapStyles._map)}>
            <div className={HeaderStyles.containNav}>
              {!isEmbedded && !COMPLETE_MAP_RENDER && (
                <img
                  onClick={() => this.setState({ mobileMenuVisible: true })}
                  className={HeaderStyles.iconMenuMobile}
                  src={menuicon}
                  alt="Menu toggle icon"
                />
              )}
              {!COMPLETE_MAP_RENDER && (
                <a
                  target={target}
                  href={logoUrl}
                  className={classnames(HeaderStyles.appLogo, {
                    [HeaderStyles._isEmbedded]: isEmbedded,
                  })}
                >
                  <img src={logo} alt="Global Fishing Watch" />
                </a>
              )}
              {this.props.canShareWorkspaces && (
                <ShareIcon
                  className={classnames(
                    iconStyles.icon,
                    iconStyles.iconShare,
                    HeaderStyles.iconShare
                  )}
                  onClick={this.props.openShareModal}
                />
              )}
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  openShareModal: PropTypes.func.isRequired,
  setSupportModalVisibility: PropTypes.func.isRequired,
  isEmbedded: PropTypes.bool.isRequired,
  urlWorkspaceId: PropTypes.string,
  canShareWorkspaces: PropTypes.bool.isRequired,
}

Header.defaultProps = {
  urlWorkspaceId: '',
}

export default Header
