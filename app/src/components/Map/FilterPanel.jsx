import React, { Component } from 'react';
import filtersPanel from '../../../styles/components/c-filter-panel.scss';
import { FLAGS } from '../../constants';
import iso3311a2 from 'iso-3166-1-alpha-2';

class FilterPanel extends Component {

  constructor(props) {
    super(props);

    this.countryNames = [];
    Object.keys(FLAGS).forEach((index) => {
      if (iso3311a2.getCountry(FLAGS[index])) {
        this.countryNames.push({
          name: iso3311a2.getCountry(FLAGS[index]),
          id: index
        });
      }
    });

    this.countryNames.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    this.updateFilters = this.props.updateFilters.bind(this);
  }

  render() {
    let countries = Object.keys(this.countryNames).map((index) =>
      <option
        value={this.countryNames[index].id}
        key={this.countryNames[index].id}
      >
        {this.countryNames[index].name}
      </option>
    );

    return (
      <div className={filtersPanel.filtersPanel}>
        <select id="ISOfilter" onChange={(e) => this.updateFilters({ flag: e.target.value })} defaultValue="">
          <option value="" key={-1}>Vessel flag (ISO code)</option>
          {countries}
        </select>
      </div>
    );
  }
}

FilterPanel.propTypes = {
  updateFilters: React.PropTypes.func
};

export default FilterPanel;
