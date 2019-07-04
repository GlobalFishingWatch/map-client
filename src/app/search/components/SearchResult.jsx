import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classnames from 'classnames'
import ResultListStyles from 'styles/search/result-list.module.scss'

class SearchResult extends Component {
  onDrawVessel() {
    this.props.drawVessel(this.props.vesselInfo)
    this.props.closeSearch()
  }

  renderLine(searchTerm, lineText) {
    const fragments = lineText.split(new RegExp(searchTerm, 'gi'))
    const allFragments = []
    fragments.forEach((fragment, i) => {
      if (fragment !== '') {
        allFragments.push(fragment)
      }
      if (fragment === '' && i < fragments.length - 1) {
        allFragments.push(searchTerm)
      }
      if (fragment !== '' && i < fragments.length - 1) {
        allFragments.push(searchTerm)
      }
    })

    return (
      <span className={ResultListStyles.mainResultLabel}>
        {allFragments.map((fragment, i) => (
          <span
            key={`res${i}`}
            className={classnames({
              [ResultListStyles.highlight]: fragment === searchTerm,
            })}
          >
            {fragment}
          </span>
        ))}
      </span>
    )
  }

  render() {
    const { vesselInfo, searchTerm, className } = this.props
    const title = vesselInfo.title
    const MMSI =
      vesselInfo.mmsi === undefined || (vesselInfo.mmsi !== undefined && vesselInfo.mmsi === title)
        ? ''
        : vesselInfo.mmsi

    return (
      <li
        className={className}
        onClick={(event) => {
          this.onDrawVessel(event)
        }}
      >
        {this.renderLine(searchTerm, title)}
        From layer: {vesselInfo.layerTitle}
        {MMSI && this.renderLine(searchTerm, MMSI)}
      </li>
    )
  }
}

SearchResult.propTypes = {
  className: PropTypes.string.isRequired,
  closeSearch: PropTypes.func.isRequired,
  drawVessel: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  vesselInfo: PropTypes.object.isRequired,
}

export default SearchResult
