import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import ListStyles from 'styles/components/map/item-list.scss';
import Toggle from 'components/Shared/Toggle';
import InfoIcon from '-!babel-loader!svg-react-loader!assets/icons/info-icon.svg?name=InfoIcon';

class FilterGroupItem extends Component {

  onChangeFilterGroupVisibility() {
    // TODO: hide quick edits and such

    this.props.toggleFilterGroupVisibility(this.props.index);
  }

  render() {
    const actionIcons = (
      <ul className={ListStyles.itemOptionList} >
        <li
          className={ListStyles.itemOptionItem}
          onClick={() => this.onClickInfo()}
        >
          <InfoIcon />
        </li >
      </ul >
    );

    return (
      <li
        className={ListStyles.listItem}
      >
        <Toggle
          on={this.props.filterGroup.visible}
          color={this.props.filterGroup.color}
          onToggled={() => this.onChangeFilterGroupVisibility()}
        />
        <input
          className={classnames(ListStyles.itemName, { [ListStyles.itemRename]: this.props.isFilterGroupQuickEditMode })}
          onChange={e => this.onChangeLayerLabel(e.currentTarget.value)}
          readOnly={!this.props.isFilterGroupQuickEditMode}
          value={this.props.filterGroup.label}
          ref={((elem) => {
            this.inputName = elem;
          })}
        />
        {actionIcons}
      </li >
    );
  }
}

FilterGroupItem.propTypes = {
  index: PropTypes.number,
  filterGroup: PropTypes.object,
  isFilterGroupQuickEditMode: PropTypes.bool, // if currently editing this filter group
  toggleFilterGroupVisibility: PropTypes.func
};

FilterGroupItem.defaultProps = {
  isFilterGroupQuickEditMode: false
};

export default FilterGroupItem;
