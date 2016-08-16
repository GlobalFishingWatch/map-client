import React, { Component } from 'react';

class MapIFrame extends Component {

  componentWillMount() {
    if (!this.props.token && this.props.location.query && this.props.location.query.redirect_login) {
      this.props.login();
    }
  }

  render() {
    return (
      <iframe
        style={{ border: 0, width: '100%', height: '100%' }}
        src={EMBED_MAP_URL}
      />
    );
  }
}

MapIFrame.propTypes = {
  token: React.PropTypes.string,
  location: React.PropTypes.object,
  login: React.PropTypes.func
};

export default MapIFrame;
