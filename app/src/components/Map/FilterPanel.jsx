/* eslint-disable react/no-array-index-key */

import React, { Component } from 'react';
import { cloneDeep } from 'lodash';
import platform from 'platform';
import FilterItem from 'components/Map/FilterItem';
import { FLAG_FILTERS_LIMIT, FLAGS, FLAGS_SHORTCODES, FLAGS_LANDLOCKED } from 'constants';
import iso3311a2 from 'iso-3166-1-alpha-2';
import classnames from 'classnames';

import flagFilterStyles from 'styles/components/map/c-flag-filters.scss';
import MapButtonStyles from 'styles/components/map/c-button.scss';

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

    Object.keys(FLAGS)
      .filter(key => FLAGS_LANDLOCKED.indexOf(FLAGS[key]) === -1)
      .forEach((index) => {
        if (iso3311a2.getCountry(FLAGS[index])) {
          const countryCode = FLAGS[index];
          const iconAsciiCodePoints = FLAGS_SHORTCODES[countryCode.toLowerCase()];
          countryNames.push({
            name: iso3311a2.getCountry(countryCode),
            icon: String.fromCodePoint.apply(null, iconAsciiCodePoints),
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

    const supportsEmojiFlags =
      ['iOS', 'OS X'].indexOf(platform.os.family) > -1 ||
      platform.os.toString().match('Windows 10');

    countryNames.forEach((country) => {
      const label = (supportsEmojiFlags) ? `${country.name} ${country.icon}` : country.name;
      countryOptions.push(<option key={country.id} value={country.id}>{label}</option>);
    });

    return countryOptions;
  }

  updateFilters(filter, index) {
    const updatedFilters = cloneDeep(this.props.flags);
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
    const filters = cloneDeep(this.props.flags);
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
          removeFilter={index => this.removeFilter(index)}
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
            className={classnames(MapButtonStyles['c-button'], flagFilterStyles['filter-button'])}
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
