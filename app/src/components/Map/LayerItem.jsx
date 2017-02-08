import React, { Component } from 'react';
import classnames from 'classnames';
import { LAYER_TYPES } from 'constants';
import LayerOptionsTooltip from 'components/Map/LayerOptionsTooltip';
import { hueToRgbString } from 'util/hsvToRgb';
import LayerListStyles from 'styles/components/map/c-layer-list.scss';
import SwitcherStyles from 'styles/components/shared/c-switcher.scss';
import icons from 'styles/icons.scss';
import ReportIcon from 'babel!svg-react!assets/icons/report-icon.svg?name=ReportIcon';
import BlendingIcon from 'babel!svg-react!assets/icons/blending-icon.svg?name=BlendingIcon';
import InfoIcon from 'babel!svg-react!assets/icons/info-icon.svg?name=InfoIcon';
import DeleteIcon from 'babel!svg-react!assets/icons/delete-icon.svg?name=DeleteIcon';
import RenameIcon from 'babel!svg-react!assets/icons/close.svg?name=RenameIcon';

class LayerItem extends Component {

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

  onChangeLayerLabel(value) {
    this.props.setLayerLabel(this.props.layer.id, value);
  }

  onClickReport() {
    this.props.toggleReport(this.props.layer.id, this.props.layer.title);
  }

  onClickInfo() {
    const modalParams = {
      open: true,
      info: this.props.layer
    };

    this.props.openLayerInfoModal(modalParams);
  }

  clearName() {
    this.onChangeLayerLabel('');
    this.inputName.focus();
  }

  toggleBlending() {
    this.props.onLayerBlendingToggled(this.props.layerIndex);
  }

  getColor(layer) {
    if (layer.hue !== undefined) {
      return hueToRgbString(layer.hue);
    }
    return layer.color;
  }

  render() {
    const isCurrentlyReportedLayer = this.props.currentlyReportedLayerId === this.props.layer.id;
    const canReport = (this.props.userPermissions.indexOf('reporting') !== -1);

    let actions;
    if (this.props.layerPanelEditMode === true) {
      actions = (
        <div className={LayerListStyles['edition-menu']} >
          <DeleteIcon
            className={classnames(icons.icon, LayerListStyles['delete-icon'])}
            onClick={() => {
              this.props.toggleLayerWorkspacePresence(this.props.layer);
            }}
          />
        </div>
      );
    } else {
      actions = (
        <ul className={LayerListStyles['layer-option-list']} >
          {canReport && this.props.layer.reportable && <li
            className={LayerListStyles['layer-option-item']}
            onClick={() => this.onClickReport()}
          >
            <ReportIcon
              className={classnames({ [`${LayerListStyles['-highlighted']}`]: isCurrentlyReportedLayer })}
            />
          </li>}
          {this.props.layer.type !== LAYER_TYPES.Custom && <li
            className={LayerListStyles['layer-option-item']}
            onClick={() => this.toggleBlending()}
          >
            <BlendingIcon
              className={classnames(icons['blending-icon'],
                { [`${icons['-white']}`]: this.props.showBlending })}
            />
            <LayerOptionsTooltip
              displayHue={this.props.layer.type === LAYER_TYPES.Heatmap}
              displayOpacity
              hueValue={this.props.layer.hue}
              opacityValue={this.props.layer.opacity}
              onChangeOpacity={opacity => this.onChangeOpacity(opacity)}
              onChangeHue={hue => this.onChangeHue(hue)}
              showBlending={this.props.showBlending}
            />
          </li>}
          <li
            className={LayerListStyles['layer-option-item']}
            onClick={() => this.onClickInfo()}
          >
            <InfoIcon />
          </li>
        </ul>
      );
    }

    return (
      <li
        className={LayerListStyles['layer-item']}
      >
        <div
          className={classnames(SwitcherStyles['c-switcher'], { [SwitcherStyles['-active']]: this.props.layer.visible })}
          onClick={() => this.onChangeVisibility()}
          style={this.props.layer.visible ? { background: this.getColor(this.props.layer) } : null}
        >
          <input
            type="checkbox"
            checked={this.props.layer.visible}
            key={this.getColor(this.props.layer)}
          />
          <div className={SwitcherStyles.toggle} />
        </div>
        <input
          className={classnames(LayerListStyles['item-name'], { [LayerListStyles['item-rename']]: this.props.layerPanelEditMode })}
          onChange={e => this.onChangeLayerLabel(e.currentTarget.value)}
          readOnly={!this.props.layerPanelEditMode}
          value={this.props.layer.label}
          ref={((elem) => {
            this.inputName = elem;
          })}
        />
        {this.props.layerPanelEditMode === true && <RenameIcon
          className={classnames(icons.icon, icons['icon-close'], LayerListStyles['rename-icon'])}
          onClick={() => this.clearName()}
        />}
        {actions}
      </li>
    );
  }
}

LayerItem.propTypes = {
  /*
  list of restricted actions a user is allowed to perform
   */
  userPermissions: React.PropTypes.array,
  layerIndex: React.PropTypes.number,
  /*
  layer object
   */
  layer: React.PropTypes.object,
  currentlyReportedLayerId: React.PropTypes.string,
  toggleLayerVisibility: React.PropTypes.func,
  toggleLayerWorkspacePresence: React.PropTypes.func,
  toggleReport: React.PropTypes.func,
  setLayerOpacity: React.PropTypes.func,
  setLayerHue: React.PropTypes.func,
  openLayerInfoModal: React.PropTypes.func,
  onLayerBlendingToggled: React.PropTypes.func,
  /*
  Called when a layer title changes
   */
  setLayerLabel: React.PropTypes.func,
  showBlending: React.PropTypes.bool,
  /*
  If layer labels are editable or not
   */
  layerPanelEditMode: React.PropTypes.bool
};

export default LayerItem;
