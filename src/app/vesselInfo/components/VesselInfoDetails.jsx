import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { getCountry } from 'iso-3166-1-alpha-2'
import moment from 'moment'
import { FORMAT_DATE, FORMAT_TIME } from 'app/config'

import infoPanelStyles from 'styles/components/info-panel.module.scss'

class VesselInfoDetails extends Component {
  render() {
    const { vesselInfo, layerFieldsHeaders, canSeeVesselDetails } = this.props

    const renderedFieldList = this.generateVesselDetails(
      layerFieldsHeaders,
      canSeeVesselDetails,
      vesselInfo
    )

    return (
      <div className={infoPanelStyles.details}>
        {this.props.children}
        {renderedFieldList}
      </div>
    )
  }

  generateVesselDetails(layerFields, canSeeVesselDetails, vesselInfo) {
    const renderedFieldList = []

    layerFields
      .filter((field) => field.display !== false && (canSeeVesselDetails || field.anonymous))
      .forEach((field) => {
        let linkList
        if (vesselInfo[field.id] === undefined) {
          return
        }

        const kind = field.kind || field.id

        switch (kind) {
          case 'prefixedCSVMultiLink':
            if (!vesselInfo[field.id]) {
              break
            }
            renderedFieldList.push(
              <div key={field.id} className={infoPanelStyles.rowInfo}>
                <span className={infoPanelStyles.key}>{field.display}</span>
                <ul className={infoPanelStyles.linkList}>
                  <li className={infoPanelStyles.linkListItem}>
                    <a
                      className={infoPanelStyles.externalLink}
                      href={`${field.prefix}${vesselInfo[field.id]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {vesselInfo[field.id]}
                    </a>
                  </li>
                </ul>
              </div>
            )
            break
          case 'objectArrayMultiLink':
            linkList = []
            vesselInfo[field.id].forEach((registry) => {
              linkList.push(
                <li key={registry.rfmo} className={infoPanelStyles.linkListItem}>
                  <a
                    className={infoPanelStyles.externalLink}
                    href={`${registry.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {registry.rfmo}
                  </a>
                </li>
              )
            })
            renderedFieldList.push(
              <div key={field.id} className={infoPanelStyles.rowInfo}>
                <span className={infoPanelStyles.key}>{field.display}</span>
                <ul className={infoPanelStyles.linkList}>{linkList}</ul>
              </div>
            )
            break
          case 'flag':
            renderedFieldList.push(
              <div key={field.id} className={infoPanelStyles.rowInfo}>
                <span className={infoPanelStyles.key}>{field.display}</span>
                <span className={infoPanelStyles.value}>
                  {getCountry(vesselInfo[field.id]) || '---'}
                </span>
              </div>
            )
            break
          case 'datetime': {
            const humanizedDate = vesselInfo[field.id]
              ? moment(vesselInfo[field.id])
                  .utc()
                  .format(`${FORMAT_DATE} ${FORMAT_TIME} UTC`)
              : null
            renderedFieldList.push(
              <div key={field.id} className={infoPanelStyles.rowInfo}>
                <span className={infoPanelStyles.key}>{field.display}</span>
                <span className={infoPanelStyles.value}>{humanizedDate || '---'}</span>
              </div>
            )
            break
          }
          default:
            renderedFieldList.push(
              <div key={field.id} className={infoPanelStyles.rowInfo}>
                <span className={infoPanelStyles.key}>{field.display}</span>
                <span className={infoPanelStyles.value}>{vesselInfo[field.id] || '---'}</span>
              </div>
            )
        }
      })

    return renderedFieldList
  }
}

VesselInfoDetails.propTypes = {
  layerFieldsHeaders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      display: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
      kind: PropTypes.string,
      titlePriority: PropTypes.number,
      prefix: PropTypes.string,
    })
  ).isRequired,
  vesselInfo: PropTypes.object.isRequired,
  canSeeVesselDetails: PropTypes.bool.isRequired,
  children: PropTypes.node,
}

VesselInfoDetails.defaultProps = {
  children: null,
}

export default VesselInfoDetails
