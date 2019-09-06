import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import Timebar, {
  TimebarActivity,
  TimebarTracks,
  TimebarHighlighter,
  getHumanizedDates,
} from '@globalfishingwatch/map-components/components/timebar'
import {
  TIMELINE_MINIMUM_RANGE,
  TIMELINE_MINIMUM_RANGE_UNIT,
  TIMELINE_MAXIMUM_RANGE,
  TIMELINE_MAXIMUM_RANGE_UNIT,
} from '../../config'
import {
  humanRange,
  graphSelector,
  graphSelectorSelect,
  graphSelectorArrow,
} from './timebar.module.scss'
import Icon from 'app/components/Shared/Icon'

const TRACK_FEATURES_UNITS = {
  course: 'degrees',
  speed: 'knots',
}

const getHoverExtent = (hoverExtent) => {
  return {
    hoverStart: hoverExtent[0].toISOString(),
    hoverEnd: hoverExtent[1].toISOString(),
  }
}

const TimebarWrapper = ({
  start,
  end,
  absoluteStart,
  absoluteEnd,
  update,
  updateOver,
  hoverExtent,
  activity,
  tracks,
  featureGraph,
  setTrackCurrentFeatureGraph,
  currentFeature,
  availableFeatures,
}) => {
  const [bookmark, setBookmark] = useState({ start: null, end: null })
  const { humanizedStart, humanizedEnd, interval } = useMemo(() => getHumanizedDates(start, end), [
    start,
    end,
  ])
  const hasTracks = tracks !== null && tracks.length
  const { hoverStart, hoverEnd } = useMemo(() => getHoverExtent(hoverExtent), [hoverExtent])
  return (
    <>
      <div className={humanRange}>
        {humanizedStart} - {humanizedEnd} ({interval} days)
      </div>
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
        {(props) => (
          <>
            {!hasTracks && activity !== null && (
              <TimebarActivity key="activity" {...props} activity={activity} />
            )}
            {hasTracks && <TimebarTracks key="tracks" {...props} tracks={tracks} />}
            {featureGraph && (
              <TimebarActivity
                {...props}
                key="trackActivity"
                color={featureGraph.color}
                opacity={0.4}
                curve="curveBasis"
                activity={featureGraph.segmentsWithCurrentFeature}
              />
            )}
            <TimebarHighlighter
              {...props}
              hoverStart={hoverStart}
              hoverEnd={hoverEnd}
              activity={featureGraph && featureGraph.segmentsWithCurrentFeature}
              unit={currentFeature && TRACK_FEATURES_UNITS[currentFeature]}
            />
          </>
        )}
      </Timebar>

      {availableFeatures && availableFeatures.length && (
        <div className={graphSelector}>
          <select
            className={graphSelectorSelect}
            onChange={(event) => {
              setTrackCurrentFeatureGraph(event.target.value)
            }}
            value={currentFeature === null ? '' : currentFeature}
            disabled={tracks.length > 1}
          >
            <option value="none">chart...</option>
            {availableFeatures.map((feature) => (
              <option key={feature} value={feature}>
                {feature}
              </option>
            ))}
          </select>
          <div className={graphSelectorArrow}>
            <Icon icon="graph" />
          </div>
        </div>
      )}
    </>
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
  tracks: PropTypes.array,
  hoverExtent: PropTypes.array.isRequired,
  featureGraph: PropTypes.shape({
    segmentsWithCurrentFeature: PropTypes.array,
    color: PropTypes.string,
  }),
  setTrackCurrentFeatureGraph: PropTypes.func.isRequired,
  currentFeature: PropTypes.string,
  availableFeatures: PropTypes.arrayOf(PropTypes.string),
}

TimebarWrapper.defaultProps = {
  activity: null,
  tracks: null,
  featureGraph: null,
  currentFeature: null,
  availableFeatures: null,
}

export default TimebarWrapper
