import React, { Component } from 'react';
import MapContainer from './Map';
import MapIFrame from '../components/MapIFrame';
import { login } from '../actions/user';

class AuthMap extends Component {
  componentWillMount() {
    const { store } = this.context;
    const state = store.getState();
    if (!state.user.token && this.props.location.query && this.props.location.query.redirect_login) {
      store.dispatch(login());
    }
  }

  render() {
    return (EMBED_MAP_URL) ? <MapIFrame /> : <MapContainer location={this.props.location} />;
  }
}

AuthMap.propTypes = {
  location: React.PropTypes.object
};

AuthMap.contextTypes = {
  store: React.PropTypes.object
};

export default AuthMap;
