import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classnames from 'classnames'
import ListStyles from 'styles/components/map/item-list.module.scss'
import LayerItemStyles from 'styles/components/map/layer-item.module.scss'
import TooltipStyles from 'styles/components/shared/react-tooltip.module.scss'
import Toggle from 'app/components/Shared/Toggle'
import IconStyles from 'styles/icons.module.scss'
import { ReactComponent as PencilIcon } from 'assets/icons/pencil.svg'
import { ReactComponent as DeleteIcon } from 'assets/icons/remove.svg'
import ReactTooltip from 'react-tooltip'

class FilterGroupItem extends Component {
  constructor(props) {
    super(props)

    this.onClickFilterGroupEdit = this.onClickFilterGroupEdit.bind(this)
    this.onClickFilterGroupDelete = this.onClickFilterGroupDelete.bind(this)
  }

  onChangeFilterGroupVisibility() {
    this.props.toggleFilterGroupVisibility(this.props.index)
    this.props.refreshFlagFiltersLayers()
  }

  onClickFilterGroupDelete() {
    this.props.deleteFilterGroup(this.props.index)
  }

  onClickFilterGroupEdit() {
    this.props.editFilterGroup(this.props.index)
  }

  render() {
    const actionIcons = (
      <ul className={ListStyles.itemOptionList}>
        <li className={ListStyles.itemOptionItem} onClick={this.onClickFilterGroupEdit}>
          <PencilIcon className={IconStyles.pencilIcon} />
        </li>
        <li className={ListStyles.itemOptionItem} onClick={this.onClickFilterGroupDelete}>
          <DeleteIcon className={IconStyles.deleteBucketIcon} />
        </li>
      </ul>
    )

    const tooltip = this.props.filterGroup.label.length > 30 ? this.props.filterGroup.label : null

    return (
      <li
        className={classnames(
          ListStyles.listItem,
          ListStyles._noMobilePadding,
          ListStyles._fixed,
          ListStyles._alignLeft
        )}
      >
        <ReactTooltip />

        <Toggle
          on={this.props.filterGroup.visible}
          hue={this.props.filterGroup.hue}
          onToggled={() => this.onChangeFilterGroupVisibility()}
        />
        <div
          data-tip={tooltip}
          data-place="left"
          data-class={TooltipStyles.tooltip}
          className={LayerItemStyles.itemNameLabel}
        >
          {this.props.filterGroup.label}
        </div>
        {actionIcons}
      </li>
    )
  }
}

FilterGroupItem.propTypes = {
  index: PropTypes.number.isRequired,
  filterGroup: PropTypes.object.isRequired,
  editFilterGroup: PropTypes.func.isRequired,
  deleteFilterGroup: PropTypes.func.isRequired,
  toggleFilterGroupVisibility: PropTypes.func.isRequired,
  refreshFlagFiltersLayers: PropTypes.func.isRequired,
}

export default FilterGroupItem
