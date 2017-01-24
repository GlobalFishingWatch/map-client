import React, { Component } from 'react';
import classnames from 'classnames';
import { LAYER_TYPES } from 'constants';
import LayerOptionsTooltip from 'components/Map/LayerOptionsTooltip';
import { hueToRgbString } from 'util/hsvToRgb';

import LayerListStyles from 'styles/components/map/c-layer-list.scss';
import SwitcherStyles from 'styles/components/shared/c-switcher.scss';
import iconStyles from 'styles/icons.scss';

import ReportIcon from 'babel!svg-react!assets/icons/report-icon.svg?name=ReportIcon';
import BlendingIcon from 'babel!svg-react!assets/icons/blending-icon.svg?name=BlendingIcon';
import InfoIcon from 'babel!svg-react!assets/icons/info-icon.svg?name=InfoIcon';

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
    return (
      <li
        className={LayerListStyles['layer-item']}
      >
        <label>
          <input
            className={SwitcherStyles['c-switcher']}
            type="checkbox"
            checked={this.props.layer.visible}
            onChange={() => this.onChangeVisibility()}
            key={this.getColor(this.props.layer)}
            style={{
              color: this.getColor(this.props.layer)
            }}
          />
          <span className={LayerListStyles['layer-title']}>
            {this.props.layer.title}
          </span>
        </label>
        <ul className={LayerListStyles['layer-option-list']}>
          {this.props.userCanReport && this.props.layer.reportable && <li
            className={LayerListStyles['layer-option-item']}
            onClick={() => this.onClickReport()}
          >
            <ReportIcon
              className={classnames({ [`${LayerListStyles['-highlighted']}`]: this.props.isCurrentlyReported })}
            />
          </li>}
          {this.props.layer.type !== LAYER_TYPES.Custom && <li
            className={LayerListStyles['layer-option-item']}
            onClick={() => this.toggleBlending()}
          >
            <BlendingIcon
              className={classnames(iconStyles['blending-icon'],
                { [`${iconStyles['-white']}`]: this.props.showBlending })}
            />
          </li>}
          <li
            className={LayerListStyles['layer-option-item']}
            onClick={() => this.onClickInfo()}
          >
            <InfoIcon />
          </li>
        </ul>

        <LayerOptionsTooltip
          displayHue={this.props.layer.type === LAYER_TYPES.ClusterAnimation}
          displayOpacity
          hueValue={this.props.layer.hue}
          opacityValue={this.props.layer.opacity}
          onChangeOpacity={opacity => this.onChangeOpacity(opacity)}
          onChangeHue={hue => this.onChangeHue(hue)}
          showBlending={this.props.showBlending}
        />
      </li>
    );
  }
}

LayerItem.propTypes = {
  layerIndex: React.PropTypes.number,
  layer: React.PropTypes.object,
  isCurrentlyReported: React.PropTypes.bool,
  toggleLayerVisibility: React.PropTypes.func,
  toggleReport: React.PropTypes.func,
  setLayerOpacity: React.PropTypes.func,
  setLayerHue: React.PropTypes.func,
  openLayerInfoModal: React.PropTypes.func,
  onLayerBlendingToggled: React.PropTypes.func,
  showBlending: React.PropTypes.bool,
  userCanReport: React.PropTypes.bool
};

export default LayerItem;
