import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classnames from 'classnames'
import ExpandItem from 'app/components/Shared/ExpandItem'
import ExpandableIconButton from 'app/components/Shared/ExpandableIconButton'
import IconButton from 'app/components/Shared/IconButton'
import LayerItemStyles from 'styles/components/map/layer-item.module.scss'
import ListItemStyles from 'styles/components/map/item-list.module.scss'
import TooltipStyles from 'styles/components/shared/react-tooltip.module.scss'
import ReactTooltip from 'react-tooltip'
import IconStyles from 'styles/icons.module.scss'
import ButtonStyles from 'styles/components/button.module.scss'
import { ReactComponent as InfoIcon } from 'assets/icons/info.svg'
import { ReactComponent as DeleteIcon } from 'assets/icons/remove.svg'
import Toggle from 'app/components/Shared/Toggle'
import ColorPicker from 'app/components/Shared/ColorPicker'

class LayerItem extends Component {
  constructor() {
    super()
    this.state = { expand: null }
  }

  onChangeVisibility() {
    if (this.props.layer.visible && this.props.showBlending) {
      this.props.onLayerBlendingToggled(this.props.layerIndex)
    }

    this.props.toggleLayerVisibility(this.props.layer.id)
  }

  onOpacityChange = (opacity) => {
    if (!this.props.layer.visible) {
      this.props.toggleLayerVisibility(this.props.layer.id)
    }

    this.props.setLayerOpacity(opacity, this.props.layer.id)
  }

  onTintChange = (color, hue) => {
    if (!this.props.layer.visible) {
      this.props.toggleLayerVisibility(this.props.layer.id)
    }
    this.props.setLayerTint(color, hue, this.props.layer.id)
  }

  onShowLabelsToggle = () => {
    if (!this.props.layer.visible) {
      this.props.toggleLayerVisibility(this.props.layer.id)
    }
    this.props.toggleLayerShowLabels(this.props.layer.id)
  }

  onChangeLayerLabel(value) {
    this.props.setLayerLabel(this.props.layer.id, value)
  }

  onClickReport() {
    this.props.toggleReport(this.props.layer.id)
  }

  onClickInfo() {
    const modalParams = {
      open: true,
      info: this.props.layer,
    }

    this.props.openLayerInfoModal(modalParams)
  }

  toggleBlending() {
    this.props.onLayerBlendingToggled(this.props.layerIndex)
  }

  changeExpand(value) {
    if (value === this.state.expand) value = null
    this.setState({ expand: value })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.layerPanelEditMode && !this.props.layerPanelEditMode) {
      this.props.setLayerLabel(this.props.layer.id, this.nameLabel.textContent)
    }
  }

  render() {
    const { id, hue, color, reportId, visible, opacity, showLabels } = this.props.layer
    const { layerPanelEditMode, canReport } = this.props
    const isCurrentlyReportedLayer = this.props.currentlyReportedLayerId === id

    let actions
    if (this.props.layerPanelEditMode === true) {
      actions = (
        <ul className={LayerItemStyles.itemOptionList}>
          <li
            className={LayerItemStyles.itemOptionItem}
            onClick={() => {
              this.props.toggleLayerWorkspacePresence(this.props.layer)
            }}
          >
            <button className={ButtonStyles.deleteButton}>
              <DeleteIcon className={classnames(IconStyles.icon, IconStyles.deleteIcon)} />
            </button>
          </li>
        </ul>
      )
    } else {
      actions = (
        <ul className={LayerItemStyles.itemOptionList}>
          {canReport && reportId !== undefined && (
            <li className={LayerItemStyles.itemOptionItem} onClick={() => this.onClickReport()}>
              <IconButton icon="report" activated={isCurrentlyReportedLayer === true} />
            </li>
          )}
          {this.props.enableLayerDisplaySettings && (
            <li
              className={LayerItemStyles.itemOptionItem}
              style={{ position: 'relative' }}
              onClick={() => this.changeExpand('EXTRA')}
            >
              <ExpandableIconButton activated={this.state.expand === 'EXTRA'}>
                <IconButton icon="paint" activated={this.state.expand === 'EXTRA'} />
              </ExpandableIconButton>
            </li>
          )}
          <li className={LayerItemStyles.itemOptionItem} onClick={() => this.onClickInfo()}>
            <button className={ButtonStyles.infoButton}>
              <InfoIcon className={IconStyles.infoIcon} />
            </button>
          </li>
        </ul>
      )
    }

    const tooltip = this.props.layer.label.length > 30 ? this.props.layer.label : null

    return (
      <div className={ListItemStyles.listItemContainer}>
        <ReactTooltip />
        <li className={classnames(ListItemStyles.listItem, ListItemStyles._fixed)}>
          <div
            className={classnames(LayerItemStyles.layerItemHeader, {
              [LayerItemStyles.itemRename]: this.props.layerPanelEditMode,
            })}
          >
            <Toggle
              on={visible}
              color={color}
              hue={hue}
              onToggled={() => this.onChangeVisibility()}
            />
            <input
              data-tip={tooltip}
              data-place="left"
              data-class={TooltipStyles.tooltip}
              className={LayerItemStyles.itemNameInput}
              onChange={(e) => this.onChangeLayerLabel(e.currentTarget.value)}
              readOnly={!this.props.layerPanelEditMode}
              value={this.props.layer.label}
            />
            <label
              className={classnames(LayerItemStyles.itemNameLabel, {
                [LayerItemStyles.itemNameLabelEdit]: this.props.layerPanelEditMode,
              })}
              ref={(elem) => {
                this.nameLabel = elem
              }}
            >
              {this.props.layer.label}
            </label>
          </div>
          {actions}
        </li>
        {this.props.enableLayerDisplaySettings && (
          <ExpandItem
            active={!layerPanelEditMode && this.state.expand === 'EXTRA'}
            arrowPosition={0}
          >
            <ColorPicker
              color={color}
              hue={hue}
              opacity={opacity}
              showLabels={showLabels}
              onShowLabelsToggle={this.props.enableLabels === true ? this.onShowLabelsToggle : null}
              onTintChange={this.props.enableColorInputs === true ? this.onTintChange : null}
              onOpacityChange={this.onOpacityChange}
              id={id}
            />
          </ExpandItem>
        )}
      </div>
    )
  }
}

LayerItem.propTypes = {
  /*
   list of restricted actions a user is allowed to perform
   */
  canReport: PropTypes.bool.isRequired,
  layerIndex: PropTypes.number.isRequired,
  /*
   layer object
   */
  layer: PropTypes.object,
  currentlyReportedLayerId: PropTypes.string,
  toggleLayerVisibility: PropTypes.func,
  toggleLayerWorkspacePresence: PropTypes.func,
  toggleReport: PropTypes.func,
  setLayerOpacity: PropTypes.func,
  setLayerTint: PropTypes.func,
  toggleLayerShowLabels: PropTypes.func,
  openLayerInfoModal: PropTypes.func,
  onLayerBlendingToggled: PropTypes.func,
  /*
   Called when a layer title changes
   */
  setLayerLabel: PropTypes.func,
  showBlending: PropTypes.bool,
  /*
   If layer labels are editable or not
   */
  layerPanelEditMode: PropTypes.bool,
  enableLayerDisplaySettings: PropTypes.bool,
  enableLabels: PropTypes.bool,
  enableColorInputs: PropTypes.bool,
}

export default LayerItem
