import React, { Component } from 'react';
import _ from 'lodash';
import FilterItem from 'components/Map/FilterItem';
import { FLAG_FILTERS_LIMIT, FLAGS } from 'constants';
import iso3311a2 from 'iso-3166-1-alpha-2';

import flagFilterStyles from 'styles/components/map/c-flag-filters.scss';


class FilterPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { currentBlendingOptionsShown: -1 };
  }

  componentWillMount() {
    this.countryOptions = this.getCountryOptions();
  }

  getCountryOptions() {
    const countryNames = [];
    const countryOptions = [];

    Object.keys(FLAGS).forEach((index) => {
      if (iso3311a2.getCountry(FLAGS[index])) {
        countryNames.push({
          name: iso3311a2.getCountry(FLAGS[index]),
          id: index
        });
      }
    });

    countryNames.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }

      if (b.name > a.name) {
        return -1;
      }

      return 0;
    });

    countryOptions.push(<option key="" value="">All countries</option>);

    countryNames.forEach((country) => {
      countryOptions.push(<option key={country.id} value={country.id}>{country.name}</option>);
    });

    return countryOptions;
  }

  updateFilters(filter, index) {
    const updatedFilters = _.cloneDeep(this.props.flags);
    if (!updatedFilters[index]) return;

    Object.assign(updatedFilters[index], filter);

    this.props.setFlagFilters(updatedFilters);

    if (filter.hue === undefined) {
      this.hideBlending();
    }
  }

  addFilter() {
    const currentFilters = this.props.flags;
    currentFilters.push({});

    this.props.setFlagFilters(currentFilters);
    this.hideBlending();
  }

  removeFilter(index) {
    const filters = _.cloneDeep(this.props.flags);
    filters.splice(index, 1);

    this.props.setFlagFilters(filters);
    this.hideBlending();
  }

  onLayerBlendingToggled(layerIndex) {
    let currentBlendingOptionsShown = layerIndex;
    if (currentBlendingOptionsShown === this.state.currentBlendingOptionsShown) {
      currentBlendingOptionsShown = -1;
    }
    this.setState({ currentBlendingOptionsShown });
  }

  hideBlending() {
    this.setState({ currentBlendingOptionsShown: -1 });
  }

  render() {
    const filterSelectors = [];
    this.props.flags.forEach((flagFilter, i) => {
      filterSelectors.push(
        <FilterItem
          countryOptions={this.countryOptions}
          index={i}
          key={i}
          filter={flagFilter}
          removeFilter={() => this.removeFilter()}
          updateFilters={(filter, index) => this.updateFilters(filter, index)}
          onLayerBlendingToggled={layerIndex => this.onLayerBlendingToggled(layerIndex)}
          showBlending={this.state.currentBlendingOptionsShown === i}
        />
      );
    });

    return (
      <div className={flagFilterStyles['c-flag-filters']}>
        {filterSelectors &&
          <ul className={flagFilterStyles['filter-list']}>
            {filterSelectors}
          </ul>}
        {this.props.flags.length < FLAG_FILTERS_LIMIT &&
          <button
            className={flagFilterStyles['filter-button']}
            onClick={() => this.addFilter()}
          >
            add filter
          </button>}
      </div>
    );
  }
}

FilterPanel.propTypes = {
  flags: React.PropTypes.array,
  setFlagFilters: React.PropTypes.func
};

export default FilterPanel;
