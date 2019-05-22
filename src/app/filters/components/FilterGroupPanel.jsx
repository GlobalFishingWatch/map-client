/* eslint-disable react/no-array-index-key */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FilterGroupItem from 'app/filters/containers/FilterGroupItem'
import classnames from 'classnames'
import flagFilterStyles from 'styles/components/map/flag-filters.module.scss'
import buttonStyles from 'styles/components/button.module.scss'
import ListStyles from 'styles/components/map/item-list.module.scss'

class FilterGroupPanel extends Component {
  constructor(props) {
    super(props)
    this.state = { currentBlendingOptionsShown: -1 }
  }

  addFilterGroup() {
    this.hideBlending() // TODO: replace with logic to hide quick edits and such
    this.props.createFilterGroup()
  }

  hideBlending() {
    this.setState({ currentBlendingOptionsShown: -1 })
  }

  render() {
    let filterGroupContent
    if (this.props.filterGroups.length) {
      const filterSelectors = this.props.filterGroups.map((filterGroup, i) => (
        <FilterGroupItem index={i} key={i} filterGroup={filterGroup} />
      ))
      filterGroupContent = <ul className={flagFilterStyles.filtersList}>{filterSelectors}</ul>
    } else {
      filterGroupContent = (
        <ul className={flagFilterStyles.noFiltersMessage}>
          <li
            className={classnames(
              ListStyles.listItem,
              ListStyles._noMobilePadding,
              ListStyles._fixed,
              ListStyles._alignLeft
            )}
          >
            No filters created yet.
          </li>
        </ul>
      )
    }

    return (
      <div className={flagFilterStyles.flagFilters}>
        {filterGroupContent}
        <button
          className={classnames(buttonStyles.button, buttonStyles._wide)}
          onClick={() => this.addFilterGroup()}
        >
          Create Filter
        </button>
      </div>
    )
  }
}

FilterGroupPanel.propTypes = {
  filterGroups: PropTypes.array.isRequired,
  createFilterGroup: PropTypes.func,
}

export default FilterGroupPanel
