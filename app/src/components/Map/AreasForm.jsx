import React, { Component } from 'preact';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ColorPicker from 'components/Shared/ColorPicker';
import { COLORS } from 'constants';
import areasPanelStyles from 'styles/components/map/areas-panel.scss';
import controlPanelStyles from 'styles/components/control_panel.scss';
import buttonStyles from 'styles/components/map/button.scss';

class AreasForm extends Component {
  constructor() {
    super();
    this.onAddArea = this.onAddArea.bind(this);
    this.onAreaSave = this.onAreaSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
  }

  onAddArea() {
    this.props.setDrawingMode(true);
  }

  onCancel() {
    this.resetForm();
    this.props.setDrawingMode(false);
  }

  resetForm() {
    const resetedEditingArea = { name: null, color: Object.keys(COLORS)[0], coordinates: [] };
    this.props.updateWorkingAreaOfInterest(resetedEditingArea);
  }

  onAreaSave() {
    if (this.props.editingArea.coordinates.length > 0 && this.props.editingArea.name) {
      this.props.saveAreaOfInterest();
      this.resetForm();
      this.props.setDrawingMode(false);
    } else {
      console.info('You need a name and to draw a polygon');
    }
  }

  onNameChange(event) {
    const name = event.target.value;
    this.props.updateWorkingAreaOfInterest({ name });
  }

  onColorChange(color) {
    this.props.updateWorkingAreaOfInterest({ color });
  }

  render() {
    const { name, coordinates, color } = this.props.editingArea;

    if (!this.props.drawing) {
      return (
        <div >
          <button
            className={classnames([buttonStyles.button, buttonStyles._wide, buttonStyles._primary])}
            onClick={this.onAddArea}
          >
            Add area
          </button >
        </div >
      );
    }

    const saveButtonEnabled = coordinates.length !== 0 && name.length !== 0;

    return (
      <div className={areasPanelStyles.areasPanel} >
        <input
          type="text"
          onInput={e => this.onNameChange(e)}
          className={areasPanelStyles.nameInput}
          placeholder="Area name"
          value={name}
        />
        <div className={classnames(controlPanelStyles.lightPanel)} >
          <ColorPicker color={color} onColorChange={this.onColorChange} />
        </div >
        <div className={classnames(areasPanelStyles.actionButtons)} >
          <button
            className={classnames([buttonStyles.button])}
            onClick={this.onCancel}
          >
            Cancel
          </button >
          <button
            disabled={!saveButtonEnabled}
            className={classnames(buttonStyles.button,
              { [`${buttonStyles._primary}`]: saveButtonEnabled },
              { [`${buttonStyles._disabled}`]: !saveButtonEnabled }
            )}
            onClick={this.onAreaSave}
          >
            Save
          </button >
        </div >
      </div >
    );
  }
}

AreasForm.propTypes = {
  setDrawingMode: PropTypes.func.isRequired,
  saveAreaOfInterest: PropTypes.func.isRequired,
  updateWorkingAreaOfInterest: PropTypes.func.isRequired,
  drawing: PropTypes.bool.isRequired,
  editingArea: PropTypes.object.isRequired
};

export default AreasForm;
