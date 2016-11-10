import React, { Component } from 'react';

// import hightlightWord from '../../util/highlightWord';
import searchPanelStyles from '../../../styles/components/map/c-search-panel.scss';

class SearchResult extends Component {

  onDrawVessel(event) {
    const target = event.target.closest('li');

    this.props.drawVessel(target, this.props.vesselInfo);
    this.props.toggleVisibility(!this.props.vesselVisibility);
  }

  hightlightWord(strReplace, str, styleClass) {
    const regX = new RegExp(strReplace, 'i');
    const hightlight = `<span class="${styleClass}">${strReplace.toUpperCase()}</span>`;

    return str.replace(regX, hightlight);
  }

  render() {
    const vesselName = this.props.vesselInfo.vesselname;
    const MMSI = this.props.vesselInfo.mmsi;
    const highlightName = this.hightlightWord(this.props.keyword, vesselName, searchPanelStyles.highlight);
    const highlightMMSI = this.hightlightWord(this.props.keyword, MMSI, searchPanelStyles.highlight);

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
  toggleVisibility: React.PropTypes.func,
  setVesselPosition: React.PropTypes.func,
  vesselInfo: React.PropTypes.object,
  vesselVisibility: React.PropTypes.bool
};

export default SearchResult;
