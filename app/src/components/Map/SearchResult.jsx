/* eslint-disable react/no-danger */

import React, { Component } from 'react';
import ResultListStyles from 'styles/components/shared/c-result-list.scss';

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
    const vesselName = this.props.vesselInfo.vesselname;
    const MMSI = this.props.vesselInfo.mmsi;
    const highlightName = this.highlightWord(this.props.keyword, vesselName);
    const highlightMMSI = this.highlightWord(this.props.keyword, MMSI);

    return (
      <li
        className={this.props.className}
        onClick={(event) => { this.onDrawVessel(event); }}
      >
        <span
          dangerouslySetInnerHTML={{ __html: highlightName }}
        />
        <span
          dangerouslySetInnerHTML={{ __html: `, ${highlightMMSI}` }}
        />
      </li>
    );
  }
}

SearchResult.propTypes = {
  className: React.PropTypes.string,
  closeSearch: React.PropTypes.func,
  drawVessel: React.PropTypes.func,
  keyword: React.PropTypes.string,
  vesselInfo: React.PropTypes.object
};

export default SearchResult;
