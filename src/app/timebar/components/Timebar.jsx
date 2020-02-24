import PropTypes from 'prop-types'
// ye who enter here, fear not
// this is the first time I used D3, please dont hate me
/* eslint react/sort-comp:0 */
/* eslint import/no-extraneous-dependencies:0 */
import React, { Component } from 'react'
import { event as d3event, select as d3select } from 'd3-selection'
import {
  timeDay as d3timeDay,
  timeMonth as d3timeMonth,
  timeWeek as d3timeWeek,
  timeYear as d3timeYear,
} from 'd3-time'
import { timeFormat as d3timeFormat } from 'd3-time-format'
import { scaleTime as d3scaleTime, scaleLinear as d3scaleLinear } from 'd3-scale'
import { axisTop as d3axisTop } from 'd3-axis'
import { area as d3area } from 'd3-shape'
import { max as d3max } from 'd3-array'
import { brushX as d3brushX } from 'd3-brush'

import classnames from 'classnames'
import { TIMELINE_MAX_TIME, TIMELINE_MIN_TIME, MIN_FRAME_LENGTH_MS } from 'app/config'
import TimebarStyles from 'styles/components/map/timebar.module.scss'
import TimelineStyles from 'styles/components/map/timeline.module.scss'
import extentChanged from 'app/utils/extentChanged'
import DatePicker from 'app/timebar/components/DatePicker'
import TogglePauseButton from 'app/timebar/components/TogglePauseButton'
import SpeedButton from 'app/timebar/components/SpeedButton'
import DurationPicker from 'app/timebar/components/DurationPicker'

let width
let height
let leftOffset
let x
let y
let xAxis
let area
const INNER_OUTER_MARGIN_PX = 10
const X_OVERFLOW_OFFSET = 16

let currentInnerPxExtent = [0, 1]
let currentOuterPxExtent = [0, width]
let currentHandleIsWest
let dragging
let lastTimestamp

let brush
let outerBrushHandleLeft
let outerBrushHandleRight
let innerBrushLeftCircle
let innerBrushRightCircle
let innerBrushMiddle

const customTickFormat = (date, index, allDates) => {
  let format
  if (d3timeDay(date) < date) {
    format = '%I %p'
  } else if (d3timeMonth(date) < date) {
    format = d3timeWeek(date) < date ? '%a %d' : '%b %d'
  } else if (d3timeYear(date) < date) {
    if (index === 0) {
      format = '%b %Y'
    } else {
      format = allDates.length >= 15 || window.innerWidth < 1024 ? '%b' : '%B'
    }
  } else {
    format = '%Y'
  }
  return d3timeFormat(format)(date)
}

