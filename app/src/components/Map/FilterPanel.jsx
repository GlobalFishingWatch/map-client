import React, { Component } from 'react';
import _ from 'lodash';
import LayerOptionsTooltip from 'components/Map/LayerOptionsTooltip';
import { FLAG_FILTERS_LIMIT, FLAGS } from 'constants';
import iso3311a2 from 'iso-3166-1-alpha-2';

import flagFilterStyles from 'styles/components/map/c-flag-filters.scss';
import selectorStyles from 'styles/components/shared/c-selector.scss';

import BlendingIcon from 'babel!svg-react!assets/icons/blending-icon.svg?name=BlendingIcon';
import RemoveFilterIcon from 'babel!svg-react!assets/icons/delete-cross-icon.svg?name=RemoveFilterIcon';

const defaultValues = {
  hue: 180
};

class FilterPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      indexToShow: -1
    };
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

  addFilter() {
    const currentFilters = this.props.flags;
    currentFilters.push({
      flag: 'ALL'
    });

    this.props.setFlagFilters(currentFilters);
  }

  removeFilter(index) {
    const filters = _.cloneDeep(this.props.flags);
    filters.splice(index, 1);

    this.props.setFlagFilters(filters);
  }

  onToggleBlending(index) {
    let indexToShow = index;
    if (indexToShow === this.state.indexToShow) {
      indexToShow = -1;
    }
    this.setState({ indexToShow });
  }

  onChangeHue(hue, index) {
    const filters = _.cloneDeep(this.props.flags);
    if (filters[index] === undefined) return;

    filters[index].hue = hue;

    this.props.setFlagFilters(filters);
  }

  onChange(country, index) {
    const filters = _.cloneDeep(this.props.flags);
    if (filters[index] === undefined) return;

    filters[index].flag = country;

    this.props.setFlagFilters(filters);
  }

  render() {
    const filterSelectors = [];
    this.props.flags.forEach((flagFilter, i) => {
      filterSelectors.push(
        <li
          className={flagFilterStyles['filter-item']}
          key={i}
        >
          <div className={selectorStyles['c-selector']}>
            <select
              name="country"
              onChange={(e) => this.onChange(e.target.value, i)}
              value={flagFilter.flag}
            >
              {this.countryOptions}
            </select>
          </div>
          <div className={flagFilterStyles['filter-option']}>
            <ul className={flagFilterStyles['filter-option-list']}>
              <li className={flagFilterStyles['filter-option-item']}>
                <BlendingIcon
                  className={flagFilterStyles['icon-blending']}
                  onClick={() => this.onToggleBlending(i)}
                />
              </li>
              <li className={flagFilterStyles['filter-option-item']}>
                <RemoveFilterIcon
                  className={flagFilterStyles['icon-delete-cross']}
                  onClick={() => this.removeFilter(i)}
                />
              </li>
            </ul>
          </div>
          <LayerOptionsTooltip
            displayHue
            hueValue={defaultValues.hue}
            onChangeHue={(hue, index) => this.onChangeHue(hue, index)}
            showBlending={this.state.indexToShow === i}
            index={i}
          />
        </li>
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
