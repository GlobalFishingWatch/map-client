import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import platform from 'platform';
import ColorPicker from 'components/Shared/ColorPicker';
import Checkbox from 'components/Shared/Checkbox';
import ModalStyles from 'styles/components/map/modal.scss';
import ButtonStyles from 'styles/components/button.scss';
import ItemList from 'styles/components/map/item-list.scss';
import IconStyles from 'styles/icons.scss';
import SelectorStyles from 'styles/components/shared/selector.scss';
import WarningStyles from 'styles/components/shared/warning.scss';
import InfoIcon from '-!babel-loader!svg-react-loader!assets/icons/info.svg?name=InfoIcon';

class FilterGroupForm extends Component {

  componentWillReceiveProps(nextProps) {
    // if defaultLabel generated in container changed,
    // and if user did not changed from the default label (label is the same as the previously generated label)
    // force trigger a label change with the generated name
    if (this.props.defaultLabel !== nextProps.defaultLabel &&
        this.props.label === this.props.defaultLabel) {
      this.props.onLabelChanged(nextProps.defaultLabel);
    }
  }

  onClickInfo(layer) {
    this.props.openLayerInfoModal({
      open: true,
      info: layer
    });
  }

  renderLayersList() {
    return this.props.layers.map((layer, i) => (
      <li
        className={classnames([ItemList.listItem, ItemList._baseline])}
        key={i}
      >
        <Checkbox
          classNames="-spaced"
          key={layer.id}
          id={`${layer.id}${layer.title}`}
          label={layer.title}
          labelClassNames={ModalStyles.itemTitle}
          callback={() => this.props.onLayerChecked(layer.id)}
          checked={layer.filterActivated}
        />
        <ul className={classnames([ItemList.itemOptionList, ItemList._inlineList])} >
          <li
            className={ItemList.itemOptionItem}
            onClick={() => this.onClickInfo(layer)}
          >
            <InfoIcon className={IconStyles.infoIcon} />
          </li >
        </ul >
      </li >
    ));
  }

  renderFilterOptions(filter) {
    let options = [<option key={filter.id} value="" >{filter.label}</option>];

    const supportsEmojiFlags =
      ['iOS', 'OS X'].indexOf(platform.os.family) > -1 ||
      platform.os.toString().match('Windows 10');

    if (filter.values) {
      options = options.concat(
        filter.values.map((option) => {
          const label = (supportsEmojiFlags && option.icon !== undefined) ? `${option.label} ${option.icon}` : option.label;
          return <option key={option.id} value={option.id} >{label}</option>;
        })
      );
    }

    return options;
  }

  renderFiltersList() {
    return this.props.filters.map((filter, index) => (
      <div key={index} className={classnames(SelectorStyles.selector, SelectorStyles._big)} >
        <select
          key={index}
          name={filter.label}
          value={this.props.currentlyEditedFilterGroup.filterValues[filter.id]}
          onChange={e => this.props.onFilterValueChanged(filter.id, e.target.value)}
        >
          {this.renderFilterOptions(filter)}
        </select>
      </div>
    ));
  }


  render() {
    const layersList = this.renderLayersList();
    const filtersList = this.renderFiltersList();
    return (
      <div>
        <h3 className={ModalStyles.title}>Filter Group</h3>
        <div className={ModalStyles.optionsContainer}>
          {this.props.help}
        </div>
        {this.props.warning &&
          <div className={classnames(ModalStyles.warning, WarningStyles.warning)}>
            ⚠️ {this.props.warning}
          </div>
        }
        <div className={ModalStyles.optionsContainer}>
          <div className={ModalStyles.column}>
            <div className={ModalStyles.wrapper}>
              <div className={ModalStyles.sectionTitle}>
                <strong>1.</strong>Apply filters to these layers:
              </div>
              <div className={ItemList.wrapper}>
                <ul>
                  {layersList}
                </ul>
              </div>
            </div>
            <div className={ModalStyles.wrapper}>
              <ColorPicker
                id={'filter-color'}
                color={this.props.currentlyEditedFilterGroup.color}
                onColorChange={this.props.onColorChanged}
              />
            </div>
          </div>
          <div className={ModalStyles.column}>
            <div className={ModalStyles.wrapper}>
              <div className={ModalStyles.sectionTitle}>
                <strong>2.</strong>On the layers selected, show only:
              </div>
              {filtersList}
            </div>
            <div className={ModalStyles.wrapper}>
              <div className={ModalStyles.sectionTitle}>
                <label htmlFor="name" >Name</label>
              </div >
              <input
                type="text"
                name="name"
                onChange={(event) => { this.props.onLabelChanged(event.target.value); }}
                className={ModalStyles.nameInput}
                placeholder="Filter Group Name"
                value={this.props.label}
              />
            </div>
          </div>
        </div>
        <div className={ModalStyles.footerContainer}>
          <button
            className={classnames(
              ButtonStyles.button, ButtonStyles._filled,
              ButtonStyles._big, ModalStyles.mainButton, {
                [ButtonStyles._disabled]: this.props.disableSave
              })}
            onClick={this.props.onSaveClicked}
          >
            Save
          </button>
        </div>
      </div>
    );
  }
}

FilterGroupForm.propTypes = {
  layers: PropTypes.array,
  currentlyEditedFilterGroup: PropTypes.object,
  filters: PropTypes.array,
  defaultLabel: PropTypes.string,
  label: PropTypes.string,
  disableSave: PropTypes.bool,
  onLayerChecked: PropTypes.func,
  onColorChanged: PropTypes.func,
  onFilterValueChanged: PropTypes.func,
  onLabelChanged: PropTypes.func,
  onSaveClicked: PropTypes.func,
  openLayerInfoModal: PropTypes.func,
  help: PropTypes.string,
  warning: PropTypes.string
};

export default FilterGroupForm;
