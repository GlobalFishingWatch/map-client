import React, { Component } from 'react';
import classnames from 'classnames';
import InputRange from 'react-input-range';
import layerPanelStyle from '../../../styles/components/map/c-layer-panel.scss';
import iconsStyles from '../../../styles/icons.scss';

class LayerItem extends Component {

  // onClickReport(event) {
  //   console.log(event);
  // }
  //
  // onClickOpacity(event) {
  //   console.log(event);
  // }
  //
  // onClickInfo(event) {
  //   console.log(event);
  // }

  render() {
    return (
      <li
        className={layerPanelStyle['layer-item']}
      >
        <label>
          <input
            className={layerPanelStyle.switcher}
            type="checkbox"
            checked={this.props.layer.visible}
            onChange={() => this.props.toggleLayerVisibility(this.props.layer)}
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
            <svg className={classnames(iconsStyles.icon, iconsStyles['icon-report-icon'])}>
              <use xlinkHref="#icon-report-icon"></use>
            </svg>
          </li>
          <li
            className={layerPanelStyle['layer-options-item']}
            onClick={this.onClickOpacity}
          >
            <svg className={classnames(iconsStyles.icon, iconsStyles['icon-opacity-icon'])}>
              <use xlinkHref="#icon-opacity-icon"></use>
            </svg>
          </li>
          <li
            className={layerPanelStyle['layer-options-item']}
            onClick={this.onClickInfo}
          >
            <svg className={classnames(iconsStyles.icon, iconsStyles['icon-i-icon'])}>
              <use xlinkHref="#icon-i-icon"></use>
            </svg>
          </li>
        </ul>
        <div className={layerPanelStyle['opacity-menu']}>
          <InputRange
            classNames={this.state.input}
            maxValue={100}
            minValue={0}
            value={this.state.values}
            onChange={(component, value) => this.onChangeOpacity(component, value)}
            step={10}
          />
        </div>
      </li>
    );
  }
}

LayerItem.propTypes = {
  layer: React.PropTypes.object,
  toggleLayerVisibility: React.PropTypes.func
};

export default LayerItem;
