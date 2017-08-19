import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import InfoIcon from '-!babel-loader!svg-react-loader!assets/icons/info.svg?name=InfoIcon';
import ColorPicker from 'components/Shared/ColorPicker';
import ModalStyles from 'styles/components/map/modal.scss';
import ButtonStyles from 'styles/components/map/button.scss';
import ItemList from 'styles/components/map/item-list.scss';
import Checkbox from 'components/Shared/Checkbox';

class FilterGroupForm extends Component {
  constructor(props) {
    super(props);

    this.onColorChange = this.onColorChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onPressSave = this.onPressSave.bind(this);

    this.state = Object.assign({}, {
      checkedLayers: props.layers.map(layer => layer.visible),
      color: 'yellow', // TODO: use a random color here
      label: '',
      visible: true
    }, props.filterGroup);
  }

  onLayerChecked(index) {
    const newCheckedLayersState = _.clone(this.state.checkedLayers);
    newCheckedLayersState[index] = !newCheckedLayersState[index];
    this.setState({ checkedLayers: newCheckedLayersState });
  }

  onColorChange(color) {
    this.setState({ color });
  }

  onNameChange(event) {
    this.setState({ label: event.target.value });
  }

  onPressSave() {
    this.props.saveFilterGroup(this.state, this.props.editFilterGroupIndex);
  }

  renderLayersList() {
    return this.props.layers.map((layer, index) => (
      <li
        className={ItemList.listItem}
        key={layer.title}
      >
        <Checkbox
          classNames="-spaced"
          key={index}
          id={`${index}${layer.title}`}
          label={layer.title}
          labelClassNames={ModalStyles.itemTitle}
          callback={() => this.onLayerChecked(index)}
          checked={this.state.checkedLayers[index]}
        />
        <ul className={ItemList.itemOptionList} >
          <li
            className={ItemList.itemOptionItem}
            onClick={() => this.onClickInfo(layer)}
          >
            <InfoIcon />
          </li >
        </ul >
      </li >
    ));
  }

  render() {
    const layersList = this.renderLayersList();

    return (
      <div >
        <h3 className={ModalStyles.title} >Filter Group</h3 >
        <div className={ModalStyles.optionsContainer} >
          <div className={ModalStyles.column} >
            <div className={ModalStyles.wrapper} >
              <div className={ModalStyles.sectionTitle} >
                Select the Fishing Layers:
              </div >
              <div className={ItemList.wrapper} >
                <ul >
                  {layersList}
                </ul >
              </div >
            </div >
            <div className={ModalStyles.wrapper} >
              <ColorPicker color={this.state.color} onColorChange={this.onColorChange} />
            </div >
          </div >
          <div className={ModalStyles.column} >
            <div className={ModalStyles.wrapper} >
              <div className={ModalStyles.sectionTitle} >
                Filter by:
              </div >
            </div >
            <div className={ModalStyles.wrapper} >
              <div className={ModalStyles.sectionTitle} >
                <label htmlFor="name" >Name</label >
              </div >
              <input
                type="text"
                name="name"
                onChange={this.onNameChange}
                className={ModalStyles.nameInput}
                placeholder="Filter group name"
                value={this.state.label}
              />
            </div >
          </div >
        </div >
        <div className={ModalStyles.footerContainer} >
          <button
            className={classnames(ButtonStyles.button, ButtonStyles._filled,
              ButtonStyles._big, ModalStyles.mainButton)}
            onClick={this.onPressSave}
          >
            Save
          </button >
        </div >
      </div >
    );
  }
}

FilterGroupForm.propTypes = {
  editFilterGroupIndex: PropTypes.number,
  layers: PropTypes.array,
  filterGroup: PropTypes.object,
  saveFilterGroup: PropTypes.func
};

export default FilterGroupForm;
