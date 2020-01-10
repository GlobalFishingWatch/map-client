import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classnames from 'classnames'
import { CONTROL_PANEL_MENUS } from 'app/constants'
import MediaQuery from 'react-responsive'
import Icon from 'app/components/Shared/Icon'
import MenuLink from 'app/mapPanels/rightControlPanel/components/MenuLink'
import SubMenu from 'app/mapPanels/rightControlPanel/containers/SubMenu'
import FilterGroupPanel from 'app/filters/containers/FilterGroupPanel'
import LayerPanel from 'app/layers/containers/LayerPanel'
import SearchPanel from 'app/search/containers/SearchPanel'
import VesselInfoPanel from 'app/vesselInfo/containers/VesselInfoPanel'
import EncountersPanel from 'app/encounters/containers/EncountersPanel'
import ControlPanelStyles from 'styles/components/control_panel.module.scss'
import Vessels from 'app/vessels/containers/Vessels'
import ControlPanelHeader from '../containers/ControlPanelHeader'

const COMPLETE_MAP_RENDER = process.env.REACT_APP_COMPLETE_MAP_RENDER === false

class ControlPanel extends Component {
  constructor() {
    super()
    this.onCloseVesselsSubMenu = this.onCloseVesselsSubMenu.bind(this)
    this.onCloseLayersSubMenu = this.onCloseLayersSubMenu.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (
      (this.props.isReportStarted === true &&
        prevProps.isReportStarted !== this.props.isReportStarted) ||
      (this.props.encountersInfo !== null &&
        prevProps.encountersInfo !== this.props.encountersInfo) ||
      (this.props.currentlyShownVessel !== null &&
        prevProps.currentlyShownVessel !== this.props.currentlyShownVessel)
    ) {
      this._animateScroll()
    }
  }

  _animateScroll() {
    const targetY = this.controlPanelRef.clientHeight
    let nextY = this.controlPanelRef.scrollTop
    const step = () => {
      const currentY = nextY
      const deltaY = targetY - currentY
      const incrementY = deltaY * 0.1
      nextY += incrementY
      this.controlPanelRef.scrollTop = nextY

      if (nextY < targetY - 5) {
        window.requestAnimationFrame(step)
      } else {
        this.controlPanelRef.scrollTop = targetY
      }
    }
    window.requestAnimationFrame(step)
  }

  onCloseVesselsSubMenu() {
    this.props.hideSearchResults()

    if (this.props.pinnedVesselEditMode === true) {
      this.props.disableSearchEditMode()
    }
  }

  onCloseLayersSubMenu() {
    if (this.props.layerPanelEditMode === true) {
      this.props.disableLayerPanelEditMode()
    }
  }

  renderVesselsSubMenu() {
    return (
      <div>
        <SubMenu title="Vessels" onClose={this.onCloseVesselsSubMenu}>
          {this.props.userPermissions !== null &&
          this.props.userPermissions.indexOf('search') === -1 ? (
            <div>
              <a className="loginRequiredLink" href={this.props.loginUrl}>
                Only registered users can use the search feature. Click here to log in.
              </a>
              <Vessels />
            </div>
          ) : (
            <div>
              <SearchPanel />
              <Vessels />
            </div>
          )}
        </SubMenu>
      </div>
    )
  }

  renderFiltersSubMenu() {
    return (
      <SubMenu title="Filters">
        <FilterGroupPanel />
      </SubMenu>
    )
  }

  renderLayersSubMenu() {
    return (
      <SubMenu title="Layers" onClose={this.onCloseLayersSubMenu}>
        <LayerPanel />
      </SubMenu>
    )
  }

  renderReportsSubMenu() {
    return (
      <SubMenu title="Reports">
        <h1>Coming soon...</h1>
      </SubMenu>
    )
  }

  renderMainMenuNav(desktop) {
    return (
      <div className={classnames[ControlPanelStyles.mapOptionsContainer]}>
        <div
          className={classnames(ControlPanelStyles.mapOptions, {
            [ControlPanelStyles._noFooter]: !COMPLETE_MAP_RENDER && !desktop,
          })}
        >
          <ControlPanelHeader />
          <MenuLink
            title="Vessels"
            icon={<Icon icon="vessels" activated />}
            badge={this.props.numPinnedVessels}
            onClick={() => this.props.setSubmenu(CONTROL_PANEL_MENUS.VESSELS)}
          />
          <MenuLink
            title="Layers"
            icon={<Icon icon="layers" activated />}
            onClick={() => this.props.setSubmenu(CONTROL_PANEL_MENUS.LAYERS)}
          />
          <MenuLink
            title="Filters"
            icon={<Icon icon="filters" activated />}
            badge={this.props.numFilters}
            onClick={() => this.props.setSubmenu(CONTROL_PANEL_MENUS.FILTERS)}
          />
        </div>
      </div>
    )
  }

  renderSubMenu(desktop) {
    switch (this.props.activeSubmenu) {
      case CONTROL_PANEL_MENUS.VESSELS:
        return this.renderVesselsSubMenu()
      case CONTROL_PANEL_MENUS.LAYERS:
        return this.renderLayersSubMenu()
      case CONTROL_PANEL_MENUS.FILTERS:
        return this.renderFiltersSubMenu()
      case CONTROL_PANEL_MENUS.REPORTS:
        return this.renderReportsSubMenu()
      default:
        return this.renderMainMenuNav(desktop)
    }
  }

  render() {
    return (
      <MediaQuery minWidth={768}>
        {(desktop) => (
          <div
            className={classnames([ControlPanelStyles.controlPanel, ControlPanelStyles.status])}
            ref={(controlPanel) => {
              this.controlPanelRef = controlPanel
            }}
          >
            <div className={ControlPanelStyles.bgWrapper}>
              {this.renderSubMenu(desktop)}
              <VesselInfoPanel />
              <EncountersPanel />
            </div>
          </div>
        )}
      </MediaQuery>
    )
  }
}

ControlPanel.propTypes = {
  activeSubmenu: PropTypes.string,
  disableLayerPanelEditMode: PropTypes.func,
  disableSearchEditMode: PropTypes.func,
  hideSearchResults: PropTypes.func,
  isEmbedded: PropTypes.bool,
  isReportStarted: PropTypes.bool,
  layerPanelEditMode: PropTypes.bool,
  layers: PropTypes.array,
  loginUrl: PropTypes.string.isRequired,
  pinnedVesselEditMode: PropTypes.bool,
  setSubmenu: PropTypes.func.isRequired,
  userPermissions: PropTypes.array,
  vessels: PropTypes.array,
  numPinnedVessels: PropTypes.number.isRequired,
  numFilters: PropTypes.number.isRequired,
  encountersInfo: PropTypes.object,
  currentlyShownVessel: PropTypes.object,
}

export default ControlPanel
