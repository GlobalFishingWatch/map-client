import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Timebar, { TimebarActivity } from '@globalfishingwatch/map-components/components/timebar'

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
