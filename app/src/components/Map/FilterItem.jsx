import React, { Component } from 'react';
import LayerBlendingOptionsTooltip from 'components/Map/LayerBlendingOptionsTooltip';
import classnames from 'classnames';
import { REVERSE_TOOLTIP_FILTERS_MOBILE } from 'constants';

import flagFilterStyles from 'styles/components/map/c-flag-filters.scss';
import IconStyles from 'styles/icons.scss';
import selectorStyles from 'styles/components/shared/c-selector.scss';

import BlendingIcon from 'babel!svg-react!assets/icons/blending-icon.svg?name=BlendingIcon';
import RemoveFilterIcon from 'babel!svg-react!assets/icons/delete-cross-icon.svg?name=RemoveFilterIcon';

class FilterItem extends Component {
  toggleBlending() {
    this.props.onLayerBlendingToggled(this.props.index);
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
    const hueValue = this.props.filter.hue;

    return (
      <li
        className={flagFilterStyles['filter-item']}
        key={this.props.index}
      >
        <div className={selectorStyles['c-selector']}>
          <select
            name="country"
            onChange={e => this.onChangeCountry(e.target.value)}
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
                className={classnames(IconStyles.icon, IconStyles['blending-icon'],
                  flagFilterStyles['icon-blending'],
                { [`${IconStyles['-white']}`]: this.props.showBlending === true })}
                onClick={() => this.toggleBlending()}
              />
              {this.props.showBlending &&
              <LayerBlendingOptionsTooltip
                displayHue
                hueValue={hueValue}
                onChangeHue={hue => this.onChangeHue(hue)}
                isReverse={this.props.index < REVERSE_TOOLTIP_FILTERS_MOBILE}
              />
              }
            </li>
            <li className={flagFilterStyles['filter-option-item']}>
              <RemoveFilterIcon
                className={classnames(IconStyles.icon, IconStyles['delete-cross-icon'], flagFilterStyles['icon-delete-cross'])}
                onClick={() => this.onRemoveFilter()}
              />
            </li>
          </ul>
        </div>
      </li>
    );
  }
}

FilterItem.propTypes = {
  countryOptions: React.PropTypes.array,
  index: React.PropTypes.number,
  filter: React.PropTypes.object,
  showBlending: React.PropTypes.bool,
  removeFilter: React.PropTypes.func,
  updateFilters: React.PropTypes.func,
  onLayerBlendingToggled: React.PropTypes.func
};

export default FilterItem;
