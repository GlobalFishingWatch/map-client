import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _includes from 'lodash/includes';
import _pullAllWith from 'lodash/pullAllWith';
import _uniqBy from 'lodash/uniqBy';
import classnames from 'classnames';
import InfoIcon from '-!babel-loader!svg-react-loader!assets/icons/info.svg?name=InfoIcon';
import ColorPicker from 'components/Shared/ColorPicker';
import ModalStyles from 'styles/components/map/modal.scss';
import ButtonStyles from 'styles/components/button.scss';
import ItemList from 'styles/components/map/item-list.scss';
import IconStyles from 'styles/icons.scss';
import selectorStyles from 'styles/components/shared/selector.scss';
import Checkbox from 'components/Shared/Checkbox';
import getCountryOptions from 'util/getCountryOptions';
import { FLAGS } from 'constants';
import { COLORS } from 'config';
import { getCountry } from 'iso-3166-1-alpha-2';

class FilterGroupForm extends Component {
  constructor(props) {
    super(props);

    this.onColorChange = this.onColorChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onPressSave = this.onPressSave.bind(this);

    const checkedLayers = {};
    props.layers.forEach((layer) => {
      checkedLayers[layer.id] = layer.visible;
    });

    const filterGroup = Object.assign({}, {
      checkedLayers,
      color: Object.keys(COLORS)[props.defaultColorIndex],
      label: '',
      visible: true,
      filterValues: {}
    }, props.filterGroup);

    this.state = { filterGroup, autoGenLabel: filterGroup.label === '' };
  }

  onLayerChecked(layerId) {
    const filterGroup = this.state.filterGroup;
    filterGroup.checkedLayers[layerId] = !filterGroup.checkedLayers[layerId];

    this.setState({ filterGroup });
  }

  onColorChange(color) {
    const filterGroup = this.state.filterGroup;
    filterGroup.color = color;
    this.setState({ filterGroup });
  }

  onNameChange(event) {
    const filterGroup = this.state.filterGroup;
    filterGroup.label = event.target.value;
    this.setState({ filterGroup, autoGenLabel: event.target.value === '' });
  }

  onFilterValueChange(name, value) {
    const filterGroup = this.state.filterGroup;
    if (value === '') {
      delete filterGroup.filterValues[name];
    } else {
      filterGroup.filterValues[name] = parseInt(value, 10);
    }

    this.setState({ filterGroup });

    if (this.state.autoGenLabel) {
      this.genFilterName();
    }
  }

  onPressSave() {
    this.props.saveFilterGroup(this.state.filterGroup, this.props.editFilterGroupIndex);
  }

  genFilterName() {
    const checkedLayersId = Object.keys(this.state.filterGroup.checkedLayers)
      .filter(elem => this.state.filterGroup.checkedLayers[elem] === true);

    const layersToFilter = this.props.layers.filter(layer =>
      _includes(checkedLayersId, layer.id) && layer.header.filters
    );

    const filtersFromLayers = layersToFilter.map(layer => layer.header.filters);
    const flattenedFilters = [].concat(...filtersFromLayers);
    const uniqueFiltersFromLayers = [];

    // obscure logic that looks for filters with the same id and merges their values into a single filter
    while (flattenedFilters.length > 0) {
      const key = flattenedFilters[0];
      const matches = flattenedFilters.filter(elem => elem.id === key.id);
      const values = [];

      matches.forEach((match) => {
        if (match.values) values.push(...match.values);
      });
      const uniqValues = _uniqBy(values, e => e.id);

      key.values = uniqValues;
      uniqueFiltersFromLayers.push(key);

      _pullAllWith(flattenedFilters, [key], (a, b) => (a.id === b.id));
    }

    // const uniqueFiltersFromLayers = _uniqBy(flattenedFilters, e => e.label);

    const selectedFilters = uniqueFiltersFromLayers.filter(filter => filter.field in this.state.filterGroup.filterValues);

    const selectedFilterValues = selectedFilters.map((filter) => {
      let value;

      if (filter.field === 'category' && filter.useDefaultValues === true) {
        value = getCountry(FLAGS[this.state.filterGroup.filterValues[filter.field]]);
      } else {
        const filterSetting = filter.values.find(elem => elem.id === parseInt(this.state.filterGroup.filterValues[filter.field], 10));
        value = filterSetting ? filterSetting.label : '';
      }

      return value;
    });

    const filterGroup = this.state.filterGroup;
    filterGroup.label = selectedFilterValues.join(' ');

    this.setState({ filterGroup });
  }

