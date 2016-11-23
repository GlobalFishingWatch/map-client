import React, { Component } from 'react';
import classnames from 'classnames';
import InputRange from 'react-input-range';
import layerPanelStyle from '../../../styles/components/map/c-layer-panel.scss';

import ReportIcon from 'babel!svg-react!assets/icons/report-icon.svg?name=ReportIcon';
import OpacityIcon from 'babel!svg-react!assets/icons/opacity-icon.svg?name=OpacityIcon';
import InfoIcon from 'babel!svg-react!assets/icons/info-icon.svg?name=InfoIcon';

class LayerItem extends Component {

  constructor(props) {
    super(props);

    this.defaultConfig = {
      classnames: {
        component: 'opacity-range',
        labelMax: 'label -max',
        labelMin: 'label -min',
        labelValue: 'label -current',
        trackActive: 'track-active',
        trackContainer: 'track-container',
        sliderContainer: 'thumb-container',
        slider: 'thumb'
      },
      minValue: 10,
      maxValue: 100,
      step: 10,
      value: this.props.layer.opacity * 100
    };

    this.state = {
      rangeValue: this.defaultConfig.value,
      opacity: false
    };
  }

  // mandatory callback for range element. Updates itself.
  onChangeOpacity(component, value) {
    const transparency = parseFloat(value) / 100;

    this.setState({
      rangeValue: value
    });

    if (!this.props.layer.visible) {
      this.props.toggleLayerVisibility(this.props.layer);
    }

    this.props.setLayerOpacity(transparency, this.props.layer);
  }

  // onClickReport(event) {
  //   console.log(event);
  // }

  //
  // onClickInfo(event) {
  //   console.log(event);
  // }

  onChangeSwitch() {
    if (this.props.layer.visible) {
      Object.assign(this.state, {
        opacity: false
      });

      this.setState(this.state);
    }

    this.props.toggleLayerVisibility(this.props.layer);
  }


  toggleOpacityMenu() {
    Object.assign(this.state, {
      opacity: !this.state.opacity
    });

    this.setState(this.state);
  }

  render() {
    const cssClassOpacity = this.state.opacity ?
      classnames(layerPanelStyle['opacity-menu'], layerPanelStyle['-is-visible']) : layerPanelStyle['opacity-menu'];

    if (!this.state.rangeValue) return null;

    return (
      <li
        className={layerPanelStyle['layer-item']}
      >
        <label>
          <input
            className={layerPanelStyle.switcher}
            type="checkbox"
            checked={this.props.layer.visible}
            onChange={() => this.onChangeSwitch()}
            style={{
              color: this.props.layer.color
            }}
          />
          <span className={layerPanelStyle['layer-name']}>
            {this.props.layer.title}
          </span>
        </label>
        <ul className={layerPanelStyle['layer-options-list']}>
          <li
            className={layerPanelStyle['layer-options-item']}
            onClick={this.onClickReport}
          >
            <ReportIcon />
          </li>
          <li
            className={layerPanelStyle['layer-options-item']}
            onClick={() => this.toggleOpacityMenu()}
          >
            <OpacityIcon />
          </li>
          <li
            className={layerPanelStyle['layer-options-item']}
            onClick={this.onClickInfo}
          >
            <InfoIcon />
          </li>
        </ul>
        <div className={cssClassOpacity} ref={(opacityMenu) => { this.opacityMenu = opacityMenu; }}>
          <InputRange
            classNames={this.defaultConfig.classnames}
            value={this.state.rangeValue}
            maxValue={this.defaultConfig.maxValue}
            minValue={this.defaultConfig.minValue}
            onChange={(component, value) => this.onChangeOpacity(component, value)}
            step={this.defaultConfig.step}
          />
        </div>
      </li>
    );
  }
}

LayerItem.propTypes = {
  layer: React.PropTypes.object,
  toggleLayerVisibility: React.PropTypes.func,
  setLayerOpacity: React.PropTypes.func
};

export default LayerItem;
