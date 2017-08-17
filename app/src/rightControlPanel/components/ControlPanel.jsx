import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import MediaQuery from 'react-responsive';
import AreasPanel from 'areasOfInterest/containers/AreasPanel';
import MenuLink from 'rightControlPanel/components/MenuLink';
import SubMenu from 'rightControlPanel/components/SubMenu';
import FilterPanel from 'filters/containers/FilterPanel';
import BasemapPanel from 'basemap/containers/BasemapPanel';
import LayerPanel from 'layers/containers/LayerPanel';
import LayerManagement from 'layers/containers/LayerManagement';
import SearchPanel from 'search/containers/SearchPanel';
import VesselInfoPanel from 'containers/Map/VesselInfoPanel';
import ControlPanelStyles from 'styles/components/control_panel.scss';
import iconStyles from 'styles/icons.scss';
import SearchIcon from '-!babel-loader!svg-react-loader!assets/icons/search-icon.svg?name=SearchIcon';
import BasemapIcon from '-!babel-loader!svg-react-loader!assets/icons/basemap-icon.svg?name=BasemapIcon';
import LayersIcon from '-!babel-loader!svg-react-loader!assets/icons/layers-icon.svg?name=LayersIcon';
import FiltersIcon from '-!babel-loader!svg-react-loader!assets/icons/filters-icon.svg?name=FiltersIcon';
import InfoIcon from '-!babel-loader!svg-react-loader!assets/icons/info-icon.svg?name=InfoIcon';
import PinnedVesselList from 'pinnedVessels/containers/PinnedVesselList';
import Transition from 'react-transition-group/Transition';

class ControlPanel extends Component {
  constructor() {
    super();
    this.changeActiveSubmenu = this.changeActiveSubmenu.bind(this);
    this.onBack = this.onBack.bind(this);
    this.state = { showSubmenu: false };
  }

  componentDidUpdate() {
    if (this.props.isReportStarted === true) {
      this.controlPanelRef.scrollTop = this.controlPanelRef.clientHeight;
    }
  }

  onCloseSearch() {
    this.props.hideSearchResults();

    if (this.props.pinnedVesselEditMode === true) {
      this.props.disableSearchEditMode();
    }
  }

  onCloseLayerPicker() {
    if (this.props.layerPanelEditMode === true) {
      this.props.disableLayerPanelEditMode();
    }
  }

  calculateFishingHours() {
    const min = this.props.timelineInnerExtent[0].getTime();
    const max = this.props.timelineInnerExtent[1].getTime();

    if (this.props.chartData.length === 0) {
      return '-';
    }

    const result = this.props.chartData.reduce((acc, elem) => {
      if (elem.date >= min && elem.date <= max) {
        return acc + elem.value;
      }
      return acc;
    }, 0);

    return Math.round(result).toLocaleString();
  }

  renderResume() {
    return (
      <div className={ControlPanelStyles.resumeDisplay} >
        <div className={ControlPanelStyles.categoriesDisplay} >
          <div className={ControlPanelStyles.vesselDisplay} >
            <span className={ControlPanelStyles.counterDescription} >
              Vessels activity
              <InfoIcon className={ControlPanelStyles.fishingHours} onClick={() => this.props.openTimebarInfoModal()} />
            </span >
            <span className={ControlPanelStyles.total} >{this.calculateFishingHours()}</span >
          </div >
        </div >
      </div >
    );
  }

  changeActiveSubmenu(submenuName) {
    this.setState({ showSubmenu: true });
    this.props.setSubmenu(submenuName);
  }

  onBack() {
    if (this.props.activeSubmenu === 'AREAS') {
      this.props.setRecentlyCreated(false);
      this.props.setDrawingMode(false);
    }
    this.setState({ showSubmenu: false });
    this.props.setSubmenu(null);
  }

  renderIcon(iconName) {
    const iconComponents = {
      vessels: SearchIcon,
      basemap: BasemapIcon,
      layers: LayersIcon,
      filters: FiltersIcon
    };
    const IconName = iconComponents[iconName];
    return <IconName className={classnames([iconStyles.icons, ControlPanelStyles[`${iconName}Icon`]])} />;
  }

