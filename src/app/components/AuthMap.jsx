import PropTypes from 'prop-types'
import React, { Component } from 'react'
import MapDashboard from 'app/map/containers/MapDashboard'
import { getURLParameterByName } from 'app/utils/getURLParameterByName'
import Header from 'app/siteNav/containers/Header'
import ModalContainer from 'app/containers/ModalContainer'

class AuthMap extends Component {
  constructor(props) {
    super(props)

    const canRedirect = getURLParameterByName('redirect_login')
    this.state = {
      canRedirect,
    }

    if (!props.token && canRedirect) {
      props.login()
    }
  }

  render() {
    const canShareWorkspaces =
      !this.props.isEmbedded &&
      (this.props.userPermissions !== null &&
        this.props.userPermissions.indexOf('shareWorkspace') !== -1)

    return (
      <div className="fullHeightContainer">
        <Header canShareWorkspaces={canShareWorkspaces} />
        <ModalContainer canShareWorkspaces={canShareWorkspaces} />
        <MapDashboard />
      </div>
    )
  }
}

AuthMap.propTypes = {
  login: PropTypes.func,
  token: PropTypes.string,
  userPermissions: PropTypes.array,
  isEmbedded: PropTypes.bool,
}

export default AuthMap
