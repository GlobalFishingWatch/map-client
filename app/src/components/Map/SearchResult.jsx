import React, { Component } from 'react';
import searchPanelStyles from 'styles/components/map/c-search-panel.scss';

class SearchResult extends Component {

  onDrawVessel() {
    this.props.drawVessel(this.props.vesselInfo);
  }

  highlightWord(strReplace, str, styleClass) {
    const regX = new RegExp(strReplace, 'i');
    const highlight = `<span class="${styleClass}">${strReplace.toUpperCase()}</span>`;

    return str.replace(regX, highlight);
  }

  render() {
    const vesselName = this.props.vesselInfo.vesselname;
    const MMSI = this.props.vesselInfo.mmsi;
    const highlightName = this.highlightWord(this.props.keyword, vesselName, searchPanelStyles.highlight);
    const highlightMMSI = this.highlightWord(this.props.keyword, MMSI, searchPanelStyles.highlight);

    return (
      <li
        className={searchPanelStyles.result}
        onClick={(event) => { this.onDrawVessel(event); }}
      >
        <span
          className={searchPanelStyles['vessel-name']}
          dangerouslySetInnerHTML={{ __html: highlightName }}
        />
        <span
          className={searchPanelStyles.mmsi}
          dangerouslySetInnerHTML={{ __html: `, ${highlightMMSI}` }}
        />
      </li>
    );
  }
}

SearchResult.propTypes = {
  drawVessel: React.PropTypes.func,
  keyword: React.PropTypes.string,
  vesselInfo: React.PropTypes.object
};

export default SearchResult;
