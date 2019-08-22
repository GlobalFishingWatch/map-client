import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Timebar, { TimebarActivity } from '@globalfishingwatch/map-components/components/timebar'
import {
  TIMELINE_MINIMUM_RANGE,
  TIMELINE_MINIMUM_RANGE_UNIT,
  TIMELINE_MAXIMUM_RANGE,
  TIMELINE_MAXIMUM_RANGE_UNIT,
} from '../../config'

const TimebarWrapper = ({
  start,
  end,
  absoluteStart,
  absoluteEnd,
  update,
  updateOver,
  activity,
}) => {
  const [bookmark, setBookmark] = useState({ start: null, end: null })
  return (
    <Timebar
      enablePlayback
      start={start}
      end={end}
      absoluteStart={absoluteStart}
      absoluteEnd={absoluteEnd}
      bookmarkStart={bookmark.start}
      bookmarkEnd={bookmark.end}
      minimumRange={TIMELINE_MINIMUM_RANGE}
      minimumRangeUnit={TIMELINE_MINIMUM_RANGE_UNIT}
      maximumRange={TIMELINE_MAXIMUM_RANGE}
      maximumRangeUnit={TIMELINE_MAXIMUM_RANGE_UNIT}
      onChange={update}
      onMouseMove={updateOver}
      onBookmarkChange={(bookmarkStart, bookmarkEnd) => {
        setBookmark({
          start: bookmarkStart,
          end: bookmarkEnd,
        })
      }}
    >
      {(props) =>
        activity !== null && <TimebarActivity key="activity" {...props} activity={activity} />
      }
    </Timebar>
  )
}

TimebarWrapper.propTypes = {
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  absoluteStart: PropTypes.string.isRequired,
  absoluteEnd: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  updateOver: PropTypes.func.isRequired,
  activity: PropTypes.array,
}

TimebarWrapper.defaultProps = {
  activity: null,
}

export default TimebarWrapper
