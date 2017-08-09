import React, { Component } from 'preact';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ColorPicker from 'components/Shared/ColorPicker';
import areasPanelStyles from 'styles/components/map/areas-panel.scss';
import controlPanelStyles from 'styles/components/control_panel.scss';
import buttonStyles from 'styles/components/map/button.scss';


class AreasPanel extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      color: null
    };
    this.onAddArea = this.onAddArea.bind(this);
    this.onAreaSave = this.onAreaSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
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

  onColorChange(color) {
    this.props.saveEditingArea({ color });
  }

  render() {
    return (
      (this.props.drawing ?
        <div className={areasPanelStyles.areasPanel} >
          <input
            type="text"
            onChange={e => this.onNameChange(e)}
            className={areasPanelStyles.nameInput}
            placeholder="Area name"
            value={this.state.name}
          />
          <div className={classnames(controlPanelStyles.lightPanel)}>
            <ColorPicker color={this.props.editingArea.color} onColorChange={this.onColorChange} />
          </div>
          <div className={classnames(areasPanelStyles.actionButtons)}>
            <button
              className={classnames([buttonStyles.button])}
              onClick={this.onCancel}
            >
              Cancel
            </button>
            <button
              className={classnames([buttonStyles.button, buttonStyles._primary])}
              onClick={this.onAreaSave}
            >
              Save
            </button>
          </div>
        </div> :
        <div>
          <button
            className={classnames([buttonStyles.button, buttonStyles._wide, buttonStyles._primary])}
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
  saveEditingArea: PropTypes.func.isRequired,
  drawing: PropTypes.bool.isRequired,
  editingArea: PropTypes.object.isRequired
};

export default AreasPanel;
