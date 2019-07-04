import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { POLYGON_LAYERS_AREA } from 'app/constants'
import PopupStyles from 'styles/components/map/popup.module.scss'

const humanizePopupFieldId = (id) =>
  id
    .replace(POLYGON_LAYERS_AREA, 'Est. area km²')
    .replace('_', ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())

const getPopupData = (report, event) => {
  const feature = event.feature
  const layerId = feature.layer.id

  const layerIsInReport = report.layerId === layerId

  const polygonIsInReport =
    layerIsInReport === true &&
    report.polygons.find((polygon) => polygon.reportingId === feature.properties.reporting_id) !==
      undefined

  return {
    fields: feature.fields,
    layerIsInReport,
    polygonIsInReport,
  }
}

class StaticLayerPopup extends React.Component {
  render() {
    const { layerTitle, report, event, toggleCurrentReportPolygon } = this.props
    const popup = getPopupData(report, event)
    const toggleButtonText =
      popup.polygonIsInReport === true ? 'remove from report' : 'add to report'
    let toggleButtonClassName = classnames(PopupStyles.toggle)
    if (popup.polygonIsInReport === true) {
      toggleButtonClassName += ` ${PopupStyles._remove}`
    }
    return (
      <div className={PopupStyles.popup}>
        <div className={PopupStyles.title}>{layerTitle}</div>
        <div className={PopupStyles.description}>
          {popup.fields.map((field) => (
            <div key={field.title}>
              <b>{humanizePopupFieldId(field.label)}</b>{' '}
              {field.isLink === true ? (
                <a href={field.value}>Click here for more details</a>
              ) : (
                <span>{field.value}</span>
              )}
            </div>
          ))}
        </div>
        {popup.layerIsInReport === true && (
          <button
            onClick={() => {
              toggleCurrentReportPolygon()
            }}
            className={toggleButtonClassName}
          >
            {toggleButtonText}
          </button>
        )}
      </div>
    )
  }
}

StaticLayerPopup.propTypes = {
  event: PropTypes.object.isRequired,
  layerTitle: PropTypes.string.isRequired,
  report: PropTypes.object.isRequired,
  toggleCurrentReportPolygon: PropTypes.func.isRequired,
}

export default StaticLayerPopup
