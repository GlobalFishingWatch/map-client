import React, { Component } from 'react';
import classnames from 'classnames';
import _ from 'lodash';

import SearchResult from './SearchResult';
import iconsStyles from '../../../styles/icons.scss';
import searchPanelStyles from '../../../styles/components/map/c-search-panel.scss';

class SearchPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isEmpty: true,
      search: this.props.search
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!!nextProps.search) {
      this.setState({ search: nextProps.search });
    }
  }

  onSearchInputChange(event) {
    this.keyword = event.target.value;

    this.setState({
      isEmpty: !this.keyword.length > 0,
      firsTime: false
    });

    if (this.keyword.length < 3) return;

    this.props.getSearchResults(this.keyword);
  }

  cleanResults() {
    this.state.search.entries = [];
    this.setState(this.state);
  }

  render() {
    const searchResults = [];
    const throttleSearchEvent = _.throttle(this.onSearchInputChange, 50);

    if (this.state.search) {
      for (let i = 0, length = this.state.search.entries.length; i < length; i++) {
        searchResults.push(
          <SearchResult
            className={searchPanelStyles.result}
            key={i}
            keyword={this.keyword}
            drawVessel={this.props.drawVessel}
            vesselInfo={this.state.search.entries[i]}
            setVesselPosition={this.props.setVesselPosition}
            toggleVisibility={this.props.toggleVisibility}
            vesselVisibility={this.props.vesselVisibility}
          />
        );
      }
    }

    return (
      <div className={searchPanelStyles['c-search-panel']}>
        <input
          id="search-vessels"
          type="text"
          onChange={(e) => throttleSearchEvent.apply(this, [e])}
          className={searchPanelStyles['search-accordion']}
          placeholder="Type your search criteria"
        />
      {this.state.isEmpty &&
        <svg
          className={classnames(iconsStyles.icon, 'icon-search')}
        >
          <use xlinkHref="#icon-search"></use>
        </svg>}

      {!this.state.isEmpty &&
        <svg
          className={classnames(iconsStyles.icon, 'icon-filter')}
          onClick={() => this.cleanResults()}
        >
          <use xlinkHref="#icon-filter"></use>
        </svg>}
        <ul
          className={classnames(searchPanelStyles['result-list'],
          searchResults.length ? searchPanelStyles['-open'] : '')}
        >
          {searchResults}
        </ul>
      </div>);
  }
}

SearchPanel.propTypes = {
  drawVessel: React.PropTypes.func,
  getSearchResults: React.PropTypes.func,
  search: React.PropTypes.object,
  setVesselPosition: React.PropTypes.func,
  toggleVisibility: React.PropTypes.func,
  vesselVisibility: React.PropTypes.bool
};


export default SearchPanel;
