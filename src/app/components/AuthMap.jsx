import PropTypes from 'prop-types'
import React, { Component } from 'react'
import MapDashboard from 'app/map/containers/MapDashboard'
import Header from 'app/siteNav/containers/Header'
import ModalContainer from 'app/containers/ModalContainer'

class AuthMap extends Component {
  render() {
    return (
      <div className="fullHeightContainer">
        <Header canShareWorkspaces={this.props.canShareWorkspaces} />
        <ModalContainer canShareWorkspaces={this.props.canShareWorkspaces} />
        <MapDashboard />
      </div>
    )
  }
}

AuthMap.propTypes = {
  login: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  canShareWorkspaces: PropTypes.bool.isRequired,
}

export default AuthMap
