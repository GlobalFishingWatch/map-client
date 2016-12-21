/* eslint react/sort-comp:0 */
/* eslint react/sort-comp:0 */
import React, { Component } from 'react';
import * as d3 from 'd3'; // TODO: namespace and only do the necessary imports
import classnames from 'classnames';
import { TIMELINE_MAX_TIME, MIN_FRAME_LENGTH_MS } from 'constants';
import timebarCss from 'styles/components/map/c-timebar.scss';
import timelineCss from 'styles/components/map/c-timeline.scss';
import extentChanged from 'util/extentChanged';
import DatePicker from 'components/Map/DatePicker';
import TogglePauseButton from 'components/Map/TogglePauseButton';
import DurationPicker from 'components/Map/DurationPicker';
import moment from 'moment';

let width;
let height;
let leftOffset;
let x;
let y;
let xAxis;
let area;
const INNER_OUTER_MARGIN_PX = 10;
const X_OVERFLOW_OFFSET = 16;

let currentInnerPxExtent = [0, 1];
let currentOuterPxExtent = [0, width];
let currentHandleIsWest;
let dragging;
let lastTimestamp;

let brush;
let outerBrushHandleLeft;
let outerBrushHandleRight;
let innerBrushLeftCircle;
let innerBrushRightCircle;

const customTickFormat = (date, index, allDates) => {
  let format;
  if (d3.timeDay(date) < date) {
    format = '%I %p';
  } else if (d3.timeMonth(date) < date) {
    format = d3.timeWeek(date) < date ? '%a %d' : '%b %d';
  } else if (d3.timeYear(date) < date) {
    if (index === 0) {
      format = '%b %Y';
    } else {
      format = (allDates.length >= 15) ? '%b' : '%B';
    }
  } else {
    format = '%Y';
  }
  return d3.timeFormat(format)(date);
};

class Timebar extends Component {

  constructor(props) {
    super(props);
    this.onStartDatePickerChange = this.onStartDatePickerChange.bind(this);
    this.onEndDatePickerChange = this.onEndDatePickerChange.bind(this);
    this.onPauseToggle = this.onPauseToggle.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.state = {
      innerExtentPx: [0, 100],  // used only by durationPicker
      durationPickerExtent: props.filters.timelineInnerExtent
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.filters.timelineOuterExtent || !nextProps.filters.timelineInnerExtent) {
      return;
    }

    if (!this.svg) {
      this.build();
    }

    // depending on whether state (outerExtent) or props (innerExtent) have been updated, we'll do different things
    const newInnerExtent = nextProps.filters.timelineInnerExtent;
    this.setState({
      durationPickerExtent: newInnerExtent
    });
    if (extentChanged(this.props.filters.timelineInnerExtent, newInnerExtent)) {
      this.redrawInnerBrush(newInnerExtent);
    }

    const currentOuterExtent = this.props.filters.timelineOuterExtent;
    const newOuterExtent = nextProps.filters.timelineOuterExtent;

    if (extentChanged(currentOuterExtent, newOuterExtent)) {
      this.redrawOuterBrush(newOuterExtent, currentOuterExtent);
    }
  }

  componentWillUpdate(nextProps) {
    if (this.props.filters.timelinePaused !== nextProps.filters.timelinePaused) {
      this.togglePause(nextProps.filters.timelinePaused);
    }
  }

  componentWillUnmount() {
    if (!this.svg) return;

    outerBrushHandleLeft.on('mousedown', null);
    outerBrushHandleRight.on('mousedown', null);
    d3.select('body').on('mousemove', null);
    d3.select('body').on('mouseup', null);
    this.innerBrushFunc.on('end', null);
  }

