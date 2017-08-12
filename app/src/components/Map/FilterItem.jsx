import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LayerBlendingOptionsTooltip from 'components/Map/LayerBlendingOptionsTooltip';
import classnames from 'classnames';
import { REVERSE_TOOLTIP_FILTERS_MOBILE, DEFAULT_FILTER_HUE } from 'constants';
import flagFilterStyles from 'styles/components/map/flag-filters.scss';
import IconStyles from 'styles/icons.scss';
import selectorStyles from 'styles/components/shared/selector.scss';

import RemoveFilterIcon from 'babel!svg-react!assets/icons/delete-cross-icon.svg?name=RemoveFilterIcon';

class FilterItem extends Component {

  toggleBlending() {
    this.props.onLayerBlendingToggled(this.props.index);
  }

  onChangeHue(hue) {
    this.props.updateFilters({ hue }, this.props.index);
  }

  onChangeCountry(flag) {
    this.props.updateFilters({ flag: flag || undefined }, this.props.index);
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
    const hueValue = this.props.filter.hue || DEFAULT_FILTER_HUE;

    return (
      <li
        className={flagFilterStyles.filterItem}
        key={this.props.index}
      >
        <div className={selectorStyles.selector} >
          <select
            name="country"
            onChange={e => this.onChangeCountry(e.target.value)}
            value={this.props.filter.flag}
            ref={(selector) => {
              this.selector = selector;
            }}
          >
            {this.props.countryOptions}
          </select >
        </div >
        <div className={flagFilterStyles.filterOption} >
          <ul className={flagFilterStyles.filterOptionList} >
            <li className={flagFilterStyles.filterOptionItem} >
              <LayerBlendingOptionsTooltip
                displayHue
                hueValue={hueValue}
                onChangeHue={hue => this.onChangeHue(hue)}
                isReverse={this.props.index < REVERSE_TOOLTIP_FILTERS_MOBILE}
                visible={this.props.showBlending}
                toggleVisibility={() => this.toggleBlending()}
              />
            </li >
            <li className={flagFilterStyles.filterOptionItem} >
              <RemoveFilterIcon
                className={classnames(IconStyles.icon, IconStyles.deleteCrossIcon, flagFilterStyles.iconDeleteCross)}
                onClick={() => this.onRemoveFilter()}
              />
            </li >
          </ul >
        </div >
      </li >
    );
  }
}

FilterItem.propTypes = {
  countryOptions: PropTypes.array,
  index: PropTypes.number,
  filter: PropTypes.object,
  showBlending: PropTypes.bool,
  removeFilter: PropTypes.func,
  updateFilters: PropTypes.func,
  onLayerBlendingToggled: PropTypes.func
};

export default FilterItem;
