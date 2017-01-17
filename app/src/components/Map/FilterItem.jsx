import React, { Component } from 'react';
import LayerOptionsTooltip from 'components/Map/LayerOptionsTooltip';

import flagFilterStyles from 'styles/components/map/c-flag-filters.scss';
import selectorStyles from 'styles/components/shared/c-selector.scss';

import BlendingIcon from 'babel!svg-react!assets/icons/blending-icon.svg?name=BlendingIcon';
import RemoveFilterIcon from 'babel!svg-react!assets/icons/delete-cross-icon.svg?name=RemoveFilterIcon';

const defaultValues = {
  hue: 180
};

class FilterItem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      indexToShow: -1
    };
  }

  onToggleBlending() {
    let indexToShow = this.props.index;
    if (indexToShow === this.state.indexToShow) {
      indexToShow = -1;
    }
    this.setState({ indexToShow });
  }

  onChangeHue(hue) {
    const filter = {};

    filter.hue = hue;

    this.props.updateFilters(filter, this.props.index);
  }

  onChangeCountry(country) {
    const filter = {};

    filter.flag = country;

    this.props.updateFilters(filter, this.props.index);
  }

  onRemoveFilter() {
    // if the user tries to remove the first selector with a selected value
    // automatically the selector will change to the default one ("all countries")
    if (this.props.index === 0 && this.selector.value !== '') {
      this.selector.value = '';
    }

    this.props.removeFilter(this.props.index);
  }

  render() {
    const hueValue = this.props.filter.hue || defaultValues.hue;

    return (
      <li
        className={flagFilterStyles['filter-item']}
        key={this.props.index}
      >
        <div className={selectorStyles['c-selector']}>
          <select
            name="country"
            onChange={(e) => this.onChangeCountry(e.target.value)}
            value={this.props.filter.flag}
            ref={(selector) => { this.selector = selector; }}
          >
            {this.props.countryOptions}
          </select>
        </div>
        <div className={flagFilterStyles['filter-option']}>
          <ul className={flagFilterStyles['filter-option-list']}>
            <li className={flagFilterStyles['filter-option-item']}>
              <BlendingIcon
                className={flagFilterStyles['icon-blending']}
                onClick={() => this.onToggleBlending()}
              />
            </li>
            <li className={flagFilterStyles['filter-option-item']}>
              <RemoveFilterIcon
                className={flagFilterStyles['icon-delete-cross']}
                onClick={() => this.onRemoveFilter()}
              />
            </li>
          </ul>
        </div>
        <LayerOptionsTooltip
          displayHue
          hueValue={hueValue}
          onChangeHue={(hue) => this.onChangeHue(hue)}
          showBlending={this.state.indexToShow === this.props.index}
        />
      </li>
    );
  }
}

FilterItem.propTypes = {
  countryOptions: React.PropTypes.array,
  index: React.PropTypes.number,
  filter: React.PropTypes.object,
  removeFilter: React.PropTypes.func,
  updateFilters: React.PropTypes.func
};

export default FilterItem;
