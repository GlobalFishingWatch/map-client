import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { maxBy } from 'lodash'
import TimebarWrapper from 'app/timebar/components/TimebarWrapper'
import { setInnerTimelineDates, setTimelineHoverDates } from 'app/filters/filtersActions'
import { loadOuterRangeFromInnerRange } from 'app/timebar/timebarActions'
import { setTrackCurrentFeatureGraph } from 'app/tracks/tracksActions'

const getInnerExtent = (state) => state.filters.timelineInnerExtent
const getOverallExtent = (state) => state.filters.timelineOverallExtent
const getChartData = (state) => state.timebar.chartData
const getVessels = (state) => state.vesselInfo.vessels
const getTracks = (state) => state.tracks.tracks
const getTracksCurrentFeature = (state) => state.tracks.currentFeature

const getStart = createSelector(
  [getInnerExtent],
  (innerExtent) => innerExtent[0].toISOString()
)
const getEnd = createSelector(
  [getInnerExtent],
  (innerExtent) => innerExtent[1].toISOString()
)
const getAbsoluteStart = createSelector(
  [getOverallExtent],
  (overallExtent) => overallExtent[0].toISOString()
)
const getAbsoluteEnd = createSelector(
  [getOverallExtent],
  (overallExtent) => overallExtent[1].toISOString()
)
const getActivity = createSelector(
  [getChartData],
  (chartData) => {
    if (chartData === undefined || chartData === null || !chartData.length) return null
    const maxValueItem = maxBy(chartData, (d) => d.value)
    const finalChartData = chartData.map((d) => ({
      ...d,
      value: d.value / maxValueItem.value,
    }))
    return [finalChartData]
  }
)
const getGeoJSONTracksData = createSelector(
  [getTracks, getVessels],
  (tracks, vessels) => {
    const geoJSONTracks = []
    Object.keys(tracks).forEach((id) => {
      const vessel = vessels.find((v) => v.id === id)
      if (vessel !== undefined && (vessel.visible === true || vessel.shownInInfoPanel === true)) {
        geoJSONTracks.push({ ...tracks[id], color: vessel.color })
      }
    })
    return geoJSONTracks
  }
)

const getTrackFeatureGraph = createSelector(
  [getGeoJSONTracksData, getTracksCurrentFeature],
  (visibleAndLoadedTracks, currentFeature) => {
    if (currentFeature !== null && visibleAndLoadedTracks.length === 1) {
      const segments = visibleAndLoadedTracks[0].featureSegments
      const segmentsWithCurrentFeature = segments.map((segment) =>
        segment.map((item) => ({
          ...item,
          value: item[`${currentFeature}s`],
        }))
      )
      return {
        segmentsWithCurrentFeature,
        color: visibleAndLoadedTracks[0].color,
      }
    }
    return null
  }
)

const getAvailableFeatureGraphs = createSelector(
  [getGeoJSONTracksData],
  (visibleAndLoadedTracks) => {
    if (visibleAndLoadedTracks.length === 1) {
      return visibleAndLoadedTracks[0].availableFeatures
    }
    return null
  }
)

const mapStateToProps = (state) => ({
  start: getStart(state),
  end: getEnd(state),
  absoluteStart: getAbsoluteStart(state),
  absoluteEnd: getAbsoluteEnd(state),
  activity: getActivity(state),
  tracks: getGeoJSONTracksData(state),
  featureGraph: getTrackFeatureGraph(state),
  currentFeature: getTracksCurrentFeature(state),
  availableFeatures: getAvailableFeatureGraphs(state),
  hoverExtent: state.filters.timelineOverExtent,
})

const mapDispatchToProps = (dispatch) => ({
  update: (start, end) => {
    dispatch(setInnerTimelineDates([new Date(start), new Date(end)]))
    dispatch(loadOuterRangeFromInnerRange())
  },
  updateOver: (clientX, scale) => {
    if (clientX === null) {
      // this.setState({
      //   hoverStart: null,
      //   hoverEnd: null,
      // })
      return
    }
    const hoverStart = scale(clientX - 10)
    const hoverEnd = scale(clientX + 10)
    dispatch(setTimelineHoverDates([hoverStart, hoverEnd]))
  },
  setTrackCurrentFeatureGraph: (featureGraph) => {
    dispatch(setTrackCurrentFeatureGraph(featureGraph === 'none' ? null : featureGraph))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimebarWrapper)
