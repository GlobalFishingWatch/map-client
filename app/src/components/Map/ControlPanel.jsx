import PropTypes from 'prop-types';
import React, { Component } from 'preact';
import classnames from 'classnames';
import MediaQuery from 'react-responsive';
import AreasPanel from 'containers/Map/AreasPanel';
import MenuLink from 'components/Map/MenuLink';
import SubMenu from 'components/Map/SubMenu';
import FilterPanel from 'containers/Map/FilterPanel';
import BasemapPanel from 'containers/Map/BasemapPanel';
import LayerPanel from 'containers/Map/LayerPanel';
import LayerManagement from 'containers/Map/LayerManagement';
import SearchPanel from 'containers/Map/SearchPanel';
import VesselInfoPanel from 'containers/Map/VesselInfoPanel';
import ControlPanelStyles from 'styles/components/control_panel.scss';
import iconStyles from 'styles/icons.scss';
import SearchIcon from 'babel!svg-react!assets/icons/search-icon.svg?name=SearchIcon';
import BasemapIcon from 'babel!svg-react!assets/icons/basemap-icon.svg?name=BasemapIcon';
import LayersIcon from 'babel!svg-react!assets/icons/layers-icon.svg?name=LayersIcon';
import FiltersIcon from 'babel!svg-react!assets/icons/filters-icon.svg?name=FiltersIcon';
import InfoIcon from 'babel!svg-react!assets/icons/info-icon.svg?name=InfoIcon';
import PinnedTracks from 'containers/Map/PinnedTracks';

