import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ColorPicker from 'components/Shared/ColorPicker';
import { COLORS } from 'config';
import areasPanelStyles from 'styles/components/map/areas-panel.scss';
import controlPanelStyles from 'styles/components/control_panel.scss';
import buttonStyles from 'styles/components/button.scss';

class AreasForm extends Component {
  constructor() {
    super();
    this.state = {
      errors: ''
    };
    this.onAddArea = this.onAddArea.bind(this);
    this.onAreaSave = this.onAreaSave.bind(this);
    this.onAreaUpdate = this.onAreaUpdate.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { editAreaIndex, areas } = this.props;
    if ((editAreaIndex === undefined || editAreaIndex === null) && editAreaIndex !== nextProps.editAreaIndex) {
      this.props.updateWorkingAreaOfInterest(areas[nextProps.editAreaIndex]);
    }
  }

  onAddArea() {
    this.props.setDrawingMode(true);
  }

  onCancel() {
    this.resetForm();
    this.props.setEditAreaIndex(null);
    this.props.setDrawingMode(false);
  }

  resetForm() {
    const resetedEditingArea = { name: '', color: Object.keys(COLORS)[0], coordinates: [] };
    this.props.updateWorkingAreaOfInterest(resetedEditingArea);
  }

  onAreaSave() {
    if (this.props.editingArea.name) {
      this.setState({ error: '' });
      this.props.saveAreaOfInterest();
      this.resetForm();
      this.props.setDrawingMode(false);
    } else {
      this.setState({ error: 'Please fill the name field to save' });
    }
  }

  onAreaUpdate() {
    if (this.props.editingArea.name) {
      this.setState({ error: '' });
      this.props.updateAreaOfInterest();
      this.props.setEditAreaIndex(null);
      this.resetForm();
    } else {
      this.setState({ error: 'Please fill the name field to save' });
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
    const { error } = this.state;
    const { isDrawing, editAreaIndex } = this.props;
    const { name, color } = this.props.editingArea;
    const saveAllowed = this.props.editingArea.coordinates.length > 0;
    if (!isDrawing && (editAreaIndex === undefined || editAreaIndex === null)) {
      return (
        <div className={areasPanelStyles.areasPanel} >
          <div >
            <button
              className={classnames([buttonStyles.button, buttonStyles._wide, buttonStyles._filled])}
              onClick={this.onAddArea}
            >
              Add area of interest
            </button >
          </div >
        </div >
      );
    }

    return (
      <div className={areasPanelStyles.areasForm} >
        <input
          type="text"
          onChange={e => this.onNameChange(e)}
          className={areasPanelStyles.nameInput}
          placeholder="Insert area name"
          value={name}
        />
        {error &&
          <div className={classnames(areasPanelStyles.error)} >
            {error}
          </div >
        }
        <div className={classnames(controlPanelStyles.item)} >
          <ColorPicker color={color} onColorChange={this.onColorChange} />
        </div >
        <div className={classnames(areasPanelStyles.actionButtons)} >
          <button
            className={classnames([buttonStyles.button])}
            onClick={this.onCancel}
          >
            Cancel
          </button >
          {saveAllowed &&
            (editAreaIndex !== undefined && editAreaIndex !== null) ? <button
              className={classnames([buttonStyles.button, buttonStyles._filled])}
              onClick={this.onAreaUpdate}
            >
              Done
            </button >
            :
            <button
              className={classnames([buttonStyles.button, buttonStyles._filled])}
              onClick={this.onAreaSave}
            >Save</button >
          }
        </div >
      </div >
    );
  }
}

AreasForm.propTypes = {
  setDrawingMode: PropTypes.func.isRequired,
  saveAreaOfInterest: PropTypes.func.isRequired,
  setEditAreaIndex: PropTypes.func.isRequired,
  updateAreaOfInterest: PropTypes.func.isRequired,
  updateWorkingAreaOfInterest: PropTypes.func.isRequired,
  isDrawing: PropTypes.bool.isRequired,
  editAreaIndex: PropTypes.number,
  editingArea: PropTypes.object.isRequired,
  areas: PropTypes.array.isRequired
};

export default AreasForm;
