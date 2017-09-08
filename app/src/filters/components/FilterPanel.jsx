/* eslint-disable react/no-array-index-key */

/** @deprecated use filterGroups logic instead */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import FilterItem from 'filters/components/FilterItem';
import { FLAG_FILTERS_LIMIT } from 'config';
import classnames from 'classnames';
import flagFilterStyles from 'styles/components/map/flag-filters.scss';
import MapButtonStyles from 'styles/components/button.scss';
import getCountryOptions from 'util/getCountryOptions';

class FilterPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { currentBlendingOptionsShown: -1 };
  }

  componentWillMount() {
    this.countryOptions = getCountryOptions();
  }

  updateFilters(filter, index) {
    const updatedFilters = cloneDeep(this.props.flags);
    if (!updatedFilters[index]) return;

    updatedFilters[index] = Object.assign({}, updatedFilters[index], filter);

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
      <div className={classnames(flagFilterStyles.flagFilters, flagFilterStyles.singleFilters)} >
        {filterSelectors &&
        <ul className={flagFilterStyles.filterList} >
          {filterSelectors}
        </ul >}
        {this.props.flags.length < FLAG_FILTERS_LIMIT &&
        <button
          className={classnames(MapButtonStyles.button, flagFilterStyles.filterButton)}
          onClick={() => this.addFilter()}
        >
          add filter
        </button >}
      </div >
    );
  }
}

FilterPanel.propTypes = {
  flags: PropTypes.array,
  setFlagFilters: PropTypes.func.isRequired
};

export default FilterPanel;
