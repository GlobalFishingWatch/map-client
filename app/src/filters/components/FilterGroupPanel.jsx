/* eslint-disable react/no-array-index-key */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FilterGroupItem from 'filters/containers/FilterGroupItem';
import classnames from 'classnames';
import flagFilterStyles from 'styles/components/map/flag-filters.scss';
import buttonStyles from 'styles/components/button.scss';

class FilterGroupPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { currentBlendingOptionsShown: -1 };
  }

  addFilterGroup() {
    this.hideBlending(); // TODO: replace with logic to hide quick edits and such
    this.props.createFilterGroup();
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
      <div className={flagFilterStyles.flagFilters}>
        {filterSelectors &&
        <ul className={flagFilterStyles.filtersList}>
          {filterSelectors}
        </ul>}
        <button
          className={classnames(buttonStyles.button, buttonStyles._wide, buttonStyles._filled, buttonStyles._big)}
          onClick={() => this.addFilterGroup()}
        >
          Create Filter
        </button >
      </div >
    );
  }
}

FilterGroupPanel.propTypes = {
  filterGroups: PropTypes.array.isRequired,
  createFilterGroup: PropTypes.func
};

export default FilterGroupPanel;
