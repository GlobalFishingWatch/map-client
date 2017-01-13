import React, { Component } from 'react';
import classnames from 'classnames';
import SearchResult from 'containers/Map/SearchResult';

import iconsStyles from 'styles/icons.scss';
import searchPanelStyles from 'styles/components/map/c-search-panel.scss';

import CloseIcon from 'babel!svg-react!assets/icons/close.svg?name=CloseIcon';

class SearchPanel extends Component {

  constructor(props) {
    super(props);

    this.defaults = {
      characterLimit: 3
    };

    this.state = {
      keyword: '', searching: false
    };
  }

  componentWillReceiveProps() {
    this.setState({ searching: false });
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.searchField.focus();
    }
  }

  onSearchInputChange(event) {
    const keyword = event.target.value;

    this.setState({ keyword, searching: keyword.length >= this.defaults.characterLimit });
    this.props.getSearchResults(keyword, { immediate: !keyword.length });
  }

  onBlur() {
    document.querySelector('body').style.height = '100%';
  }

  setBodyHeight() {
    document.querySelector('body').style.height = `${window.innerHeight}px`;
  }

  cleanResults() {
    this.setState({ keyword: '' });
    this.props.getSearchResults('', { immediate: true });
  }

  render() {
    const isSearching = this.props.search.count || this.state.keyword.length > this.defaults.characterLimit;

    let searchResults;
    if (this.state.searching) {
      searchResults = <li className={searchPanelStyles.result}>Searching...</li>;
    } else if (this.props.search.count && this.state.keyword.length >= this.defaults.characterLimit) {
      searchResults = [];
      for (let i = 0, length = this.props.search.entries.length; i < length; i++) {
        searchResults.push(<SearchResult
          className={searchPanelStyles.result}
          key={i}
          keyword={this.state.keyword}
          vesselInfo={this.props.search.entries[i]}
        />);
      }
    } else if (this.state.keyword.length < this.defaults.characterLimit && this.state.keyword.length > 0) {
      searchResults = (
        <li className={searchPanelStyles.result}>
          Type at least {this.defaults.characterLimit} characters
        </li>);
    } else if (this.state.keyword.length === 0) {
      searchResults = null;
    } else {
      searchResults = <li className={searchPanelStyles.result}>No result</li>;
    }

    return (
      <div className={searchPanelStyles['c-search-panel']}>
        <input
          type="text"
          onBlur={this.onBlur}
          onChange={(e) => this.onSearchInputChange(e)}
          onFocus={this.setBodyHeight}
          className={searchPanelStyles['search-accordion']}
          placeholder="Type your search criteria"
          value={this.state.keyword}
          ref={ref => (this.searchField = ref)}
        />
        {!!isSearching && <CloseIcon
          className={classnames(iconsStyles.icon, 'icon-close')}
          onClick={() => this.cleanResults()}
        />}
        <ul
          className={classnames(searchPanelStyles['result-list'], searchPanelStyles['-open'])}
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
  visible: React.PropTypes.bool
};

export default SearchPanel;
