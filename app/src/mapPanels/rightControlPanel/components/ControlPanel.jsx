import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import { CONTROL_PANEL_MENUS } from 'constants';
import MediaQuery from 'react-responsive';
import MenuLink from 'mapPanels/rightControlPanel/components/MenuLink';
import SubMenu from 'mapPanels/rightControlPanel/containers/SubMenu';
import FilterGroupPanel from 'filters/containers/FilterGroupPanel';
import LayerPanel from 'layers/containers/LayerPanel';
import LayerManagement from 'layers/containers/LayerManagement';
import SearchPanel from 'search/containers/SearchPanel';
import VesselInfoPanel from 'vesselInfo/containers/VesselInfoPanel';
import EncountersPanel from 'encounters/containers/EncountersPanel';
import ControlPanelStyles from 'styles/components/control_panel.scss';
import iconStyles from 'styles/icons.scss';
import SearchIcon from '-!babel-loader!svg-react-loader!assets/icons/search.svg?name=SearchIcon';
import ReportsIcon from '-!babel-loader!svg-react-loader!assets/icons/report-menu.svg?name=ReportsIcon';
import LayersIcon from '-!babel-loader!svg-react-loader!assets/icons/layers-menu.svg?name=LayersIcon';
import FiltersIcon from '-!babel-loader!svg-react-loader!assets/icons/filters-menu.svg?name=FiltersIcon';
import Vessels from 'vessels/containers/Vessels';
import ControlPanelHeader from '../containers/ControlPanelHeader';

class ControlPanel extends Component {
  constructor() {
    super();
    this.onCloseVesselsSubMenu = this.onCloseVesselsSubMenu.bind(this);
    this.onCloseLayersSubMenu = this.onCloseLayersSubMenu.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (
      (this.props.isReportStarted === true && prevProps.isReportStarted !== this.props.isReportStarted) ||
      (this.props.encountersInfo !== null && prevProps.encountersInfo !== this.props.encountersInfo) ||
      (this.props.currentlyShownVessel !== null && prevProps.currentlyShownVessel !== this.props.currentlyShownVessel)
    ) {
      this._animateScroll();
    }
  }

  _animateScroll() {
    const targetY = this.controlPanelRef.clientHeight;
    let nextY = this.controlPanelRef.scrollTop;
    const step = () => {
      const currentY = nextY;
      const deltaY = targetY - currentY;
      const incrementY = deltaY * 0.1;
      nextY += incrementY;
      this.controlPanelRef.scrollTop = nextY;

      if (nextY < targetY - 5) {
        window.requestAnimationFrame(step);
      } else {
        this.controlPanelRef.scrollTop = targetY;
      }
    };
    window.requestAnimationFrame(step);
  }

  onCloseVesselsSubMenu() {
    this.props.hideSearchResults();

    if (this.props.pinnedVesselEditMode === true) {
      this.props.disableSearchEditMode();
    }
  }

  onCloseLayersSubMenu() {
    if (this.props.layerPanelEditMode === true) {
      this.props.disableLayerPanelEditMode();
    }
  }

  renderIcon(iconName) {
    const iconComponents = {
      vessels: SearchIcon,
      layers: LayersIcon,
      filters: FiltersIcon,
      reports: ReportsIcon
    };
    const IconName = iconComponents[iconName];
    return <IconName className={classnames([iconStyles[`${iconName}Icon`]])} />;
  }

  renderVesselsSubMenu() {
    return (
      <div>
        <SubMenu
          title="Vessels"
          icon={this.renderIcon('vessels')}
          onBack={this.onCloseVesselsSubMenu}
        >
          {this.props.userPermissions !== null && this.props.userPermissions.indexOf('search') === -1 ?
            <div >
              <a
                className="loginRequiredLink"
                onClick={this.props.login}
              >Only registered users can use the search feature. Click here to log in.</a >
              <Vessels />
            </div > :
            <div >
              <SearchPanel />
              <Vessels />
            </div >
          }
        </SubMenu >
      </div>
    );
  }

  renderFiltersSubMenu() {
    return (
      <SubMenu
        title="Filters"
        icon={this.renderIcon('filters')}
      >
        <FilterGroupPanel />
      </SubMenu >
    );
  }

  renderLayersSubMenu() {
    return (
      <SubMenu
        title="Layers"
        icon={this.renderIcon('layers')}
        onBack={this.onCloseLayersSubMenu}
      >
        <LayerPanel />
        <LayerManagement />
      </SubMenu >
    );
  }

  renderReportsSubMenu() {
    return (
      <SubMenu title="Reports" icon={this.renderIcon('reports')}>
        <h1>Coming soon...</h1>
      </SubMenu >
    );
  }

  renderMainMenuNav(desktop) {
    return (
      <div className={classnames[ControlPanelStyles.mapOptionsContainer]} >
        <div
          className={classnames(ControlPanelStyles.mapOptions, {
            [ControlPanelStyles._noFooter]: (!COMPLETE_MAP_RENDER && !desktop)
          })}
        >
          <ControlPanelHeader />
          <MenuLink
            title="Vessels"
            icon={this.renderIcon('vessels')}
            badge={this.props.numPinnedVessels}
            onClick={() => this.props.setSubmenu(CONTROL_PANEL_MENUS.VESSELS)}
          />
          <MenuLink
            title="Layers"
            icon={this.renderIcon('layers')}
            onClick={() => this.props.setSubmenu(CONTROL_PANEL_MENUS.LAYERS)}
          />
          <MenuLink
            title="Filters"
            icon={this.renderIcon('filters')}
            badge={this.props.numFilters}
            onClick={() => this.props.setSubmenu(CONTROL_PANEL_MENUS.FILTERS)}
          />
        </div >
      </div >
    );
  }

  renderSubMenu(desktop) {
    switch (this.props.activeSubmenu) {
      case CONTROL_PANEL_MENUS.VESSELS:
        return this.renderVesselsSubMenu();
      case CONTROL_PANEL_MENUS.LAYERS:
        return this.renderLayersSubMenu();
      case CONTROL_PANEL_MENUS.FILTERS:
        return this.renderFiltersSubMenu();
      case CONTROL_PANEL_MENUS.REPORTS:
        return this.renderReportsSubMenu();
      default:
        return this.renderMainMenuNav(desktop);
    }
  }

  render() {
    return (
      <MediaQuery minWidth={768} >
        {desktop => (
          <div
            className={classnames([ControlPanelStyles.controlPanel, ControlPanelStyles[status]])}
            ref={(controlPanel) => {
              this.controlPanelRef = controlPanel;
            }}
          >
            <div className={classnames([ControlPanelStyles.bgWrapper])} >
              {this.renderSubMenu(desktop)}
              <VesselInfoPanel />
              <EncountersPanel />
            </div >
          </div >
        )}
      </MediaQuery >
    );
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
  login: PropTypes.func,
  pinnedVesselEditMode: PropTypes.bool,
  setSubmenu: PropTypes.func.isRequired,
  userPermissions: PropTypes.array,
  vessels: PropTypes.array,
  numPinnedVessels: PropTypes.number.isRequired,
  numFilters: PropTypes.number.isRequired,
  encountersInfo: PropTypes.object,
  currentlyShownVessel: PropTypes.object
};

export default ControlPanel;
