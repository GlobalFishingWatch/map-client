import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { maxBy } from 'lodash'
import TimebarWrapper from 'app/timebar/components/TimebarWrapper'
import { setInnerTimelineDates, setTimelineHoverDates } from 'app/filters/filtersActions'
import { loadOuterRangeFromInnerRange } from 'app/timebar/timebarActions'

const getInnerExtent = (state) => state.filters.timelineInnerExtent
const getOverallExtent = (state) => state.filters.timelineOverallExtent
const getChartData = (state) => state.timebar.chartData
const getVessels = (state) => state.vesselInfo.vessels
const getTracks = (state) => state.tracks.tracks

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

const mapStateToProps = (state) => ({
  start: getStart(state),
  end: getEnd(state),
  absoluteStart: getAbsoluteStart(state),
  absoluteEnd: getAbsoluteEnd(state),
  activity: getActivity(state),
  tracks: getGeoJSONTracksData(state),
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
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimebarWrapper)
