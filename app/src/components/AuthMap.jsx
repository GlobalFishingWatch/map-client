import React, { Component } from 'react';
import MapContainer from 'containers/Map';
import { getURLParameterByName, getURLPieceByName } from 'lib/getURLParameterByName';

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
    return <MapContainer workspaceId={this.state.workspaceId} isEmbedded={this.state.isEmbedded} />;
  }
}

AuthMap.propTypes = {
  /**
   * User token for the map
   */
  token: React.PropTypes.string,
  /**
   * Whether the user can be redirected to SalesForce to get the token
   */
  canRedirect: React.PropTypes.bool,
  /**
   * Method to redirect the user to SalesForce to login and get the token
   */
  login: React.PropTypes.func,
  /**
   * Workspace ID retrieved from the URL
   */
  workspaceId: React.PropTypes.string
};

export default AuthMap;
