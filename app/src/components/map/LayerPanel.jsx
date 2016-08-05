import React, { Component } from 'react';
import layerPanel from '../../../styles/components/c_layer_panel.scss';

class LayerPanel extends Component {

  render() {
    let layers = [];
    if (this.props.layers) {
      for (let i = 0, length = this.props.layers.length; i < length; i++) {
        layers.push(
          <li
            className={layerPanel.list_checkbox}
            key={i}
          >
            <label>
              <input
                type="checkbox"
                checked={this.props.layers[i].visible}
                onChange={() => this.props.onLayerToggle(this.props.layers[i])}
                style={{
                  color: this.props.layers[i].color
                }}
              />
              {this.props.layers[i].title}
            </label>
          </li>
        );
      }
    }

    return (
      <div className={layerPanel.content_accordion}>
        <ul>{layers}</ul>
      </div>
    );
  }
}

LayerPanel.propTypes = {
  layers: React.PropTypes.array,
  onLayerToggle: React.PropTypes.func
};


export default LayerPanel;
