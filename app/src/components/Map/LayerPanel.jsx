import React, { Component } from 'react';
import controlPanelStyle from '../../../styles/components/c-control_panel.scss';

class LayerPanel extends Component {

  constructor(props) {
    super(props);

    this.toggleLayerVisibility = this.props.toggleLayerVisibility.bind(this);
  }
  render() {
    let layers = [];
    if (this.props.layers) {
      for (let i = 0, length = this.props.layers.length; i < length; i++) {
        layers.push(
          <li
            className={controlPanelStyle.list_checkbox}
            key={i}
          >
            <label>
              <input
                type="checkbox"
                checked={this.props.layers[i].visible}
                onChange={() => this.toggleLayerVisibility(this.props.layers[i])}
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

    return (<ul>{layers}</ul>);
  }
}

LayerPanel.propTypes = {
  layers: React.PropTypes.array,
  toggleLayerVisibility: React.PropTypes.func
};


export default LayerPanel;
