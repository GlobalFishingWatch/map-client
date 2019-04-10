import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { POLYGON_LAYERS_AREA } from 'constants';
import PopupStyles from 'styles/components/map/popup.scss';

const humanizePopupFieldId = id => id
  .replace(POLYGON_LAYERS_AREA, 'Est. area km²')
  .replace('_', ' ')
  .replace(/\b\w/g, l => l.toUpperCase());

const getPopupData = (workspaceLayers, report, event) => {
  const layerId = event.layer.id;
  const staticLayer = workspaceLayers.find(l => l.id === layerId);

  const layerIsInReport = report.layerId === layerId;

  const polygonIsInReport =
    layerIsInReport === true &&
    report.polygons.find(polygon => polygon.reportingId === event.target.properties.reporting_id) !== undefined;

  return {
    layerTitle: staticLayer.title,
    fields: event.target.fields,
    layerIsInReport,
    polygonIsInReport
  };
};

class StaticLayerPopup extends React.Component {
  render() {
    const { workspaceLayers, report, event, toggleCurrentReportPolygon } = this.props;
    const popup = getPopupData(workspaceLayers, report, event);
    const toggleButtonText = (popup.polygonIsInReport === true) ? 'remove from report' : 'add to report';
    let toggleButtonClassName = classnames(PopupStyles.toggle);
    if (popup.polygonIsInReport === true) {
      toggleButtonClassName += ` ${PopupStyles._remove}`;
    }
    return (
      <div className={PopupStyles.popup}>
        <div className={PopupStyles.title} >
          {popup.layerTitle}
        </div >
        <div className={PopupStyles.description} >
          {popup.fields.map(field => (
            <div key={field.title}>
              <b>{humanizePopupFieldId(field.title)}</b>
              {' '}
              {(field.isLink === true) ? (
                <a href={field.value}>Click here for more details</a>
              ) : (
                <span>{field.value}</span>
              )}
            </div>
          ))}
        </div >
        {popup.layerIsInReport === true &&
          <button
            onClick={() => {
              toggleCurrentReportPolygon();
            }}
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
  toggleCurrentReportPolygon: PropTypes.func
};

export default StaticLayerPopup;
