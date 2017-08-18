import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import InfoIcon from '-!babel-loader!svg-react-loader!assets/icons/info-icon.svg?name=InfoIcon';
import ColorPicker from 'components/Shared/ColorPicker';
import ModalStyles from 'styles/components/map/modal.scss';
import ButtonStyles from 'styles/components/map/button.scss';
import ItemList from 'styles/components/map/item-list.scss';
import Checkbox from 'components/Shared/Checkbox';

class FilterGroupForm extends Component {

  renderLayersList() {
    return this.props.layers.map((layer, i) => (
      <li
        className={ItemList.listItem}
        key={layer.title}
      >
        <Checkbox
          classNames="-spaced"
          key={`${i}${layer.title}`}
          id={`${i}${layer.title}`}
          label={layer.title}
          callback={() => this.state.checkLayer} // TODO
          checked={layer.checked} // TODO
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
                Filter by:
              </div >
            </div >
            <div className={ModalStyles.wrapper} >
              <div className={ModalStyles.sectionTitle} >
                <label htmlFor="name">Name</label>
              </div >
              <input
                type="text"
                name="name"
                onChange={e => this.onNameChange(e)}
                className={ModalStyles.nameInput}
                placeholder="Insert filter group name"
                value={name}
              />
            </div >
          </div >
          <div className={ModalStyles.column} >
            <div className={ModalStyles.wrapper} >
              <div className={ModalStyles.sectionTitle} >
                Select a Fishing Layer:
              </div >
              <div className={ItemList.wrapper} >
                <ul >
                  {layersList}
                </ul >
              </div >
            </div >
            <div className={ModalStyles.wrapper} >
              <ColorPicker color={'orange'} onColorChange={this.onColorChange} />
            </div >
          </div >
        </div >
        <div className={ModalStyles.footerContainer} >
          <button
            className={classnames(ButtonStyles.button, ButtonStyles._filled,
              ButtonStyles._big, ModalStyles.mainButton)}
            onClick={() => this.props.createFilterGroup()}
          >
            Save
          </button >
        </div >
      </div >
    );
  }
}

FilterGroupForm.propTypes = {
  layers: PropTypes.array,
  createFilterGroup: PropTypes.func
};

export default FilterGroupForm;