  onClickInfo(layer) {
    const modalParams = {
      open: true,
      info: layer
    };

    this.props.openLayerInfoModal(modalParams);
  }

  getOptions(filter) {
    const compareById = (a, b) => (a.id < b.id ? -1 : 1);
    let options = [<option key={filter.id} value="" >{filter.label}</option >];
    if (filter.values) {
      options = options.concat(
        filter.values.sort(compareById).map(option => (
          <option key={option.id} value={option.id} >{option.label}</option >
        ))
      );
    } else {
      console.warn('No values for filter', filter);
    }
    return options;
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
          callback={() => this.onLayerChecked(layer.id)}
          checked={this.state.filterGroup.checkedLayers[layer.id]}
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

  renderFilterList() {
    const checkedLayersId = Object.keys(this.state.filterGroup.checkedLayers)
      .filter(elem => this.state.filterGroup.checkedLayers[elem] === true);

    const layersToFilter = this.props.layers.filter(layer =>
      _includes(checkedLayersId, layer.id) && layer.header.filters
    );

    const filtersFromLayers = layersToFilter.map(layer => layer.header.filters);
    const flattenedFilters = [].concat(...filtersFromLayers);
    const uniqueFiltersFromLayers = [];

    // obscure logic that looks for filters with the same id and merges their values into a single filter
    while (flattenedFilters.length > 0) {
      const key = flattenedFilters[0];
      const matches = flattenedFilters.filter(elem => elem.id === key.id);
      const values = [];

      matches.forEach((match) => {
        if (match.values) values.push(...match.values);
      });
      const uniqValues = _uniqBy(values, e => e.id);

      key.values = uniqValues;
      uniqueFiltersFromLayers.push(key);

      _pullAllWith(flattenedFilters, [key], (a, b) => (a.id === b.id));
    }

    const filterInputs = uniqueFiltersFromLayers.map((filter, index) => (
      <div key={index} className={classnames(selectorStyles.selector, selectorStyles._big)} >
        <select
          key={index}
          name={filter.label}
          onChange={e => this.onFilterValueChange(filter.field, e.target.value)}
          value={this.state.filterGroup.filterValues[filter.field]}
        >
          {filter.field === 'category' && filter.useDefaultValues === true ? getCountryOptions() : this.getOptions(filter)}
        </select >
      </div >
    ));

    return (
      <div >
        {filterInputs}
      </div >
    );
  }

  render() {
    const layersList = this.renderLayersList();

    const filterGroup = this.state.filterGroup;
    const anyLayerChecked = Object.keys(filterGroup.checkedLayers).some(key => filterGroup.checkedLayers[key] === true);
    const anyFilterSelected = Object.keys(filterGroup.filterValues).length > 0;
    const disableSave = anyLayerChecked === false || anyFilterSelected === false;

    return (
      <div >
        <h3 className={ModalStyles.title}>Filter Group</h3>
        <div className={ModalStyles.optionsContainer} >
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
              <ColorPicker id={'filter-color'} color={this.state.filterGroup.color} onColorChange={this.onColorChange} />
            </div >
          </div >
          <div className={ModalStyles.column} >
            <div className={ModalStyles.wrapper} >
              <div className={ModalStyles.sectionTitle} >
                Filter by:
              </div >
              {this.renderFilterList()}
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
                placeholder="Filter Group Name"
                value={this.state.filterGroup.label}
              />
            </div >
          </div >
        </div >
        <div className={ModalStyles.footerContainer} >
          <button
            className={classnames(
              ButtonStyles.button, ButtonStyles._filled,
              ButtonStyles._big, ModalStyles.mainButton, {
                [ButtonStyles._disabled]: disableSave
              })}
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
  saveFilterGroup: PropTypes.func,
  openLayerInfoModal: PropTypes.func.isRequired,
  defaultColorIndex: PropTypes.number
};

export default FilterGroupForm;
