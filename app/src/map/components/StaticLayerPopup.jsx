import React from 'react';
import { Popup } from 'react-map-gl';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import PopupStyles from 'styles/components/map/popup.scss';
import buttonCloseStyles from 'styles/components/button-close.scss';
import CloseIcon from '-!babel-loader!svg-react-loader!assets/icons/close.svg?name=Icon';

class StaticLayerPopup extends React.Component {
  render() {
    const { popup, toggleCurrentReportPolygon } = this.props;
    const toggleButtonText = (popup.isInReport === true) ? 'remove from report' : 'add to report';
    let toggleButtonClassName = classnames(PopupStyles.toggle);
    if (popup.isInReport === true) {
      toggleButtonClassName += ` ${PopupStyles._remove}`;
    }
    return (<Popup
      latitude={popup.latitude}
      longitude={popup.longitude}
      closeButton={false}
      anchor="bottom"
      offsetTop={-10}
      tipSize={5}
    >
      <div className={classnames('js-preventMapInteraction', PopupStyles.popup)}>
        <div className={PopupStyles.title} >
          {popup.layerTitle}
        </div >
        <div className={PopupStyles.description} >
          {popup.fields.map(field => (
            <div key={field.title}>
              <b>{field.title}</b>
              {' '}
              <span>{field.value}</span>
            </div>
          ))}
        </div >
        <button
          className={classnames('js-close', 'js-preventMapInteraction', PopupStyles.close, buttonCloseStyles.buttonClose)}
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

StaticLayerPopup.propTypes = {
  popup: PropTypes.object,
  toggleCurrentReportPolygon: PropTypes.func
};

export default StaticLayerPopup;
