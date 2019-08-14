import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Timebar from '@globalfishingwatch/map-components/components/timebar'

class TimebarWrapper extends Component {
  render() {
    const { start, end, absoluteStart, absoluteEnd, update } = this.props
    // return <div>hello timebar</div>
    return (
      <Timebar
        enablePlayback
        start={start}
        end={end}
        absoluteStart={absoluteStart}
        absoluteEnd={absoluteEnd}
        // bookmarkStart={bookmarkStart}
        // bookmarkEnd={bookmarkEnd}
        onChange={update}
        // onMouseMove={this.onMouseMove}
        // onBookmarkChange={this.updateBookmark}
      />
    )
  }
}

TimebarWrapper.propTypes = {
  // timebarChartData: PropTypes.array,
  // updateInnerTimelineDates: PropTypes.func.isRequired,
  // updateOuterTimelineDates: PropTypes.func.isRequired,
  // updatePlayingStatus: PropTypes.func.isRequired,
  // updateTimelineOverDates: PropTypes.func.isRequired,
  // rewind: PropTypes.func.isRequired,
  // changeSpeed: PropTypes.func.isRequired,
  // timelineOverallExtent: PropTypes.array,
  // timelineOuterExtent: PropTypes.array,
  // timelineInnerExtent: PropTypes.array,
  // timelinePaused: PropTypes.bool,
  // timelineSpeed: PropTypes.number.isRequired,
}
export default TimebarWrapper
