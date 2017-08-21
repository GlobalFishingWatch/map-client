import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import { LAYER_TYPES } from 'constants';
import ExpandItem from 'components/Shared/ExpandItem';
import LayerListStyles from 'styles/components/map/item-list.scss';
import IconStyles from 'styles/icons.scss';
import ButtonStyles from 'styles/components/button.scss';
import ReportIcon from '-!babel-loader!svg-react-loader!assets/icons/report.svg?name=ReportIcon';
import InfoIcon from '-!babel-loader!svg-react-loader!assets/icons/info.svg?name=InfoIcon';
import SelectIcon from '-!babel-loader!svg-react-loader!assets/icons/select.svg?name=SelectIcon';
import DeleteIcon from '-!babel-loader!svg-react-loader!assets/icons/delete.svg?name=DeleteIcon';
import PaintIcon from '-!babel-loader!svg-react-loader!assets/icons/paint.svg?name=PaintIcon';
import Toggle from 'components/Shared/Toggle';
import ColorPicker from 'components/Shared/ColorPicker';

class LayerItem extends Component {
  constructor() {
    super();
    this.state = { expand: null };
    this.onColorChange = this.onColorChange.bind(this);
  }

  onChangeVisibility() {
    if (this.props.layer.visible && this.props.showBlending) {
      this.props.onLayerBlendingToggled(this.props.layerIndex);
    }

    this.props.toggleLayerVisibility(this.props.layer.id);
  }

  onChangeOpacity(transparency) {
    if (!this.props.layer.visible) {
      this.props.toggleLayerVisibility(this.props.layer.id);
    }

    this.props.setLayerOpacity(transparency, this.props.layer.id);
  }

  onChangeHue(hue) {
    if (!this.props.layer.visible) {
      this.props.toggleLayerVisibility(this.props.layer.id);
    }

    this.props.setLayerHue(hue, this.props.layer.id);
  }

  onColorChange(color) {
    if (!this.props.layer.visible) {
      this.props.toggleLayerVisibility(this.props.layer.id);
    }

    this.props.setLayerColor(color, this.props.layer.id);
  }

  onChangeLayerLabel(value) {
    this.props.setLayerLabel(this.props.layer.id, value);
  }

  onClickReport() {
    this.props.toggleReport(this.props.layer.id);
  }

  onClickInfo() {
    const modalParams = {
      open: true,
      info: this.props.layer
    };

    this.props.openLayerInfoModal(modalParams);
  }

  toggleBlending() {
    this.props.onLayerBlendingToggled(this.props.layerIndex);
  }

  changeExpand(value) {
    if (value === this.state.expand) value = null;
    this.setState({ expand: value });
  }

  render() {
    const { id, color, reportId, visible } = this.props.layer;
    const isCurrentlyReportedLayer = this.props.currentlyReportedLayerId === id;
    const canReport = (this.props.userPermissions !== null && this.props.userPermissions.indexOf('reporting') !== -1);

    let actions;
    if (this.props.layerPanelEditMode === true) {
      actions = (
        <div className={LayerListStyles.editionMenu}>
          <DeleteIcon
            className={classnames(IconStyles.icon, IconStyles.deleteIcon)}
            onClick={() => {
              this.props.toggleLayerWorkspacePresence(this.props.layer);
            }}
          />
        </div>
      );
    } else {
      actions = (
        <ul className={LayerListStyles.itemOptionList}>
          {canReport && reportId !== undefined && <li
            className={LayerListStyles.itemOptionItem}
            onClick={() => this.onClickReport()}
          >
            <ReportIcon
              className={classnames(IconStyles.reportIcon, { [`${LayerListStyles._highlighted}`]: isCurrentlyReportedLayer })}
            />
          </li>}
          {this.props.layer.type !== LAYER_TYPES.Custom &&
          <li className={LayerListStyles.itemOptionItem}>
            <button className={classnames(ButtonStyles.expandButton, { [ButtonStyles.active]: this.state.expand === 'EXTRA' })} >
              <PaintIcon
                className={IconStyles.paintIcon}
                onClick={() => this.changeExpand('EXTRA')}
              />
            </button >
          </li>}
          <li
            className={LayerListStyles.itemOptionItem}
          >
            <button className={classnames(ButtonStyles.expandButton, { [ButtonStyles.active]: this.state.expand === 'INFO' })} >
              <InfoIcon
                className={IconStyles.infoIcon}
                onClick={() => this.changeExpand('INFO')}
              />
            </button >
          </li>
        </ul>
      );
    }

    return (
      <div className={LayerListStyles.listItemContainer}>
        <li
          className={LayerListStyles.listItem}
        >
          <Toggle
            on={visible}
            colorName={color}
            onToggled={() => this.onChangeVisibility()}
          />
          <input
            className={classnames(LayerListStyles.itemName, { [LayerListStyles.itemRename]: this.props.layerPanelEditMode })}
            onChange={e => this.onChangeLayerLabel(e.currentTarget.value)}
            readOnly={!this.props.layerPanelEditMode}
            value={this.props.layer.label}
            ref={((elem) => {
              this.inputName = elem;
            })}
          />
          {actions}
        </li>
        <ExpandItem active={this.state.expand === 'EXTRA'}>
          <ColorPicker
            color={color}
            onColorChange={this.onColorChange}
            id={id}
          />
        </ExpandItem >
        <ExpandItem active={this.state.expand === 'INFO'}>
          <div className={LayerListStyles.selectPolygon}>
            <SelectIcon
              className={IconStyles.selectIcon}
            />
            <div className={LayerListStyles.selectPolygonText}>
              Select a Polygon to get more info
            </div>
          </div>
          <button
            onClick={() => this.onClickInfo()}
            className={classnames(ButtonStyles.button, ButtonStyles._filled, ButtonStyles._half)}
          >
            INFO LAYER
          </button >
        </ExpandItem >
      </div >
    );
  }
}

LayerItem.propTypes = {
  /*
   list of restricted actions a user is allowed to perform
   */
  userPermissions: PropTypes.array,
  layerIndex: PropTypes.number,
  /*
   layer object
   */
  layer: PropTypes.object,
  currentlyReportedLayerId: PropTypes.string,
  toggleLayerVisibility: PropTypes.func,
  toggleLayerWorkspacePresence: PropTypes.func,
  toggleReport: PropTypes.func,
  setLayerOpacity: PropTypes.func,
  setLayerHue: PropTypes.func,
  openLayerInfoModal: PropTypes.func,
  onLayerBlendingToggled: PropTypes.func,
  /*
   Called when a layer title changes
   */
  setLayerLabel: PropTypes.func,
  showBlending: PropTypes.bool,
  /*
   Called when the color changes
   */
  setLayerColor: PropTypes.func,
  /*
   If layer labels are editable or not
   */
  layerPanelEditMode: PropTypes.bool
};

export default LayerItem;
