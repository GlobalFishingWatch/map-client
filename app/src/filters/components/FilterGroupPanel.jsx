/* eslint-disable react/no-array-index-key */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import platform from 'platform';
import FilterGroupItem from 'filters/containers/FilterGroupItem';
import { FLAGS, FLAGS_SHORTCODES, FLAGS_LANDLOCKED } from 'constants';
import iso3311a2 from 'iso-3166-1-alpha-2';
import classnames from 'classnames';
import flagFilterStyles from 'styles/components/map/flag-filters.scss';
import buttonStyles from 'styles/components/map/button.scss';

class FilterGroupPanel extends Component {
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

    countryOptions.push(<option key="" value="" >All countries</option >);

    const supportsEmojiFlags =
      ['iOS', 'OS X'].indexOf(platform.os.family) > -1 ||
      platform.os.toString().match('Windows 10');

    countryNames.forEach((country) => {
      const label = (supportsEmojiFlags) ? `${country.name} ${country.icon}` : country.name;
      countryOptions.push(<option key={country.id} value={country.id} >{label}</option >);
    });

    return countryOptions;
  }

  updateFilters(filter, index) {
    const updatedFilters = cloneDeep(this.props.filterGroups);
    if (!updatedFilters[index]) return;

    updatedFilters[index] = Object.assign({}, updatedFilters[index], filter);

    // this.props.setFlagFilters(updatedFilters);

    if (filter.hue === undefined) {
      this.hideBlending();
    }
  }

  addFilterGroup() {
    this.hideBlending(); // TODO: replace with logic to hide quick edits and such
    this.props.createFilterGroup();
  }

  removeFilter(index) {
    const filters = cloneDeep(this.props.filterGroups);
    filters.splice(index, 1);

    // this.props.setFlagFilters(filters);
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
    this.props.filterGroups.forEach((filterGroup, i) => {
      filterSelectors.push(
        <FilterGroupItem
          index={i}
          key={i}
          filterGroup={filterGroup}
        />
      );
    });

    return (
      <div className={flagFilterStyles.flagFilters} >
        {filterSelectors &&
        <ul>
          {filterSelectors}
        </ul >}
        <button
          className={classnames(buttonStyles.button, buttonStyles._wide, buttonStyles._filled, buttonStyles._big)}
          onClick={() => this.addFilterGroup()}
        >
          Create Filter Group
        </button >
      </div >
    );
  }
}

FilterGroupPanel.propTypes = {
  filterGroups: PropTypes.array,
  createFilterGroup: PropTypes.func
};

export default FilterGroupPanel;
