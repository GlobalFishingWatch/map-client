import PropTypes from 'prop-types';
/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import ResultListStyles from 'styles/search/result-list.scss';

class SearchResult extends Component {

  onDrawVessel() {
    this.props.drawVessel(this.props.vesselInfo);
    this.props.closeSearch();
  }

  highlightWord(strReplace, str) {
    const regX = new RegExp(strReplace, 'i');
    const highlight = `<span class="${ResultListStyles.highlight}">${strReplace.toUpperCase()}</span>`;

    return str.replace(regX, highlight);
  }

  render() {
    const title = this.props.vesselInfo.title;
    const MMSI = (this.props.vesselInfo.mmsi !== undefined && this.props.vesselInfo.mmsi === title) ? '' : this.props.vesselInfo.mmsi;
    const highlightName = this.highlightWord(this.props.searchTerm, title);
    const highlightMMSI = this.highlightWord(this.props.searchTerm, MMSI);

    return (
      <li
        className={this.props.className}
        onClick={(event) => {
          this.onDrawVessel(event);
        }}
      >
        <span
          dangerouslySetInnerHTML={{ __html: highlightName }}
          className={ResultListStyles.mainResultLabel}
        />
        {MMSI &&
        <span
          dangerouslySetInnerHTML={{ __html: highlightMMSI }}
          className={ResultListStyles.subResultLabel}
        />}
      </li >
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
