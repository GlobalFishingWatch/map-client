import React, { Component } from 'react';

class MapIFrame extends Component {
  render() {
    return (
      <iframe
        style={{
          border: 0,
          width: '100%',
          height: '100%',
          display: 'block'
        }}
        src={EMBED_MAP_URL}
      />
    );
  }
}

MapIFrame.propTypes = {
  token: React.PropTypes.string,
  location: React.PropTypes.object
};

export default MapIFrame;
