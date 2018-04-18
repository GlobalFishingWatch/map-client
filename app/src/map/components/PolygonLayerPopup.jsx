import React from 'react';
import { Popup } from 'react-map-gl';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CustomInfoWindowStyles from 'styles/components/map/custom-infowindow.scss';
import buttonCloseStyles from 'styles/components/button-close.scss';
import CloseIcon from '-!babel-loader!svg-react-loader!assets/icons/close.svg?name=Icon';

class PolygonLayerPopup extends React.Component {
  render() {
    const { popup, toggleCurrentReportPolygon } = this.props;
    const toggleButtonText = (popup.isInReport === true) ? 'remove from report' : 'add to report';
    let toggleButtonClassName = classnames(CustomInfoWindowStyles.toggle);
    if (popup.isInReport === true) {
      toggleButtonClassName += ` ${CustomInfoWindowStyles._remove}`;
    }
    return (<Popup
      latitude={popup.latitude}
      longitude={popup.longitude}
      closeButton={false}
      anchor="bottom"
      offsetTop={-40}
      tipSize={4}
    >
      <div className={CustomInfoWindowStyles.customInfowindow}>
        <div className={CustomInfoWindowStyles.title} >
          {popup.layerTitle}
        </div >
        <div className={CustomInfoWindowStyles.description} >
          {popup.fields.map(field => (
            <div key={field.title}>
              <b>{field.title}</b>
              <span>{field.value}</span>
            </div>
          ))}
        </div >
        <button
          onClick={() => toggleCurrentReportPolygon()}
          className={classnames(CustomInfoWindowStyles.close, buttonCloseStyles.buttonClose)}
        >
          <CloseIcon className={buttonCloseStyles.cross} />
        </button >
        {popup.isInReport !== null &&
          <button
            onClick={() => toggleCurrentReportPolygon()}
            className={toggleButtonClassName}
          >
            {toggleButtonText}
          </button>
        }
      </div>
    </Popup>);
  }
}

PolygonLayerPopup.propTypes = {
  popup: PropTypes.object,
  toggleCurrentReportPolygon: PropTypes.func
};

export default PolygonLayerPopup;
