import React, { Component } from 'preact';
import PropTypes from 'prop-types';
import { DrawingManager } from 'react-google-maps';

class DrawArea extends Component {
  constructor(props) {
    super(props);
    this.defaults = {
      area: null
    };
  }

  render() {
    return (
      <DrawingManager
        defaultDrawingMode={this.props.polygonType}
        defaultOptions={{
          drawingControl: false,
          polygonOptions: {
            fillColor: '#174084',
            strokeColor: '#174084',
            fillOpacity: 0.5,
            strokeWeight: 3,
            clickable: false,
            editable: false,
            zIndex: 1
          }
        }}
      />
    );
  }
}

DrawArea.propTypes = {
  polygonType: PropTypes.object
};

export default DrawArea;
