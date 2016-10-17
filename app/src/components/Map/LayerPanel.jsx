import React, { Component } from 'react';
import classnames from 'classnames';
import layerPanelStyle from '../../../styles/components/map/c-layer-panel.scss';
import iconsStyles from '../../../styles/icons.scss';

class LayerPanel extends Component {

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
    const layers = [];
    if (this.props.layers) {
      for (let i = 0, length = this.props.layers.length; i < length; i++) {
        layers.push(
          <li
            className={layerPanelStyle['layer-item']}
            key={i}
          >
            <label>
              <input
                className={layerPanelStyle.switcher}
                type="checkbox"
                checked={this.props.layers[i].visible}
                onChange={() => this.props.toggleLayerVisibility(this.props.layers[i])}
                style={{
                  color: this.props.layers[i].color
                }}
              />
              <span className={layerPanelStyle['layer-name']}>
                {this.props.layers[i].title}
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
          </li>
        );
      }
    }

    return (
      <div className={layerPanelStyle['c-layer-panel']}>
        <ul className={layerPanelStyle['layer-list']}>
          {layers}
        </ul>
      </div>
    );
  }
}

LayerPanel.propTypes = {
  layers: React.PropTypes.array,
  toggleLayerVisibility: React.PropTypes.func
};


export default LayerPanel;
