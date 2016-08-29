import React, { Component } from 'react';

class CoverPagePreloader extends Component {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const images = this.props.images.map(image => `url(${image}) no-repeat -9999px -9999px`);
    const css = images.join(',');

    return (
      <div style={{ background: css }}></div>
    );
  }
}

CoverPagePreloader.propTypes = {
  images: React.PropTypes.array
};

export default CoverPagePreloader;
