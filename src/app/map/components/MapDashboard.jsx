import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import ControlPanel from 'app/mapPanels/rightControlPanel/containers/ControlPanel'
import TimebarWrapper from 'app/timebar/containers/TimebarWrapper'
import ReportPanel from 'app/report/containers/ReportPanel'
import MapFooter from 'app/siteNav/components/MapFooter'
import LeftControlPanel from 'app/mapPanels/leftControlPanel/containers/LeftControlPanel'
import MapPanelsStyles from 'styles/components/map-panels.module.scss'
import MapDashboardStyles from 'app/map/components/mapDashboard.module.scss'
import MapWrapper from 'app/map/containers/MapWrapper'

const COMPLETE_MAP_RENDER = process.env.REACT_APP_COMPLETE_MAP_RENDER === false

class MapDashboard extends Component {
  state = {
    attributions: [],
  }
  onAttributionsChange = (attributions) => {
    this.setState({ attributions })
  }
  render() {
    console.log('plop')
    const {
      isEmbedded,
      openSupportFormModal,
      onExternalLink,
      onToggleMapPanelsExpanded,
      mapPanelsExpanded,
      isWorkspaceLoaded,
    } = this.props

    const { attributions } = this.state
    return (
      <div className="fullHeightContainer">
        {!isEmbedded && (
          <div
            className={classnames(MapPanelsStyles.mapPanels, {
              [MapPanelsStyles._noFooter]: COMPLETE_MAP_RENDER,
              [MapPanelsStyles._expanded]: mapPanelsExpanded,
            })}
          >
            <div className={MapPanelsStyles.expandButton} onClick={onToggleMapPanelsExpanded} />
            <ControlPanel isEmbedded={isEmbedded} />
            <ReportPanel />
          </div>
        )}
        <div
          className={classnames(MapDashboardStyles.mapContainer, {
            [MapDashboardStyles._noFooter]: COMPLETE_MAP_RENDER,
          })}
          ref={(mapContainerRef) => {
            this.mapContainerRef = mapContainerRef
          }}
        >
          {isWorkspaceLoaded === true && (
            <MapWrapper onAttributionsChange={this.onAttributionsChange} />
          )}
          <LeftControlPanel />
        </div>
        <div
          className={classnames(MapDashboardStyles.timebarContainer, {
            [MapDashboardStyles._noFooter]: COMPLETE_MAP_RENDER,
          })}
        >
          <TimebarWrapper />
        </div>
        {!COMPLETE_MAP_RENDER && (
          <MapFooter
            onOpenSupportFormModal={openSupportFormModal}
            isEmbedded={isEmbedded}
            onExternalLink={onExternalLink}
            attributions={attributions}
          />
        )}
      </div>
    )
  }
}

MapDashboard.propTypes = {
  isEmbedded: PropTypes.bool,
  mapPanelsExpanded: PropTypes.bool,
  onExternalLink: PropTypes.func,
  openSupportFormModal: PropTypes.func,
  onToggleMapPanelsExpanded: PropTypes.func,
  isWorkspaceLoaded: PropTypes.bool,
}

export default MapDashboard
