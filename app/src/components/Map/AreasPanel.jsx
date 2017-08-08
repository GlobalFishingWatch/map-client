import React, { Component } from 'preact';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import LayerManagementStyles from 'styles/components/map/layer-management.scss';
import searchPanelStyles from 'styles/components/map/search-panel.scss';

import MapButtonStyles from 'styles/components/map/button.scss';


class AreasPanel extends Component {
  constructor() {
    super();
    this.state = {
      name: ''
    };
    this.onAddArea = this.onAddArea.bind(this);
    this.onAreaSave = this.onAreaSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onAddArea() {
    this.setState({ name: '' });
    this.props.setDrawingMode(true);
  }

  onCancel() {
    this.setState({ name: '' });
    this.props.setDrawingMode(false);
  }

  onAreaSave() {
    if (this.props.editingArea.coordinates.length > 0 && this.state.name) {
      this.props.saveArea(this.state.name);
      this.setState({ name: '' });
      this.props.setDrawingMode(false);
    } else {
      console.info('You need a name and to draw a polygon');
    }
  }

  onNameChange(event) {
    const name = event.target.value;
    this.setState({ name });
  }

  render() {
    return (
      (this.props.drawing ?
        <div className={LayerManagementStyles.layerManagement} >
          <div className={searchPanelStyles.searchPanel} >
            <input
              type="text"
              onChange={e => this.onNameChange(e)}
              className={searchPanelStyles.searchAccordion}
              placeholder="Area name"
              value={this.state.name}
            />
          </div>
          <button
            className={classnames(MapButtonStyles.button, LayerManagementStyles.layerButton)}
            onClick={this.onCancel}
          >
            Cancel
          </button>
          <button
            className={classnames(MapButtonStyles.button, LayerManagementStyles.layerButton)}
            onClick={this.onAreaSave}
          >
            Save
          </button>
        </div> :
        <div>
          <button
            className={classnames(MapButtonStyles.button, LayerManagementStyles.layerButton)}
            onClick={this.onAddArea}
          >
            Add area
          </button>
        </div>)
    );
  }
}

AreasPanel.propTypes = {
  setDrawingMode: PropTypes.func.isRequired,
  saveArea: PropTypes.func.isRequired,
  drawing: PropTypes.bool.isRequired,
  editingArea: PropTypes.object.isRequired
};

export default AreasPanel;
