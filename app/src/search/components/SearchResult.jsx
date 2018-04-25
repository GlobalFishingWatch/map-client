import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import ResultListStyles from 'styles/search/result-list.scss';

class SearchResult extends Component {

  onDrawVessel() {
    this.props.drawVessel(this.props.vesselInfo);
    this.props.closeSearch();
  }

  renderLine(searchTerm, lineText) {
    const searchTermWords = searchTerm.toUpperCase().split(' ');
    const lineTextWords = lineText.split(' ');
    return (
      <span className={ResultListStyles.mainResultLabel}>
        {lineTextWords.map((lineWord, i) => (
          <span
            key={`res${i}`}
            className={classnames({ [ResultListStyles.highlight]: searchTermWords.indexOf(lineWord) > -1 })}
          >
            {lineWord}{' '}
          </span>
        ))}
      </span>
    );
  }

  render() {
    const title = this.props.vesselInfo.title;
    const MMSI = (
      this.props.vesselInfo.mmsi === undefined ||
      (this.props.vesselInfo.mmsi !== undefined && this.props.vesselInfo.mmsi === title)
    ) ? '' : this.props.vesselInfo.mmsi;

    return (
      <li
        className={this.props.className}
        onClick={(event) => {
          this.onDrawVessel(event);
        }}
      >
        {this.renderLine(this.props.searchTerm, title)}
        {MMSI && this.renderLine(this.props.searchTerm, MMSI)}
      </li>
    );
  }
}

SearchResult.propTypes = {
  className: PropTypes.string,
  closeSearch: PropTypes.func,
  drawVessel: PropTypes.func,
  searchTerm: PropTypes.string,
  vesselInfo: PropTypes.object
};

export default SearchResult;