  build() {
    const dummyData = this.getDummyData(
      this.props.filters.timelineOverallExtent[0],
      this.props.filters.timelineOverallExtent[1]
    );
    const computedStyles = window.getComputedStyle(document.getElementById('timeline_svg_container'));
    leftOffset = document.getElementById('timeline_svg_container').offsetLeft;
    width = parseInt(computedStyles.width, 10) - 50;
    height = parseInt(computedStyles.height, 10);
    const durationPickerHeight = Math.abs(parseInt(computedStyles.marginTop, 10));


    x = d3.scaleTime().range([0, width]);
    y = d3.scaleLinear().range([height, 0]);
    xAxis = d3.axisTop().scale(x)
      .tickFormat(customTickFormat);

    // define the way the timeline chart is going to be drawn
    area = d3.area()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.price));
    x.domain(this.props.filters.timelineOverallExtent);
    y.domain([0, d3.max(dummyData.map(d => d.price))]);

    this.svg = d3.select('#timeline_svg_container').append('svg')
      .attr('width', width + 34)
      .attr('height', height + durationPickerHeight);

    this.group = this.svg.append('g')
      .attr('transform', `translate(${X_OVERFLOW_OFFSET},${durationPickerHeight})`);

    this.group.append('path')
      .datum(dummyData)
      .attr('class', timelineCss['c-timeline-area'])
      .attr('d', area);

    this.group.append('g')
      .attr('class', timelineCss['c-timeline-x-axis'])
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    // set up brush generators
    brush = () => d3.brushX().extent([[0, 0], [width, height]]);
    this.innerBrushFunc = brush();

    this.innerBrush = this.group.append('g')
      .attr('class', timelineCss['c-timeline-inner-brush'])
      .call(this.innerBrushFunc);

    outerBrushHandleLeft = this.createOuterHandle();
    outerBrushHandleRight = this.createOuterHandle();

    this.innerBrush.select('.overlay').remove();
    // inner brush selection should cover duration picker
    this.innerBrush.select('.selection')
      .attr('y', - durationPickerHeight)
      .attr('height', height + durationPickerHeight)
      .classed(timelineCss['c-timeline-inner-brush-selection'], true);
    innerBrushLeftCircle = this.innerBrush.append('circle');
    innerBrushRightCircle = this.innerBrush.append('circle');
    this.innerBrush.selectAll('circle')
      .attr('cy', height / 2)
      .attr('r', 5)
      .classed(timelineCss['c-timeline-outer-brush-circle'], true);

    // move both brushes to initial position
    this.resetOuterBrush();
    this.redrawInnerBrush(this.props.filters.timelineInnerExtent);

    // custom outer brush events
    outerBrushHandleLeft.on('mousedown', this.onOuterHandleClick.bind(this));
    outerBrushHandleRight.on('mousedown', this.onOuterHandleClick.bind(this));

    this.group.on('mousemove', () => {
      this.onMouseOver(d3.event.offsetX);
    });
    this.group.on('mouseout', () => {
      this.onMouseOut();
    });

    d3.select('body').on('mousemove', () => {
      if (dragging) {
        const nx = d3.event.pageX - leftOffset - X_OVERFLOW_OFFSET;
        if (currentHandleIsWest) {
          currentOuterPxExtent[0] = nx;
        } else {
          currentOuterPxExtent[1] = nx;
        }
      }
    });
    d3.select('body').on('mouseup', () => {
      dragging = false;
      if (this.isZoomingIn(currentOuterPxExtent)) {
        // release, actually do the zoom in (when zooming out this is done at each tick)
        this.setOuterExtent(currentOuterPxExtent);
      }
      this.resetOuterBrush();
      this.enableInnerBrush();
    });

    this.enableInnerBrush();
  }

  createOuterHandle() {
    const handle = this.group.append('g')
      .classed(timelineCss['c-timeline-outer-brush-handle'], true);

    handle
      .append('path')
      .attr('d', `M0 0 V ${height}`);

    handle
      .append('rect')
      .attr('y', height / 2);

    return handle;
  }

  onOuterHandleClick() {
    d3.event.preventDefault();
    currentHandleIsWest = outerBrushHandleLeft.node() === d3.event.currentTarget;
    dragging = true;
    this.disableInnerBrush();
    this.startTick();
  }

  getDummyData(startDate, endDate) {
    const dummyData = [];
    for (let year = startDate.getFullYear(); year <= endDate.getFullYear(); year++) {
      const startMonth = (year === startDate.getFullYear()) ? startDate.getMonth() : 0;
      const endMonth = (year === endDate.getFullYear()) ? endDate.getMonth() : 11;

      for (let m = startMonth; m <= endMonth; m++) {
        const endDay = (m === endDate.getMonth()) ? endDate.getDate() : 28;
        for (let d = 2; d <= endDay; d += 4) {
          dummyData.push({
            date: new Date(year, m, d),
            price: Math.random()
          });
        }
      }
    }
    return dummyData;
  }

  setOuterExtent(outerExtentPx) {
    const outerExtent = this.getNewOuterExtent(outerExtentPx);

    this.props.updateOuterTimelineDates(outerExtent);
  }

  getNewOuterExtent(newOuterPxExtent) {
    // use the new x scale to compute new time values
    // do not get out of total range for outer brush
    const propsTimelineOverallExtent = this.props.filters.timelineOverallExtent;
    const newOuterTimeLeft = x.invert(newOuterPxExtent[0]);
    const newOuterTimeRight = x.invert(newOuterPxExtent[1]);
    const isAfterOverallStartDate = newOuterTimeLeft.getTime() > propsTimelineOverallExtent[0].getTime();
    const isBeforeOverallEndDate = newOuterTimeRight.getTime() < propsTimelineOverallExtent[1].getTime();
    const newOuterTimeExtentLeft = isAfterOverallStartDate ? newOuterTimeLeft : propsTimelineOverallExtent[0];
    const newOuterTimeExtentRight = isBeforeOverallEndDate ? newOuterTimeRight : propsTimelineOverallExtent[1];
    return [newOuterTimeExtentLeft, newOuterTimeExtentRight];
  }

  resetOuterBrush() {
    currentOuterPxExtent = [0, width];
    outerBrushHandleLeft.attr('transform', 'translate(0,0)');
    outerBrushHandleRight.attr('transform', `translate(${width - 2}, 0)`);
  }

  redrawOuterBrush(newOuterExtent, currentOuterExtent) {
    const newOuterPxExtent = [x(newOuterExtent[0]), x(newOuterExtent[1])];
    const isLargerThanBefore =
      currentOuterExtent === undefined ||
      newOuterPxExtent[0] < x(currentOuterExtent[0]) ||
      newOuterPxExtent[1] > x(currentOuterExtent[1]);

    // grab inner time extent before changing x scale
    const prevInnerTimeExtent = [x.invert(currentInnerPxExtent[0]), x.invert(currentInnerPxExtent[1])];

    const newOuterTimeExtent = this.getNewOuterExtent(newOuterPxExtent);
    x.domain(newOuterTimeExtent);

    // redraw components
    this.group.select(`.${timelineCss['c-timeline-area']}`).transition().duration(isLargerThanBefore ? 0 : 500)
      .attr('d', area);
    this.group.select(`.${timelineCss['c-timeline-x-axis']}`).transition().duration(isLargerThanBefore ? 0 : 500)
      .call(xAxis);

    // calculate new inner extent, using old inner extent on new x scale
    this.redrawInnerBrush(prevInnerTimeExtent);

    this.svg.selectAll('g.tick text')
      .classed(timelineCss['c-timeline-full-year'], function isFullYear() { return this.innerHTML.match(/^\d{4}$/); });

    return newOuterTimeExtent;
  }

  onInnerBrushReleased() {
    this.props.updateInnerTimelineDates(this.getExtent(d3.event.selection));
    this.props.updatePlayingStatus(true);
  }

  onInnerBrushMoved() {
    let newExtentPx = d3.event.selection;
    const newExtent = this.getExtent(d3.event.selection);

    // time range is too long
    if (newExtent[1].getTime() - newExtent[0].getTime() > TIMELINE_MAX_TIME) {
      const oldExtent = this.props.filters.timelineInnerExtent;

      if (oldExtent[0].getTime() === newExtent[0].getTime()) {
        // right brush was moved
        newExtent[1] = new Date(oldExtent[0].getTime() + TIMELINE_MAX_TIME);
      } else {
        // left brush was moved
        newExtent[0] = new Date(oldExtent[1].getTime() - TIMELINE_MAX_TIME);
      }
      newExtentPx = this.getPxExtent(newExtent);
      this.redrawInnerBrush(newExtent);
    }

    this.setState({
      durationPickerExtent: newExtent
    });
    this.redrawInnerBrushCircles(newExtentPx);
    this.redrawDurationPicker(newExtentPx);
  }

  redrawInnerBrush(newInnerExtent) {
    currentInnerPxExtent = this.getPxExtent(newInnerExtent);
    // prevent d3 from dispatching brush events that are not user-initiated
    this.disableInnerBrush();
    this.innerBrushFunc.move(this.innerBrush, currentInnerPxExtent);
    this.redrawInnerBrushCircles(currentInnerPxExtent);
    this.redrawDurationPicker(currentInnerPxExtent);
    this.enableInnerBrush();
  }

  redrawInnerBrushCircles(newInnerPxExtent) {
    innerBrushLeftCircle.attr('cx', newInnerPxExtent[0]);
    innerBrushRightCircle.attr('cx', newInnerPxExtent[1]);
  }

  redrawDurationPicker(newInnerPxExtent) {
    this.setState({
      innerExtentPx: newInnerPxExtent
    });
  }

  disableInnerBrush() {
    this.innerBrushFunc.on('brush', null);
    this.innerBrushFunc.on('end', null);
  }

  enableInnerBrush() {
    this.innerBrushFunc.on('brush', this.onInnerBrushMoved.bind(this));
    this.innerBrushFunc.on('end', this.onInnerBrushReleased.bind(this));
  }

  getExtent(extentPx) {
    return [x.invert(extentPx[0]), x.invert(extentPx[1])];
  }

  getPxExtent(extent) {
    return [x(extent[0]), x(extent[1])];
  }

  isZoomingIn(outerExtentPx) {
    return outerExtentPx[0] >= 0 && outerExtentPx[1] <= width;
  }

  zoomIn(outerExtentPx) {
    const extent = outerExtentPx;
    // do not go within the inner brush
    if (currentHandleIsWest) {
      extent[0] = Math.min(currentInnerPxExtent[0] - INNER_OUTER_MARGIN_PX, outerExtentPx[0]);
    } else {
      extent[1] = Math.max(currentInnerPxExtent[1] + INNER_OUTER_MARGIN_PX, outerExtentPx[1]);
    }

    outerBrushHandleLeft.attr('transform', `translate(${extent[0]}, 0)`);
    outerBrushHandleRight.attr('transform', `translate(${extent[1] - 2}, 0)`);
  }

  zoomOut(outerExtentPx, deltaTick) {
    // get prev offset
    const extent = [outerExtentPx[0], outerExtentPx[1]];

    // get delta
    let deltaOffset = (currentHandleIsWest) ? outerExtentPx[0] : outerExtentPx[1] - width;
    deltaOffset *= deltaOffset * deltaTick * 0.003;

    if (currentHandleIsWest) {
      extent[0] = -deltaOffset;
    } else {
      extent[1] = width + deltaOffset;
    }

    this.setOuterExtent(extent);
  }

  startTick() {
    window.requestAnimationFrame(this.onTick.bind(this));
  }

  onTick(timestamp) {
    if (!lastTimestamp) {
      lastTimestamp = timestamp;
    }
    const deltaTick = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    if (!this.props.filters.timelinePaused) {
      this.playStep(deltaTick);
    }
    if (dragging) {
      const outerExtentPx = currentOuterPxExtent;
      if (this.isZoomingIn(outerExtentPx)) {
        this.zoomIn(outerExtentPx);
      } else {
        this.zoomOut(outerExtentPx, deltaTick);
      }
    }

    if (dragging || !this.props.filters.timelinePaused) {
      window.requestAnimationFrame(this.onTick.bind(this));
    }
  }

  getPlayStep(outerExtent) {
    const outerExtentDelta = outerExtent[1].getTime() - outerExtent[0].getTime();
    return outerExtentDelta / 50000;
  }

  togglePause(pause) {
    if (!pause) {
      this.startTick();
    }
  }

  /**
   * @param deltaTick frame length in ms
   */
  playStep(deltaTick) {
    // compute new basePlayStep (used for playback), because we want it to depend on the zoom levels
    const playStep = this.getPlayStep(this.props.filters.timelineOuterExtent);
    const realtimePlayStep = Math.max(MIN_FRAME_LENGTH_MS, playStep * deltaTick);
    const previousInnerExtent = this.props.filters.timelineInnerExtent;
    let offsetInnerExtent = previousInnerExtent.map(d => new Date(d.getTime() + realtimePlayStep));
    const endOfTime = this.props.filters.timelineOuterExtent[1];
    const isAtEndOfTime = x(offsetInnerExtent[1]) >= x(endOfTime);


    // if we're at the end of time, just stop playing
    if (isAtEndOfTime) {
      const innerExtentDelta = offsetInnerExtent[1].getTime() - offsetInnerExtent[0].getTime();
      offsetInnerExtent = [new Date(endOfTime.getTime() - innerExtentDelta), endOfTime];
      this.props.updatePlayingStatus(true);
    }

    this.props.updateInnerTimelineDates(offsetInnerExtent);
  }

  onStartDatePickerChange(startDate) {
    this.props.updateOuterTimelineDates([startDate, this.props.filters.timelineOuterExtent[1]]);
  }

  onEndDatePickerChange(endDate) {
    this.props.updateOuterTimelineDates([this.props.filters.timelineOuterExtent[0], endDate]);
  }

  onPauseToggle() {
    lastTimestamp = null;
    const paused = !this.props.filters.timelinePaused;
    this.props.updatePlayingStatus(paused);
  }

  onMouseOver(offsetX) {
    const timelineOverExtent = this.getExtent([offsetX - 5, offsetX + 5]);
    this.props.updateTimelineOverDates(timelineOverExtent);
  }

  onMouseOut() {
    this.props.updateTimelineOverDates([new Date(0), new Date(0)]);
  }

  onTimeRangeSelected(rangeTimeMs) {
    let currentStartDate = this.props.filters.timelineInnerExtent[0];
    let nextEndDate = new Date(currentStartDate.getTime() + rangeTimeMs);

    // if the predefined range time selection overrides timebar limits...
    if (this.props.filters.timelineOuterExtent[1] < nextEndDate) {
      nextEndDate = this.props.filters.timelineOuterExtent[1];
      currentStartDate = new Date(nextEndDate.getTime() - rangeTimeMs);
    }

    const newExtentPx = this.getPxExtent([currentStartDate, nextEndDate]);
    this.redrawInnerBrushCircles(newExtentPx);

    const newExtent = this.getExtent(newExtentPx);
    this.redrawInnerBrush(newExtent);

    this.props.updateInnerTimelineDates(newExtent);
  }

  render() {
    const dateFormat = 'DD MMM YYYY';
    const startDateText = window.innerWidth < 1024 ? ' start' : 'start date';
    const endDateText = window.innerWidth < 1024 ? 'end' : 'end date';

    const startDate = moment(this.props.filters.startDate).format(dateFormat);
    const endDate = moment(this.props.filters.endDate).format(dateFormat);


    return (
      <div className={timebarCss['c-timebar']}>
        <div className={classnames(timebarCss['c-timebar-element'], timebarCss['c-timebar-datepicker'])}>
          <DatePicker
            selected={this.props.filters.timelineOuterExtent && this.props.filters.timelineOuterExtent[0]}
            minDate={this.props.filters.timelineOverallExtent[0]}
            maxDate={this.props.filters.timelineInnerExtent && this.props.filters.timelineInnerExtent[0]}
            onChange={this.onStartDatePickerChange}
          >
            {startDateText}
            {startDate}
          </DatePicker>
        </div>
        <div className={classnames(timebarCss['c-timebar-element'], timebarCss['c-timebar-datepicker'])}>
          <DatePicker
            selected={this.props.filters.timelineOuterExtent && this.props.filters.timelineOuterExtent[1]}
            minDate={this.props.filters.timelineInnerExtent && this.props.filters.timelineInnerExtent[1]}
            maxDate={this.props.filters.timelineOverallExtent[1]}
            onChange={this.onEndDatePickerChange}
          >
            {endDateText}
            {endDate}
          </DatePicker>
        </div>
        <div className={classnames(timebarCss['c-timebar-element'], timebarCss['c-timebar-playback'])}>
          <TogglePauseButton
            onToggle={this.onPauseToggle}
            paused={this.props.filters.timelinePaused}
          />
        </div>

        <div
          className={classnames(timebarCss['c-timebar-element'], timelineCss['c-timeline'])}
          id="timeline_svg_container"
        >
          <DurationPicker
            extent={this.state.durationPickerExtent}
            extentPx={this.state.innerExtentPx}
            timelineOuterExtent={this.props.filters.timelineOuterExtent}
            onTimeRangeSelected={(rangeTime) => this.onTimeRangeSelected(rangeTime)}
          />
        </div>
      </div>
    );
  }
}

Timebar.propTypes = {
  updateInnerTimelineDates: React.PropTypes.func,
  updateOuterTimelineDates: React.PropTypes.func,
  updatePlayingStatus: React.PropTypes.func,
  updateTimelineOverDates: React.PropTypes.func,
  filters: React.PropTypes.object
};

export default Timebar;
