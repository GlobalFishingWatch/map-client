import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import ZoomControls from 'app/mapPanels/leftControlPanel/components/ZoomControls'
import LanguageSelector from 'app/components/Shared/LanguageSelector'
import Loader from 'app/mapPanels/leftControlPanel/containers/Loader'
import Rulers from 'app/rulers/containers/Rulers'
import LeftControlPanelStyles from 'app/mapPanels/leftControlPanel/components/leftControlPanel.module.scss'

class LeftControlPanel extends Component {
  changeZoomLevel = (event) => {
    if (event.currentTarget.id === 'zoom_in') {
      this.props.incrementZoom()
    } else {
      this.props.decrementZoom()
    }
  }

  render() {
    const { isEmbedded, mouseLatLon, canShareWorkspaces } = this.props

    return (
      <div className={LeftControlPanelStyles.container}>
        {mouseLatLon !== null && (
          <div className={LeftControlPanelStyles.latlon}>
            {mouseLatLon.latitude.toFixed(4)}, {mouseLatLon.longitude.toFixed(4)}
          </div>
        )}
        <ZoomControls
          canShareWorkspaces={canShareWorkspaces}
          openShareModal={this.props.openShareModal}
          canZoomIn={this.props.canZoomIn}
          canZoomOut={this.props.canZoomOut}
          changeZoomLevel={this.changeZoomLevel}
        />
        <LanguageSelector />
        <Rulers />
        <div
          className={classnames(LeftControlPanelStyles.mapLoader, {
            [LeftControlPanelStyles._isEmbedded]: isEmbedded,
          })}
        >
          <Loader tiny />
        </div>
      </div>
    )
  }
}

LeftControlPanel.propTypes = {
  isEmbedded: PropTypes.bool.isRequired,
  canZoomIn: PropTypes.bool.isRequired,
  canZoomOut: PropTypes.bool.isRequired,
  mouseLatLon: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
  openShareModal: PropTypes.func.isRequired,
  incrementZoom: PropTypes.func.isRequired,
  decrementZoom: PropTypes.func.isRequired,
  canShareWorkspaces: PropTypes.bool.isRequired,
}

LeftControlPanel.defaultProps = {
  canZoomIn: false,
  canZoomOut: false,
  mouseLatLon: [0, 0],
}

export default LeftControlPanel
