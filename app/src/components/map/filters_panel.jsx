import React, { Component } from 'react';
import filtersPanel from '../../../styles/components/c_filter_panel.scss';
import { FLAGS } from '../../constants';

class FilterPanel extends Component {

  render() {
    let countries = Object.keys(FLAGS).map((index) =>
      <option value={index} key={index}>{FLAGS[index]}</option>
    );

    return (
      <div className={filtersPanel.filtersPanel}>
        <select id="ISOfilter" onChange={(e) => this.props.onChange('flag', e.target.value)} defaultValue={0}>
          <option value="" key={0}>Vessel flag (ISO code)</option>
          {countries}
        </select>
      </div>
    );
  }
}

FilterPanel.propTypes = {
  onChange: React.PropTypes.func
};

export default FilterPanel;
