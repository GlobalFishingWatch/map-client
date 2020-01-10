import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classnames from 'classnames'
import MediaQuery from 'react-responsive'
import ExpandButton from 'app/components/Shared/ExpandButton'

import infoPanelStyles from 'styles/components/info-panel.module.scss'
import buttonCloseStyles from 'styles/components/button-close.module.scss'

import IconButton from 'app/components/Shared/IconButton'
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg'

import { INFO_STATUS } from 'app/constants'

import VesselInfoDetails from './VesselInfoDetails'

class VesselInfoPanel extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isExpanded: true,
    }
  }

  onExpand() {
    this.setState({
      isExpanded: !this.state.isExpanded,
    })
  }

  render() {
    const { vesselInfo, status, warningLiteral } = this.props

    if (status !== INFO_STATUS.LOADING && status !== INFO_STATUS.ERROR && vesselInfo === null) {
      return null
    }

    let vesselInfoContents = null

    if (status === INFO_STATUS.ERROR) {
      vesselInfoContents = (
        <div className={infoPanelStyles.metadata}>
          <div>
            <span aria-label="error" role="img">
              🚫
            </span>{' '}
            There was an error loading this vessel's information.
          </div>
        </div>
      )
    } else if (status === INFO_STATUS.LOADING) {
      vesselInfoContents = (
        <div className={infoPanelStyles.metadata}>
          <div>Loading vessel information...</div>
        </div>
      )
    } else if (
      this.props.userPermissions !== null &&
      this.props.userPermissions.indexOf('seeVesselBasicInfo') === -1
    ) {
      return null
    } else if (status === INFO_STATUS.LOADED && vesselInfo) {
      const canSeeVesselDetails =
        this.props.userPermissions !== null && this.props.userPermissions.indexOf('info') !== -1

      vesselInfoContents = (
        <div>
          <div className={infoPanelStyles.metadata}>
            <VesselInfoDetails {...this.props} />

            {canSeeVesselDetails && vesselInfo.mmsi && (
              <a
                className={infoPanelStyles.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                href={`http://www.marinetraffic.com/en/ais/details/ships/mmsi:${vesselInfo.mmsi}`}
              >
                Check it out on MarineTraffic.com
              </a>
            )}
            {!canSeeVesselDetails && (
              <a
                style={{ margin: 0 }}
                className={infoPanelStyles.externalLink}
                href={this.props.loginUrl}
              >
                Click here to login and
                <br />
                see more details
              </a>
            )}

            <div className={infoPanelStyles.actionIcons}>
              {((this.props.userPermissions !== null &&
                this.props.userPermissions.indexOf('pin-vessel') !== -1 &&
                this.props.layerIsPinable) ||
                vesselInfo.pinned) && (
                <div
                  onClick={() => {
                    this.props.onTogglePin(vesselInfo.id)
                  }}
                >
                  <IconButton icon="pin" activated={vesselInfo.pinned} />
                </div>
              )}

              <div onClick={this.props.targetVessel}>
                <IconButton icon="target" /* disabled={vesselInfo.hasTrack !== true} */ />
              </div>
              {vesselInfo.comment && (
                <div onClick={() => this.props.showWarning(vesselInfo.comment)}>
                  <IconButton icon="alert" title={warningLiteral} />
                </div>
              )}
            </div>
          </div>
          {vesselInfo.layerTitle && (
            <div className={infoPanelStyles.layer}>From layer: {vesselInfo.layerTitle}</div>
          )}
          {vesselInfo.parentEncounter !== null && vesselInfo.parentEncounter !== undefined && (
            <button
              className={classnames(infoPanelStyles.backButton)}
              onClick={() => {
                this.props.showParentEncounter(vesselInfo.parentEncounter)
              }}
            >
              <span className={infoPanelStyles.backIcon} />
              <span className={infoPanelStyles.backText}>back to encounter event</span>
              <span className={infoPanelStyles.ovalContainer}>
                <span className={infoPanelStyles.oval} />
              </span>
            </button>
          )}
        </div>
      )
    }

    return (
      <div
        className={classnames(infoPanelStyles.infoPanel, {
          [`${infoPanelStyles._expanded}`]: this.state.isExpanded,
        })}
      >
        <div className={infoPanelStyles.buttonsContainer}>
          <MediaQuery maxWidth={768}>
            <ExpandButton onExpand={() => this.onExpand()} isExpanded={this.state.isExpanded} />
          </MediaQuery>

          <button
            onClick={() => this.props.hide()}
            className={classnames(buttonCloseStyles.buttonClose, infoPanelStyles.closeBtn)}
          >
            <CloseIcon className={buttonCloseStyles.cross} />
          </button>
        </div>
        {vesselInfoContents}
      </div>
    )
  }
}

VesselInfoPanel.propTypes = {
  warningLiteral: PropTypes.string,
  vesselInfo: PropTypes.object,
  layerFieldsHeaders: PropTypes.array,
  layerIsPinable: PropTypes.bool,
  status: PropTypes.number,
  userPermissions: PropTypes.array,
  hide: PropTypes.func,
  onTogglePin: PropTypes.func,
  loginUrl: PropTypes.string.isRequired,
  showWarning: PropTypes.func.isRequired,
  showParentEncounter: PropTypes.func,
  targetVessel: PropTypes.func,
}

export default VesselInfoPanel
