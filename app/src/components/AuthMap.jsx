import React, { Component } from 'react';
import MapContainer from 'containers/Map';
import MapIFrameContainer from 'containers/MapIFrame';

class AuthMap extends Component {

  componentWillMount() {
    if (!this.props.token && this.props.canRedirect) {
      this.props.login();
    }
  }

  render() {
    return (EMBED_MAP_URL) ? <MapIFrameContainer workspaceId={this.props.workspaceId} /> :
      <MapContainer workspaceId={this.props.workspaceId} />;
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
