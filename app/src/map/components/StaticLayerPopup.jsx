import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { POLYGON_LAYERS_AREA } from 'constants';
import PopupStyles from 'styles/components/map/popup.scss';
import buttonCloseStyles from 'styles/components/button-close.scss';
import CloseIcon from '-!babel-loader!svg-react-loader!assets/icons/close.svg?name=Icon';

const humanizePopupFieldId = id => id
  .replace(POLYGON_LAYERS_AREA, 'Est. area km²')
  .replace('_', ' ')
  .replace(/\b\w/g, l => l.toUpperCase());

const getPopupData = (workspaceLayers, report, event) => {
  console.log(event)
  const layerId = event.layer.id;
  const staticLayer = workspaceLayers.find(l => l.id === layerId);

  const layerIsInReport = report.layerId === layerId;
  // if (metaFields === null || (FEATURE_FLAG_EXTENDED_POLYGON_LAYERS === false && layerIsInReport === false)) {
  //   return;
  // }

  const isInReport = (layerIsInReport === true)
    ? report.polygons.find(polygon => polygon.reportingId === event.target.properties.reporting_id)
    : null;

  return {
    layerTitle: staticLayer.title,
    fields: event.target.fields,
    isInReport
  };
};

class StaticLayerPopup extends React.Component {
  render() {
    const { workspaceLayers, report, event, toggleCurrentReportPolygon } = this.props;
    const popup = getPopupData(workspaceLayers, report, event);
    const toggleButtonText = (popup.isInReport === true) ? 'remove from repo  rt' : 'add to report';
    let toggleButtonClassName = classnames(PopupStyles.toggle);
    if (popup.isInReport === true) {
      toggleButtonClassName += ` ${PopupStyles._remove}`;
    }
    return (
      <div className={classnames('js-preventMapInteraction', PopupStyles.popup)}>
        <div className={PopupStyles.title} >
          {popup.layerTitle}
        </div >
        <div className={PopupStyles.description} >
          {popup.fields.map(field => (
            <div key={field.title}>
              <b>{humanizePopupFieldId(field.title)}</b>
              {' '}
              <span>{field.value}</span>
            </div>
          ))}
        </div >
        {/* <button
          className={classnames('js-close', 'js-preventMapInteraction', PopupStyles.close, buttonCloseStyles.buttonClose)}
          onClick={this.props.clearPopup}
        >
          <CloseIcon className={buttonCloseStyles.cross} />
        </button > */}
        {popup.isInReport !== null &&
          <button
            onClick={() => toggleCurrentReportPolygon()}
            className={toggleButtonClassName}
          >
            {toggleButtonText}
          </button>
        }
      </div>);
  }
}

StaticLayerPopup.propTypes = {
  event: PropTypes.object,
  workspaceLayers: PropTypes.array,
  report: PropTypes.object,
  toggleCurrentReportPolygon: PropTypes.func,
  clearPopup: PropTypes.func
};

export default StaticLayerPopup;
