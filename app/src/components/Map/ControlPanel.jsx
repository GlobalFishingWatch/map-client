import React, { Component } from 'react';
import classnames from 'classnames';
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

class ControlPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchVisible: false
    };
  }

  renderSearch() {
    const titleLiteral = window.innerWidth > 1024 ? 'search vessels' : 'search';

    const title = (
      <div className={controlPanelStyle['accordion-header']}>
        <h2 className={controlPanelStyle['accordion-title']}>{titleLiteral}</h2>
        <SearchIcon className={classnames(iconStyles.icons, controlPanelStyle['search-icon'])} />
      </div>);

    if (this.props.userPermissions.indexOf('search') === -1) {
      return (
        <AccordionItem
          title={title}
          key="search"
          className={controlPanelStyle['accordion-item']}
          onExpand={() => this.setState({ searchVisible: true })}
          onClose={() => this.setState({ searchVisible: false })}
        >
          <div className={controlPanelStyle['content-accordion']}>
            <a
              onClick={this.props.login}
            >Click here to login and see more details</a>
          </div>
        </AccordionItem>);
    }

    return (
      <AccordionItem
        title={title}
        key="search"
        className={controlPanelStyle['accordion-item']}
        onExpand={() => this.setState({ searchVisible: true })}
        onClose={() => this.setState({ searchVisible: false })}
      >
        <div className={controlPanelStyle['content-accordion']}>
          <SearchPanel visible={this.state.searchVisible} />
        </div>
      </AccordionItem>);
  }

  renderBasemap() {
    const title = (
      <div className={controlPanelStyle['accordion-header']}>
        <h2 className={controlPanelStyle['accordion-title']}>Basemap</h2>
        <BasemapIcon className={classnames(iconStyles.icons, controlPanelStyle['basemap-icon'])} />
      </div>);

    return (
      <AccordionItem
        title={title}
        key="basemap"
        className={controlPanelStyle['accordion-item']}
        titleClassName={controlPanelStyle['title-accordion']}
      >
        <div className={classnames(controlPanelStyle['content-accordion'], controlPanelStyle['-basemaps'])}>
          <BasemapPanel />
        </div>
      </AccordionItem>);
  }

  renderLayerPicker() {
    const title = (
      <div className={controlPanelStyle['accordion-header']}>
        <h2 className={controlPanelStyle['accordion-title']}>Layers</h2>
        <LayersIcon className={classnames(iconStyles.icons, controlPanelStyle['layers-icon'])} />
      </div>);

    return (
      <AccordionItem
        title={title}
        key="layers"
        className={controlPanelStyle['accordion-item']}
        titleClassName={controlPanelStyle['title-accordion']}

      >
        <div className={classnames(controlPanelStyle['content-accordion'], controlPanelStyle['-layers'])}>
          <LayerPanel />
          <LayerManagement />
        </div>
      </AccordionItem>);
  }

  renderResume() {
    return (
      <div className={controlPanelStyle['resume-display']}>
        <div className={controlPanelStyle['total-count']}>
          <span className={controlPanelStyle['counter-description']}>vessel activity</span>
          <span className={controlPanelStyle.total}>224,654</span>
        </div>
        <div className={controlPanelStyle['categories-display']}>
          <div className={controlPanelStyle['vessel-display']}>
            <span className={controlPanelStyle['counter-description']}>vessels</span>
            <span className={controlPanelStyle.total}>224,654</span>
          </div>
          <div className={controlPanelStyle['activity-display']}>
            <span className={controlPanelStyle['counter-description']}>activity</span>
            <span className={controlPanelStyle.total}>224,654</span>
          </div>
        </div>
      </div>
    );
  }

  renderFilters() {
    const title = (
      <div className={controlPanelStyle['accordion-header']}>
        <h2 className={controlPanelStyle['accordion-title']}>Filters</h2>
        <FiltersIcon className={classnames(iconStyles.icons, controlPanelStyle['filters-icon'])} />
      </div>);

    return (
      <AccordionItem
        title={title}
        key="filters"
        className={controlPanelStyle['accordion-item']}
        titleClassName={controlPanelStyle['title-accordion']}
      >
        <div className={controlPanelStyle['content-accordion']}>
          <FilterPanel />
        </div>
      </AccordionItem>);
  }

  render() {
    return (
      <div className={controlPanelStyle.controlpanel}>
        {this.renderResume()}
        <VesselInfoPanel />
        <Accordion
          activeItems={6}
          allowMultiple={false}
          className={controlPanelStyle['map-options']}
        >
          {this.renderSearch()}
          {this.renderBasemap()}
          {this.renderLayerPicker()}
          {this.renderFilters()}
        </Accordion>
      </div>
    );
  }
}

ControlPanel.propTypes = {
  toggleVisibility: React.PropTypes.func,
  login: React.PropTypes.func,
  layers: React.PropTypes.array,
  userPermissions: React.PropTypes.array
};

export default ControlPanel;
