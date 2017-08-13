import PropTypes from 'prop-types';
import React, { Component } from 'react';
import MapContainer from 'containers/MapContainer';
import { getURLParameterByName, getURLPieceByName } from 'lib/getURLParameterByName';
import Header from 'siteNav/containers/Header';
import ModalContainer from 'containers/ModalContainer';

class AuthMap extends Component {

  constructor(props) {
    super(props);

    const canRedirect = getURLParameterByName('redirect_login');
    this.state = {
      canRedirect,
      workspaceId: getURLParameterByName('workspace') || getURLPieceByName('workspace'),
      isEmbedded: !!getURLParameterByName('embedded')
    };

    if (!props.token && canRedirect) {
      props.login();
    }
  }

  render() {
    const canShareWorkspaces = !this.state.isEmbedded &&
      (this.props.userPermissions !== null && this.props.userPermissions.indexOf('shareWorkspace') !== -1);

    return (
      <div className="fullHeightContainer" >
        <Header isEmbedded={this.state.isEmbedded} canShareWorkspaces={canShareWorkspaces} />
        <ModalContainer
          isEmbedded={this.state.isEmbedded}
        />
        <MapContainer workspaceId={this.state.workspaceId} isEmbedded={this.state.isEmbedded} />

      </div >);
  }
}

AuthMap.propTypes = {
  canRedirect: PropTypes.bool,
  login: PropTypes.func,
  token: PropTypes.string,
  userPermissions: PropTypes.array,
  workspaceId: PropTypes.string
};

export default AuthMap;
