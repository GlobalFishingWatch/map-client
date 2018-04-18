import React from 'react';
import { Popup } from 'react-map-gl';
import PropTypes from 'prop-types';

class PolygonLayerPopup extends React.Component {
  render() {
    const { popup } = this.props;
    return (<Popup
      latitude={popup.latitude}
      longitude={popup.longitude}
      closeButton={false}
      anchor="bottom"
      offsetTop={-40}
      tipSize={4}
    >
      <div>
        {popup.layerTitle}
        <div>
          {popup.fields.map(field => (
            <div key={field.title}>
              <b>{field.title}</b>
              <span>{field.content}</span>
            </div>
          ))}
        </div>
      </div>
    </Popup>);
  }
}

PolygonLayerPopup.propTypes = {
  popup: PropTypes.object
};

export default PolygonLayerPopup;
