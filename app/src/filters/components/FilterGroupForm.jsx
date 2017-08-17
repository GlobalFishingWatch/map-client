import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import InfoIcon from '-!babel-loader!svg-react-loader!assets/icons/info-icon.svg?name=InfoIcon';
import ModalStyles from 'styles/components/map/modal.scss';
import ButtonStyles from 'styles/components/map/button.scss';
import ItemList from 'styles/components/map/item-list.scss';
import Toggle from '../../components/Shared/Toggle';

class FilterGroupForm extends Component {

  renderLayersList() {
    return this.props.layers.map(layer => (
      <li
        className={ItemList.listItem}
        key={layer.title}
      >
        <label >
          <Toggle
            on={layer.added}
            hue={layer.hue}
            onToggled={() => this.onChange(layer)}
          />
          <span className={ItemList.itemTitle} >
            {layer.title}
          </span >
        </label >
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
        <div className={ItemList.wrapper} >
          <ul >
            {layersList}
          </ul >
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