  render() {
    const { activeSubmenu, isDrawing } = this.props;
    const numPinnedVessels = this.props.vessels.filter(vessel => vessel.pinned === true).length;

    const searchHeader = (
      <div >
        <MediaQuery maxWidth={767} >
          {numPinnedVessels > 0 &&
          <div className={ControlPanelStyles.pinnedItemCount} >
            ({numPinnedVessels})
          </div >}
        </MediaQuery >
        <MediaQuery minWidth={768} >
          {numPinnedVessels > 0 &&
          <div className={ControlPanelStyles.pinnedItemCount} >
            {numPinnedVessels} pinned
          </div >}
        </MediaQuery >
      </div >);

    const searchSubmenu = (
      <div>
        <SubMenu title="Vessels" icon={this.renderIcon('vessels')} extraHeader={searchHeader} onBack={this.onBack} >
          {this.props.userPermissions !== null && this.props.userPermissions.indexOf('search') === -1 ?
            <div >
              <a
                className="loginRequiredLink"
                onClick={this.props.login}
              >Only registered users can use the search feature. Click here to log in.</a >
              <PinnedVesselList />
            </div > :
            <div >
              <SearchPanel />
              <PinnedVesselList />
            </div >
          }
        </SubMenu >
        <VesselInfoPanel />
      </div>
    );

    const layerSubmenu = (
      <SubMenu title="Layers" icon={this.renderIcon('layers')} onBack={this.onBack} >
        <BasemapPanel />
        <LayerPanel />
        <LayerManagement />
      </SubMenu >
    );

    const filterSubmenu = (
      <SubMenu title="Filters" icon={this.renderIcon('filters')} onBack={this.onBack} >
        <FilterPanel />
      </SubMenu >
    );

    let areaFooter = null;
    if (isDrawing) {
      areaFooter = (<div>
        <div>
          Click over the map and create your own area of interest
        </div >
      </div>);
    }

    const areaSubmenu = (
      <SubMenu title="Area of interest" icon={this.renderIcon('filters')} onBack={this.onBack} footer={areaFooter} >
        <AreasPanel />
      </SubMenu >
    );

    const submenus = {
      AREAS: areaSubmenu,
      FILTERS: filterSubmenu,
      LAYERS: layerSubmenu,
      VESSELS: searchSubmenu
    };

    return (
      <MediaQuery minWidth={768} >
        {desktop => (
          <Transition in={this.state.showSubmenu} timeout={0}>
            {status => (
              <div
                className={classnames([ControlPanelStyles.controlpanel, ControlPanelStyles[status]])}
                ref={(controlPanel) => {
                  this.controlPanelRef = controlPanel;
                }}
              >
                <div className={classnames([ControlPanelStyles.bgWrapper])} >
                  {activeSubmenu ?
                    submenus[activeSubmenu]
                    :
                    <div className={classnames[ControlPanelStyles.mapOptionsContainer]} >
                      <div
                        className={classnames(ControlPanelStyles.mapOptions, {
                          [ControlPanelStyles._noFooter]: (!COMPLETE_MAP_RENDER && !desktop)
                        })}
                      >
                        {this.renderResume()}
                        <MenuLink
                          title="Vessels"
                          icon={this.renderIcon('vessels')}
                          onClick={() => this.changeActiveSubmenu('VESSELS')}
                        />
                        <MenuLink
                          title="Layers"
                          icon={this.renderIcon('layers')}
                          onClick={() => this.changeActiveSubmenu('LAYERS')}
                        />
                        <MenuLink
                          title="Filters"
                          icon={this.renderIcon('filters')}
                          onClick={() => this.changeActiveSubmenu('FILTERS')}
                        />
                        {/* <MenuLink
                          title="Area of interest"
                          icon={this.renderIcon('filters')}
                          onClick={() => this.changeActiveSubmenu('AREAS')}
                        /> */}
                      </div >
                      <VesselInfoPanel />
                    </div >
                  }
                </div >
              </div >
            )}
          </Transition>
        )}
      </MediaQuery >
    );
  }
}

ControlPanel.propTypes = {
  activeSubmenu: PropTypes.string,
  chartData: PropTypes.array,
  disableLayerPanelEditMode: PropTypes.func,
  disableSearchEditMode: PropTypes.func,
  hideSearchResults: PropTypes.func,
  isEmbedded: PropTypes.bool,
  isReportStarted: PropTypes.bool,
  layerPanelEditMode: PropTypes.bool,
  layers: PropTypes.array,
  login: PropTypes.func,
  openTimebarInfoModal: PropTypes.func,
  pinnedVesselEditMode: PropTypes.bool,
  setDrawingMode: PropTypes.func,
  setRecentlyCreated: PropTypes.func.isRequired,
  setSubmenu: PropTypes.func.isRequired,
  timelineInnerExtent: PropTypes.array,
  userPermissions: PropTypes.array,
  vessels: PropTypes.array,
  isDrawing: PropTypes.bool
};

export default ControlPanel;