class ControlPanel extends Component {
  constructor() {
    super();
    this.state = {
      activeSubMenu: null
    };
    this.changeActiveSubmenu = this.changeActiveSubmenu.bind(this);
    this.onBack = this.onBack.bind(this);
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
              Worldwide Fishing hours
              <InfoIcon className={ControlPanelStyles.fishingHours} onClick={() => this.props.openTimebarInfoModal()} />
            </span>
            <span className={ControlPanelStyles.total} >{this.calculateFishingHours()}</span>
          </div>
        </div>
      </div>
    );
  }

  changeActiveSubmenu(submenuName) {
    this.props.setSubmenu(submenuName);
  }

  onBack() {
    if (this.props.activeSubmenu === 'AREAS') this.props.setRecentlyCreated(false);
    this.props.setSubmenu(null);
  }

  render() {
    const { activeSubmenu } = this.props;
    const searchIcon = (
      <SearchIcon className={classnames(iconStyles.icons, ControlPanelStyles.searchIcon)} />
    );

    const basemapIcon = (
      <BasemapIcon className={classnames(iconStyles.icons, ControlPanelStyles.basemapIcon)} />
    );

    const filtersIcon = (
      <FiltersIcon className={classnames(iconStyles.icons, ControlPanelStyles.filtersIcon)} />
    );

    const layersIcon = (
      <LayersIcon className={classnames(iconStyles.icons, ControlPanelStyles.layersIcon)} />
    );

    const numPinnedVessels = this.props.vessels.filter(vessel => vessel.pinned === true).length;

    const searchHeader = (
      <div>
        <MediaQuery maxWidth={767} >
          {numPinnedVessels > 0 &&
          <div className={ControlPanelStyles.pinnedItemCount} >
            ({numPinnedVessels})
          </div>}
        </MediaQuery>
        <MediaQuery minWidth={768} >
          {numPinnedVessels > 0 &&
          <div className={ControlPanelStyles.pinnedItemCount} >
            {numPinnedVessels} pinned
          </div>}
        </MediaQuery>
      </div>);

    const searchSubmenu = (
      <SubMenu title="Vessels" icon={searchIcon} extraHeader={searchHeader} onBack={this.onBack}>
        <VesselInfoPanel />
        <div className={classnames(ControlPanelStyles.contentAccordion, ControlPanelStyles._layers)} >
          <div className={ControlPanelStyles.wrapper} >
            <div className={ControlPanelStyles.contentAccordion} >
              { this.props.userPermissions !== null && this.props.userPermissions.indexOf('search') === -1 ?
                <div className={ControlPanelStyles.contentAccordion} >
                  <a
                    className="loginRequiredLink"
                    onClick={this.props.login}
                  >Only registered users can use the search feature. Click here to log in.</a>
                  <PinnedTracks />
                </div> :
                <div className={ControlPanelStyles.contentAccordion} >
                  <SearchPanel />
                  <PinnedTracks />
                </div>
              }
            </div>
          </div>
        </div>
      </SubMenu>
    );

    const basemapSubmenu = (
      <SubMenu title="Basemap" icon={basemapIcon} onBack={this.onBack}>
        <div className={classnames(ControlPanelStyles.contentAccordion, ControlPanelStyles._layers)} >
          <div className={ControlPanelStyles.wrapper} >
            <BasemapPanel />
          </div>
        </div>
      </SubMenu>
    );

    const layerSubmenu = (
      <SubMenu title="Layers" icon={layersIcon} onBack={this.onBack}>
        <div className={classnames(ControlPanelStyles.contentAccordion, ControlPanelStyles._layers)} >
          <div className={ControlPanelStyles.wrapper} >
            <LayerPanel />
            <LayerManagement />
          </div>
        </div>
      </SubMenu>
    );

    const filterSubmenu = (
      <SubMenu title="Filters" icon={filtersIcon} onBack={this.onBack}>
        <div className={ControlPanelStyles.contentAccordion} >
          <FilterPanel />
        </div>
      </SubMenu>
    );

    const areaSubmenu = (
      <SubMenu title="Area of interest" icon={filtersIcon} onBack={this.onBack}>
        <div className={ControlPanelStyles.contentAccordion} >
          <AreasPanel />
        </div>
      </SubMenu>
    );

    const submenus = {
      AREAS: areaSubmenu,
      FILTERS: filterSubmenu,
      LAYERS: layerSubmenu,
      BASE_MAP: basemapSubmenu,
      VESSELS: searchSubmenu
    };

    return (
      <MediaQuery minWidth={768} >
        {matches => (
          <div
            className={ControlPanelStyles.controlpanel}
            ref={(controlPanel) => { this.controlPanelRef = controlPanel; }}
          >
            <div className={classnames({ [ControlPanelStyles.bgWrapper]: matches })}>
              { activeSubmenu ?
                submenus[activeSubmenu] :
                <div className={classnames(ControlPanelStyles.mapOptions, {
                  [ControlPanelStyles._noFooter]: (!COMPLETE_MAP_RENDER && !matches) })}
                >
                  {this.renderResume()}
                  <MenuLink title="Vessels" icon={searchIcon} onClick={() => this.changeActiveSubmenu('VESSELS')} />
                  <MenuLink title="Basemap" icon={basemapIcon} onClick={() => this.changeActiveSubmenu('BASE_MAP')} />
                  <MenuLink title="Layers" icon={layersIcon} onClick={() => this.changeActiveSubmenu('LAYERS')} />
                  <MenuLink title="Filters" icon={filtersIcon} onClick={() => this.changeActiveSubmenu('FILTERS')} />
                  <MenuLink title="Area of interest" icon={filtersIcon} onClick={() => this.changeActiveSubmenu('AREAS')} />
                </div>
              }
            </div>
          </div>
        )}
      </MediaQuery>
    );
  }
}

ControlPanel.propTypes = {
  login: PropTypes.func,
  layers: PropTypes.array,
  vessels: PropTypes.array,
  chartData: PropTypes.array,
  userPermissions: PropTypes.array,
  disableSearchEditMode: PropTypes.func,
  disableLayerPanelEditMode: PropTypes.func,
  hideSearchResults: PropTypes.func,
  setRecentlyCreated: PropTypes.func.isRequired,
  pinnedVesselEditMode: PropTypes.bool,
  layerPanelEditMode: PropTypes.bool,
  timelineInnerExtent: PropTypes.array,
  isEmbedded: PropTypes.bool,
  isReportStarted: PropTypes.bool,
  setSubmenu: PropTypes.func.isRequired,
  activeSubmenu: PropTypes.string.isRequired,
  openTimebarInfoModal: PropTypes.func
};

export default ControlPanel;
