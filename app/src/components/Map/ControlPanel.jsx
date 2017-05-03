import React, { Component } from 'react';
import classnames from 'classnames';
import MediaQuery from 'react-responsive';
import { Accordion, AccordionItem } from 'react-sanfona';
import FilterPanel from 'containers/Map/FilterPanel';
import BasemapPanel from 'containers/Map/BasemapPanel';
import LayerPanel from 'containers/Map/LayerPanel';
import LayerManagement from 'containers/Map/LayerManagement';
import SearchPanel from 'containers/Map/SearchPanel';
import VesselInfoPanel from 'containers/Map/VesselInfoPanel';
import controlPanelStyle from 'styles/components/c-control_panel.scss';
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
          <div className={classnames(controlPanelStyle['accordion-header'], controlPanelStyle['-search'])} >
            <SearchIcon className={classnames(iconStyles.icons, controlPanelStyle['search-icon'])} />
            <div className={controlPanelStyle['header-search-info']} >
              <h2 className={controlPanelStyle['accordion-title']} >vessels</h2>
              {numPinnedVessels > 0 &&
              <div className={controlPanelStyle['pinned-item-count']} >
                ({numPinnedVessels})
              </div>}
            </div>
          </div>
        </MediaQuery>
        <MediaQuery minWidth={768} >
          <div className={controlPanelStyle['accordion-header']} >
            <h2 className={controlPanelStyle['accordion-title']} >vessels</h2>
            {numPinnedVessels > 0 &&
            <div className={controlPanelStyle['pinned-item-count']} >
              {numPinnedVessels} pinned
            </div>}
            <SearchIcon className={classnames(iconStyles.icons, controlPanelStyle['search-icon'])} />
          </div>
        </MediaQuery>
      </div>);


    if (this.props.userPermissions !== null && this.props.userPermissions.indexOf('search') === -1) {
      return (
        <AccordionItem
          title={title}
          key="search"
          className={controlPanelStyle['accordion-item']}
        >
          <div className={controlPanelStyle['content-accordion']} >
            <a
              className="login-required-link"
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
        className={controlPanelStyle['accordion-item']}
        onClose={() => this.onCloseSearch()}
      >
        <div className={controlPanelStyle['content-accordion']} >
          <SearchPanel />
          <PinnedTracks />
        </div>
      </AccordionItem>);
  }

  renderBasemap() {
    const title = (
      <div className={controlPanelStyle['accordion-header']} >
        <h2 className={controlPanelStyle['accordion-title']} >Basemap</h2>
        <BasemapIcon className={classnames(iconStyles.icons, controlPanelStyle['basemap-icon'])} />
      </div>);

    return (
      <AccordionItem
        title={title}
        key="basemap"
        className={controlPanelStyle['accordion-item']}
        titleClassName={controlPanelStyle['title-accordion']}
      >
        <div className={classnames(controlPanelStyle['content-accordion'], controlPanelStyle['-basemaps'])} >
          <BasemapPanel />
        </div>
      </AccordionItem>);
  }

  renderLayerPicker() {
    const title = (
      <div className={controlPanelStyle['accordion-header']} >
        <h2 className={controlPanelStyle['accordion-title']} >Layers</h2>
        <LayersIcon className={classnames(iconStyles.icons, controlPanelStyle['layers-icon'])} />
      </div>);

    return (
      <AccordionItem
        title={title}
        key="layers"
        className={controlPanelStyle['accordion-item']}
        titleClassName={controlPanelStyle['title-accordion']}
        onClose={() => this.onCloseLayerPicker()}
      >
        <div className={classnames(controlPanelStyle['content-accordion'], controlPanelStyle['-layers'])} >
          <div className={controlPanelStyle.wrapper} >
            <LayerPanel />
            <LayerManagement />
          </div>
        </div>
      </AccordionItem>);
  }

  renderResume() {
    return (
      <div className={controlPanelStyle['resume-display']} >
        <div className={controlPanelStyle['categories-display']} >
          <div className={controlPanelStyle['vessel-display']} >
            <span className={controlPanelStyle['counter-description']} >
              Worldwide Fishing hours
              <InfoIcon className={controlPanelStyle['fishing-hours']} onClick={() => this.props.openTimebarInfoModal()} />
            </span>
            <span className={controlPanelStyle.total} >{this.calculateFishingHours()}</span>
          </div>
        </div>
      </div>
    );
  }

  renderFilters() {
    const title = (
      <div className={controlPanelStyle['accordion-header']} >
        <h2 className={controlPanelStyle['accordion-title']} >Flag Filter</h2>
        <FiltersIcon className={classnames(iconStyles.icons, controlPanelStyle['filters-icon'])} />
      </div>);

    return (
      <AccordionItem
        title={title}
        key="filters"
        className={controlPanelStyle['accordion-item']}
        titleClassName={controlPanelStyle['title-accordion']}
      >
        <div className={controlPanelStyle['content-accordion']} >
          <FilterPanel />
        </div>
      </AccordionItem>);
  }

  render() {
    return (
      <MediaQuery minWidth={768} >
        {matches => (
          <div
            className={controlPanelStyle.controlpanel}
            ref={(controlPanel) => { this.controlPanelRef = controlPanel; }}
          >
            <div className={classnames({ [controlPanelStyle['bg-wrapper']]: matches })} >
              {this.renderResume()}
              <VesselInfoPanel />
              <Accordion
                activeItems={6}
                allowMultiple={false}
                className={classnames(controlPanelStyle['map-options'], {
                  [controlPanelStyle['-no-footer']]: (!COMPLETE_MAP_RENDER && !matches)
                })}
              >
                {this.renderSearch()}
                {this.renderBasemap()}
                {this.renderLayerPicker()}
                {this.renderFilters()}
              </Accordion>
            </div>
          </div>)
        }
      </MediaQuery>
    );
  }
}

ControlPanel.propTypes = {
  login: React.PropTypes.func,
  layers: React.PropTypes.array,
  vessels: React.PropTypes.array,
  chartData: React.PropTypes.array,
  userPermissions: React.PropTypes.array,
  disableSearchEditMode: React.PropTypes.func,
  disableLayerPanelEditMode: React.PropTypes.func,
  hideSearchResults: React.PropTypes.func,
  pinnedVesselEditMode: React.PropTypes.bool,
  layerPanelEditMode: React.PropTypes.bool,
  timelineInnerExtent: React.PropTypes.array,
  isEmbedded: React.PropTypes.bool,
  isReportStarted: React.PropTypes.bool,
  openTimebarInfoModal: React.PropTypes.func
};

export default ControlPanel;
