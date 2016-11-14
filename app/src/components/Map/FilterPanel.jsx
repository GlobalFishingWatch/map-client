import React, { Component } from 'react';
import selectorStyles from '../../../styles/components/shared/c-selector.scss';

import { FLAGS } from '../../constants';
import iso3311a2 from 'iso-3166-1-alpha-2';

class FilterPanel extends Component {

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

    countryNames.forEach((country) => {
      countryOptions.push(<option key={country.id} value={country.id}>{country.name}</option>);
    });

    return countryOptions;
  }

  render() {
    return (
      <div className={selectorStyles['c-selector']}>
        <select
          name="country"
          onChange={(e) => this.props.updateFilters({ flag: e.target.value })}
          defaultValue=""
        >
          {this.countryOptions}
        </select>
      </div>
    );
  }
}

FilterPanel.propTypes = {
  updateFilters: React.PropTypes.func
};

export default FilterPanel;
