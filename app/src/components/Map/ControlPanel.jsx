import PropTypes from 'prop-types';
import React, { Component } from 'preact';
import classnames from 'classnames';
import MediaQuery from 'react-responsive';
import { Accordion, AccordionItem } from 'react-sanfona';
import AreasPanel from 'containers/Map/AreasPanel';
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

  renderSearch() {
    const numPinnedVessels = this.props.vessels.filter(vessel => vessel.pinned === true).length;

    const title = (
      <div>
        <MediaQuery maxWidth={767} >
          <div className={classnames(ControlPanelStyles.accordionHeader, ControlPanelStyles._search)} >
            <SearchIcon className={classnames(iconStyles.icons, ControlPanelStyles.searchIcon)} />
            <div className={ControlPanelStyles.headerSearchInfo} >
              <h2 className={ControlPanelStyles.accordionTitle} >vessels</h2>
              {numPinnedVessels > 0 &&
              <div className={ControlPanelStyles.pinnedItemCount} >
                ({numPinnedVessels})
              </div>}
            </div>
          </div>
        </MediaQuery>
        <MediaQuery minWidth={768} >
          <div className={ControlPanelStyles.accordionHeader} >
            <h2 className={ControlPanelStyles.accordionTitle} >vessels</h2>
            {numPinnedVessels > 0 &&
            <div className={ControlPanelStyles.pinnedItemCount} >
              {numPinnedVessels} pinned
            </div>}
            <SearchIcon className={classnames(iconStyles.icons, ControlPanelStyles.searchIcon)} />
          </div>
        </MediaQuery>
      </div>);


    if (this.props.userPermissions !== null && this.props.userPermissions.indexOf('search') === -1) {
      return (
        <AccordionItem
          title={title}
          key="search"
          className={ControlPanelStyles.accordionItem}
        >
          <div className={ControlPanelStyles.contentAccordion} >
            <a
              className="loginRequiredLink"
              onClick={this.props.login}
            >Only registered users can use the search feature. Click here to log in.</a>
            <PinnedTracks />
          </div>
        </AccordionItem>);
    }

    return (
      <AccordionItem
        title={title}
        key="search"
        className={ControlPanelStyles.accordionItem}
        onClose={() => this.onCloseSearch()}
      >
        <div className={ControlPanelStyles.contentAccordion} >
          <SearchPanel />
          <PinnedTracks />
        </div>
      </AccordionItem>);
  }

  renderBasemap() {
    const title = (
      <div className={ControlPanelStyles.accordionHeader} >
        <h2 className={ControlPanelStyles.accordionTitle} >Basemap</h2>
        <BasemapIcon className={classnames(iconStyles.icons, ControlPanelStyles.basemapIcon)} />
      </div>);

    return (
      <AccordionItem
        title={title}
        key="basemap"
        className={ControlPanelStyles.accordionItem}
        titleClassName={ControlPanelStyles.titleAccordion}
      >
        <div className={classnames(ControlPanelStyles.contentAccordion, ControlPanelStyles._basemaps)} >
          <BasemapPanel />
        </div>
      </AccordionItem>);
  }

  renderLayerPicker() {
    const title = (
      <div className={ControlPanelStyles.accordionHeader} >
        <h2 className={ControlPanelStyles.accordionTitle} >Layers</h2>
        <LayersIcon className={classnames(iconStyles.icons, ControlPanelStyles.layersIcon)} />
      </div>);

    return (
      <AccordionItem
        title={title}
        key="layers"
        className={ControlPanelStyles.accordionItem}
        titleClassName={ControlPanelStyles.titleAccordion}
        onClose={() => this.onCloseLayerPicker()}
      >
        <div className={classnames(ControlPanelStyles.contentAccordion, ControlPanelStyles._layers)} >
          <div className={ControlPanelStyles.wrapper} >
            <LayerPanel />
            <LayerManagement />
          </div>
        </div>
      </AccordionItem>);
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

  renderFilters() {
    const title = (
      <div className={ControlPanelStyles.accordionHeader} >
        <h2 className={ControlPanelStyles.accordionTitle} >Flag Filter</h2>
        <FiltersIcon className={classnames(iconStyles.icons, ControlPanelStyles.filtersIcon)} />
      </div>);

    return (
      <AccordionItem
        title={title}
        key="filters"
        className={ControlPanelStyles.accordionItem}
        titleClassName={ControlPanelStyles.titleAccordion}
      >
        <div className={ControlPanelStyles.contentAccordion} >
          <FilterPanel />
        </div>
      </AccordionItem>);
  }

  renderAreas() {
    const title = (
      <div className={ControlPanelStyles.accordionHeader} >
        <h2 className={ControlPanelStyles.accordionTitle} >Area of interest</h2>
        <FiltersIcon className={classnames(iconStyles.icons, ControlPanelStyles.filtersIcon)} />
      </div>);

    return (
      <AccordionItem
        title={title}
        key="Areas"
        className={ControlPanelStyles.accordionItem}
        titleClassName={ControlPanelStyles.titleAccordion}
      >
        <div className={ControlPanelStyles.contentAccordion} >
          <AreasPanel />
        </div>
      </AccordionItem>);
  }

  render() {
    return (
      <MediaQuery minWidth={768} >
        {matches => (
          <div
            className={ControlPanelStyles.controlpanel}
            ref={(controlPanel) => { this.controlPanelRef = controlPanel; }}
          >
            <div className={classnames({ [ControlPanelStyles.bgWrapper]: matches })} >
              {this.renderResume()}
              <VesselInfoPanel />
              <Accordion
                activeItems={6}
                allowMultiple={false}
                className={classnames(ControlPanelStyles.mapOptions, {
                  [ControlPanelStyles._noFooter]: (!COMPLETE_MAP_RENDER && !matches)
                })}
              >
                {this.renderSearch()}
                {this.renderBasemap()}
                {this.renderLayerPicker()}
                {this.renderFilters()}
                {this.renderAreas()}
              </Accordion>
            </div>
          </div>)
        }
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
  pinnedVesselEditMode: PropTypes.bool,
  layerPanelEditMode: PropTypes.bool,
  timelineInnerExtent: PropTypes.array,
  isEmbedded: PropTypes.bool,
  isReportStarted: PropTypes.bool,
  openTimebarInfoModal: PropTypes.func
};

export default ControlPanel;