class Timebar extends Component {
  constructor(props) {
    super(props)

    this.onStartDatePickerChange = this.onStartDatePickerChange.bind(this)
    this.onEndDatePickerChange = this.onEndDatePickerChange.bind(this)
    this.onPauseToggle = this.onPauseToggle.bind(this)
    this.onMouseOver = this.onMouseOver.bind(this)
    this.state = {
      innerExtentPx: [0, 100], // used only by durationPicker
      durationPickerExtent: props.timelineInnerExtent,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.timebarChartData.length && !this.props.timebarChartData.length) {
      this.build(nextProps.timebarChartData)
    }

    if (!nextProps.timelineOuterExtent || !nextProps.timelineInnerExtent) {
      return
    }

    // depending on whether state (outerExtent) or props (innerExtent) have been updated, we'll do different things
    const newInnerExtent = nextProps.timelineInnerExtent
    this.setState({
      durationPickerExtent: newInnerExtent,
    })
    if (extentChanged(this.props.timelineInnerExtent, newInnerExtent)) {
      this.redrawInnerBrush(newInnerExtent)
    }

    const currentOuterExtent = this.props.timelineOuterExtent
    const newOuterExtent = nextProps.timelineOuterExtent

    if (extentChanged(currentOuterExtent, newOuterExtent)) {
      this.redrawOuterBrush(newOuterExtent, currentOuterExtent)
    }
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.timelinePaused !== nextProps.timelinePaused) {
      this.togglePause(nextProps.timelinePaused)
    }
  }

  componentWillUnmount() {
    if (!this.svg) return
    if (outerBrushHandleLeft) {
      outerBrushHandleLeft.on('mousedown', null)
      outerBrushHandleRight.on('mousedown', null)
    }
    d3select('body').on('mousemove', null)
    d3select('body').on('mouseup', null)
    if (this.innerBrushFunc) {
      this.innerBrushFunc.on('end', null)
    }
  }

  tickCounter() {
    if (window.innerWidth < 767) {
      return 6
    }
    return null
  }

  build(chartData) {
    const container = d3select('#timeline_svg_container')
    const computedStyles = window.getComputedStyle(container.node())
    leftOffset = container.node().offsetLeft

    width = parseInt(computedStyles.width, 10) - 50
    height = parseInt(computedStyles.height, 10)

    x = d3scaleTime().range([0, width])
    y = d3scaleLinear().range([height, 0])
    xAxis = d3axisTop()
      .scale(x)
      .ticks(this.tickCounter())
      .tickFormat(customTickFormat)

    // define the way the timeline chart is going to be drawn
    area = d3area()
      .x((d) => x(d.date))
      .y0(height)
      .y1((d) => y(d.value))
    x.domain(this.props.timelineOverallExtent)
    y.domain([0, d3max(chartData.map((d) => d.value))])

    this.svg = container
      .append('svg')
      .attr('width', width + 34)
      .attr('height', height)

    this.group = this.svg.append('g').attr('transform', `translate(${X_OVERFLOW_OFFSET}, 0)`)

    this.group
      .append('path')
      .datum(chartData)
      .attr('class', TimelineStyles.timelineArea)
      .attr('d', area)

    // set up brush generators
    brush = () =>
      d3brushX().extent([
        [0, 0],
        [width, height],
      ])

    try {
      this.innerBrushFunc = brush()

      this.innerBrush = this.group
        .append('g')
        .attr('class', TimelineStyles.timelineInnerBrush)
        .call(this.innerBrushFunc)

      outerBrushHandleLeft = this.createOuterHandle()
      outerBrushHandleRight = this.createOuterHandle()

      this.innerBrush.select('.overlay').remove()

      this.innerBrush
        .select('.selection')
        .attr('height', height)
        .classed(TimelineStyles.timelineInnerBrushSelection, true)

      const innerBrushCircles = this.innerBrush
        .append('g')
        .classed(TimelineStyles.timelineInnerBrushCircles, true)

      innerBrushLeftCircle = innerBrushCircles.append('circle')
      innerBrushRightCircle = innerBrushCircles.append('circle')
      innerBrushCircles
        .selectAll('circle')
        .attr('cy', height / 2)
        .attr('r', 5)
        .classed(TimelineStyles.timelineInnerBrushCircle, true)

      innerBrushMiddle = this.innerBrush
        .append('g')
        .classed(TimelineStyles.timelineInnerBrushMiddle, true)
      innerBrushMiddle.append('path').attr('d', `M 0 0 L 0 ${height}`)
      innerBrushMiddle
        .append('circle')
        .attr('r', 5)
        .attr('cy', height / 2)
        .classed(TimelineStyles.timelineInnerBrushCircle, true)

      // Create month ticks for xAxis
      this.group
        .append('g')
        .attr('class', TimelineStyles.timelineXAxis)
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)

      // Add label for the timeline
      const label = this.group
        .append('g')
        .attr('class', TimelineStyles.timelineLabel)
        .append('text')

      label
        .append('tspan')
        .attr('x', '0')
        .text('Fishing')

      label
        .append('tspan')
        .attr('x', '0')
        .attr('y', '15px')
        .text('hours')

      // move both brushes to initial position
      this.resetOuterBrush()
      this.redrawInnerBrush(this.props.timelineInnerExtent)

      // custom outer brush events
      outerBrushHandleLeft.on('mousedown', this.onOuterHandleClick.bind(this))
      outerBrushHandleRight.on('mousedown', this.onOuterHandleClick.bind(this))

      this.group.on('mousemove', () => {
        this.onMouseOver(d3event.offsetX)
      })

      this.group.on('mouseout', () => {
        this.onMouseOut()
      })

      d3select('body').on('mousemove', () => {
        if (dragging) {
          const nx = d3event.pageX - leftOffset - X_OVERFLOW_OFFSET
          if (currentHandleIsWest) {
            currentOuterPxExtent[0] = nx
          } else {
            currentOuterPxExtent[1] = nx
          }
        }
      })

      d3select('body').on('mouseup', () => {
        dragging = false
        if (this.isZoomingIn(currentOuterPxExtent)) {
          // release, actually do the zoom in (when zooming out this is done at each tick)
          this.setOuterExtent(currentOuterPxExtent)
        }
        this.resetOuterBrush()
        this.enableInnerBrush()
      })

      this.enableInnerBrush()
    } catch (e) {
      console.error(e)
    }
  }

  createOuterHandle() {
    const handle = this.group.append('g').classed(TimelineStyles.timelineOuterBrushHandle, true)

    handle.append('path').attr('d', `M0 0 V ${height}`)

    handle
      .append('rect')
      .attr('y', height / 2)
      .attr('x', 0)

    return handle
  }

  onOuterHandleClick() {
    if (!this.props.timelinePaused) {
      this.props.updatePlayingStatus(true)
    }
    d3event.preventDefault()
    currentHandleIsWest = outerBrushHandleLeft.node() === d3event.currentTarget
    dragging = true
    this.disableInnerBrush()
    this.startTick()
  }

  setOuterExtent(outerExtentPx) {
    const outerExtent = this.getNewOuterExtent(outerExtentPx)

    this.props.updateOuterTimelineDates(outerExtent)
  }

  getNewOuterExtent(newOuterPxExtent) {
    // use the new x scale to compute new time values
    // do not get out of total range for outer brush
    const propsTimelineOverallExtent = this.props.timelineOverallExtent
    const newOuterTimeLeft = x.invert(newOuterPxExtent[0])
    const newOuterTimeRight = x.invert(newOuterPxExtent[1])
    const isAfterOverallStartDate =
      newOuterTimeLeft.getTime() > propsTimelineOverallExtent[0].getTime()
    const isBeforeOverallEndDate =
      newOuterTimeRight.getTime() < propsTimelineOverallExtent[1].getTime()
    const newOuterTimeExtentLeft = isAfterOverallStartDate
      ? newOuterTimeLeft
      : propsTimelineOverallExtent[0]
    const newOuterTimeExtentRight = isBeforeOverallEndDate
      ? newOuterTimeRight
      : propsTimelineOverallExtent[1]
    return [newOuterTimeExtentLeft, newOuterTimeExtentRight]
  }

  resetOuterBrush() {
    currentOuterPxExtent = [0, width]
    outerBrushHandleLeft.attr('transform', 'translate(0,0)')
    outerBrushHandleRight.attr('transform', `translate(${width - 2}, 0)`)
  }

  redrawOuterBrush(newOuterExtent, currentOuterExtent) {
    const newOuterPxExtent = [x(newOuterExtent[0]), x(newOuterExtent[1])]
    const isLargerThanBefore =
      currentOuterExtent === undefined ||
      newOuterPxExtent[0] < x(currentOuterExtent[0]) ||
      newOuterPxExtent[1] > x(currentOuterExtent[1])

    // grab inner time extent before changing x scale
    const prevInnerTimeExtent = [
      x.invert(currentInnerPxExtent[0]),
      x.invert(currentInnerPxExtent[1]),
    ]

    const newOuterTimeExtent = this.getNewOuterExtent(newOuterPxExtent)
    x.domain(newOuterTimeExtent)

    // redraw components
    this.group
      .select(`.${TimelineStyles.timelineArea}`)
      .transition()
      .duration(isLargerThanBefore ? 0 : 500)
      .attr('d', area)
    this.group
      .select(`.${TimelineStyles.timelineXAxis}`)
      .transition()
      .duration(isLargerThanBefore ? 0 : 500)
      .call(xAxis)

    // calculate new inner extent, using old inner extent on new x scale
    this.redrawInnerBrush(prevInnerTimeExtent)

    this.svg
      .selectAll('g.tick text')
      .classed(TimelineStyles.timelineFullYear, function isFullYear() {
        return this.textContent.match(/^\d{4}$/)
      })

    return newOuterTimeExtent
  }

  onInnerBrushMoved() {
    let newExtentPx = d3event.selection
    const newExtent = this.getExtent(d3event.selection)

    const maxTimeRange =
      window.extendedMaxTimeRange === true ? TIMELINE_MAX_TIME * 4 : TIMELINE_MAX_TIME

    // time range is too long
    if (newExtent[1].getTime() - newExtent[0].getTime() > maxTimeRange) {
      const oldExtent = this.props.timelineInnerExtent

      if (oldExtent[0].getTime() === newExtent[0].getTime()) {
        // right brush was moved
        newExtent[1] = new Date(oldExtent[0].getTime() + maxTimeRange)
      } else {
        // left brush was moved
        newExtent[0] = new Date(oldExtent[1].getTime() - maxTimeRange)
      }
      newExtentPx = this.getPxExtent(newExtent)
      this.redrawInnerBrush(newExtent)
    }
    // time range is too short
    if (newExtent[1].getTime() - newExtent[0].getTime() < TIMELINE_MIN_TIME) {
      const oldExtent = this.props.timelineInnerExtent

      if (oldExtent[0].getTime() === newExtent[0].getTime()) {
        // right brush was moved
        newExtent[1] = new Date(oldExtent[0].getTime() + TIMELINE_MIN_TIME)
      } else {
        // left brush was moved
        newExtent[0] = new Date(oldExtent[1].getTime() - TIMELINE_MIN_TIME)
      }
      newExtentPx = this.getPxExtent(newExtent)
      this.redrawInnerBrush(newExtent)
    }

    this.setState({
      durationPickerExtent: newExtent,
    })
    this.redrawInnerBrushCircles(newExtentPx)
    this.redrawDurationPicker(newExtentPx)

    this.props.updateInnerTimelineDates(newExtent)

    if (!this.props.timelinePaused) {
      this.props.updatePlayingStatus(true)
    }
  }

  redrawInnerBrush(newInnerExtent) {
    if (this.innerBrushFunc) {
      currentInnerPxExtent = this.getPxExtent(newInnerExtent)
      // prevent d3 from dispatching brush events that are not user-initiated
      this.disableInnerBrush()
      this.innerBrushFunc.move(this.innerBrush, currentInnerPxExtent)
      this.redrawInnerBrushCircles(currentInnerPxExtent)
      this.redrawDurationPicker(currentInnerPxExtent)
      this.enableInnerBrush()
    }
  }

  redrawInnerBrushCircles(newInnerPxExtent) {
    innerBrushLeftCircle.attr('cx', newInnerPxExtent[0])
    innerBrushRightCircle.attr('cx', newInnerPxExtent[1])
    const middle = newInnerPxExtent[0] + (newInnerPxExtent[1] - newInnerPxExtent[0]) / 2
    innerBrushMiddle.attr('transform', `translate(${middle}, 0)`)
  }

  redrawDurationPicker(newInnerPxExtent) {
    this.setState({
      innerExtentPx: newInnerPxExtent,
    })
  }

  disableInnerBrush() {
    if (this.innerBrushFunc) {
      this.innerBrushFunc.on('brush', null)
      this.innerBrushFunc.on('end', null)
    }
  }

  enableInnerBrush() {
    if (this.innerBrushFunc) {
      this.innerBrushFunc.on('brush', this.onInnerBrushMoved.bind(this))
    }
  }

  getExtent(extentPx) {
    return [x.invert(extentPx[0]), x.invert(extentPx[1])]
  }

  getPxExtent(extent) {
    return [x(extent[0]), x(extent[1])]
  }

  isZoomingIn(outerExtentPx) {
    return outerExtentPx[0] > 0 || outerExtentPx[1] < width
  }

  isZoomingOut(outerExtentPx) {
    return outerExtentPx[0] < 0 || outerExtentPx[1] > width
  }

  zoomIn(outerExtentPx) {
    const extent = outerExtentPx
    // do not go within the inner brush
    if (currentHandleIsWest) {
      extent[0] = Math.min(currentInnerPxExtent[0] - INNER_OUTER_MARGIN_PX, outerExtentPx[0])
    } else {
      extent[1] = Math.max(currentInnerPxExtent[1] + INNER_OUTER_MARGIN_PX, outerExtentPx[1])
    }

    outerBrushHandleLeft.attr('transform', `translate(${extent[0]}, 0)`)
    outerBrushHandleRight.attr('transform', `translate(${extent[1] - 2}, 0)`)
  }

  zoomOut(outerExtentPx, deltaTick) {
    // get prev offset
    const extent = [outerExtentPx[0], outerExtentPx[1]]

    // get delta
    let deltaOffset = currentHandleIsWest ? outerExtentPx[0] : outerExtentPx[1] - width
    deltaOffset *= deltaOffset * deltaTick * 0.003

    if (currentHandleIsWest) {
      extent[0] = -deltaOffset
    } else {
      extent[1] = width + deltaOffset
    }

    this.setOuterExtent(extent)
  }

  startTick() {
    window.requestAnimationFrame(this.onTick.bind(this))
  }

  onTick(timestamp) {
    if (!lastTimestamp) {
      lastTimestamp = timestamp
    }
    const deltaTick = timestamp - lastTimestamp
    lastTimestamp = timestamp

    if (!this.props.timelinePaused) {
      this.playStep(deltaTick)
    }
    if (dragging) {
      const outerExtentPx = currentOuterPxExtent
      if (this.isZoomingIn(outerExtentPx)) {
        this.zoomIn(outerExtentPx)
      } else if (this.isZoomingOut(outerExtentPx)) {
        this.zoomOut(outerExtentPx, deltaTick)
      }
    }

    if (dragging || !this.props.timelinePaused) {
      window.requestAnimationFrame(this.onTick.bind(this))
    }
  }

  getPlayStep(outerExtent) {
    const outerExtentDelta = outerExtent[1].getTime() - outerExtent[0].getTime()
    return outerExtentDelta / 50000
  }

  togglePause(pause) {
    if (!pause) {
      this.startTick()
    }
  }

  /**
   * @param deltaTick frame length in ms
   */
  playStep(deltaTick) {
    // compute new basePlayStep (used for playback), because we want it to depend on the zoom levels
    const playStep = this.getPlayStep(this.props.timelineOuterExtent)
    const realtimePlayStep =
      Math.max(MIN_FRAME_LENGTH_MS, playStep * deltaTick) * this.props.timelineSpeed
    const previousInnerExtent = this.props.timelineInnerExtent
    let offsetInnerExtent = previousInnerExtent.map((d) => new Date(d.getTime() + realtimePlayStep))
    const endOfTime = this.props.timelineOuterExtent[1]
    const isAtEndOfTime = x(offsetInnerExtent[1]) >= x(endOfTime)

    // if we're at the end of time, just stop playing
    if (isAtEndOfTime) {
      const innerExtentDelta = offsetInnerExtent[1].getTime() - offsetInnerExtent[0].getTime()
      offsetInnerExtent = [new Date(endOfTime.getTime() - innerExtentDelta), endOfTime]
      this.props.updatePlayingStatus(true)
    }

    this.props.updateInnerTimelineDates(offsetInnerExtent)
  }

  onStartDatePickerChange(startDate) {
    this.props.updateOuterTimelineDates([startDate, this.props.timelineOuterExtent[1]], true)
  }

  onEndDatePickerChange(endDate) {
    this.props.updateOuterTimelineDates([this.props.timelineOuterExtent[0], endDate], false)
  }

  onPauseToggle() {
    const playStep = this.getPlayStep(this.props.timelineOuterExtent)
    const realTimePlayStep = Math.max(MIN_FRAME_LENGTH_MS, playStep) * this.props.timelineSpeed
    const offsetInnerExtent = this.props.timelineInnerExtent.map(
      (d) => new Date(d.getTime() + realTimePlayStep)
    )
    const endOfTime = this.props.timelineOuterExtent[1]
    const isAtEndOfTime = x(offsetInnerExtent[1]) >= x(endOfTime)

    if (isAtEndOfTime) {
      this.props.rewind()
    }

    lastTimestamp = null
    const paused = !this.props.timelinePaused
    this.props.updatePlayingStatus(paused)
  }

  onMouseOver(offsetX) {
    const timelineOverExtent = this.getExtent([
      offsetX - X_OVERFLOW_OFFSET - 5,
      offsetX - X_OVERFLOW_OFFSET + 5,
    ])
    this.props.updateTimelineOverDates(timelineOverExtent)
  }

  onMouseOut() {
    this.props.updateTimelineOverDates([new Date(0), new Date(0)])
  }

  onTimeRangeSelected(rangeTimeMs) {
    let currentStartDate = this.props.timelineInnerExtent[0]
    let nextEndDate = new Date(currentStartDate.getTime() + rangeTimeMs)

    // if the predefined range time selection overrides timebar limits...
    if (this.props.timelineOuterExtent[1] < nextEndDate) {
      nextEndDate = this.props.timelineOuterExtent[1]
      currentStartDate = new Date(nextEndDate.getTime() - rangeTimeMs)
    }

    const newExtentPx = this.getPxExtent([currentStartDate, nextEndDate])
    this.redrawInnerBrushCircles(newExtentPx)

    const newExtent = this.getExtent(newExtentPx)
    this.redrawInnerBrush(newExtent)

    this.props.updateInnerTimelineDates(newExtent)
  }

  render() {
    const {
      changeSpeed,
      timelinePaused,
      timelineOuterExtent,
      timelineOverallExtent,
      timelineSpeed,
    } = this.props
    const { durationPickerExtent, innerExtentPx } = this.state
    return (
      <div className={TimebarStyles.timebar}>
        <SpeedButton speed={timelineSpeed} changeSpeed={changeSpeed} decrease />
        <div className={classnames(TimebarStyles.timebarElement, TimebarStyles.timebarPlayback)}>
          <TogglePauseButton onToggle={this.onPauseToggle} paused={timelinePaused} />
        </div>
        <SpeedButton speed={timelineSpeed} changeSpeed={changeSpeed} />
        <div className={classnames(TimebarStyles.timebarElement, TimebarStyles.timebarDatepicker)}>
          <DatePicker
            selected={timelineOuterExtent && timelineOuterExtent[0]}
            onChange={this.onStartDatePickerChange}
            minDate={timelineOverallExtent && timelineOverallExtent[0]}
            maxDate={timelineOverallExtent && timelineOverallExtent[1]}
            label={'start'}
          />
        </div>
        <div
          className={classnames(TimebarStyles.timebarElement, TimelineStyles.timeline)}
          id="timeline_svg_container"
        >
          <DurationPicker
            extent={durationPickerExtent}
            extentPx={innerExtentPx}
            timelineOuterExtent={timelineOuterExtent}
            onTimeRangeSelected={(rangeTime) => this.onTimeRangeSelected(rangeTime)}
          />
        </div>
        <div className={classnames(TimebarStyles.timebarElement, TimebarStyles.timebarDatepicker)}>
          <DatePicker
            selected={timelineOuterExtent && timelineOuterExtent[1]}
            onChange={this.onEndDatePickerChange}
            minDate={timelineOverallExtent && timelineOverallExtent[0]}
            maxDate={timelineOverallExtent && timelineOverallExtent[1]}
            label={'end'}
            calendarPosition={'upLeftCalendar'}
          />
        </div>
      </div>
    )
  }
}

Timebar.propTypes = {
  timebarChartData: PropTypes.array,
  updateInnerTimelineDates: PropTypes.func.isRequired,
  updateOuterTimelineDates: PropTypes.func.isRequired,
  updatePlayingStatus: PropTypes.func.isRequired,
  updateTimelineOverDates: PropTypes.func.isRequired,
  rewind: PropTypes.func.isRequired,
  changeSpeed: PropTypes.func.isRequired,
  timelineOverallExtent: PropTypes.array,
  timelineOuterExtent: PropTypes.array,
  timelineInnerExtent: PropTypes.array,
  timelinePaused: PropTypes.bool,
  timelineSpeed: PropTypes.number.isRequired,
}
export default Timebar
