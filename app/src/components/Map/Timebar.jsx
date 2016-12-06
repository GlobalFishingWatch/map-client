/* eslint react/sort-comp:0 */
import React, { Component } from 'react';
import * as d3 from 'd3'; // TODO: namespace and only do the necessary imports
import classnames from 'classnames';
import { TIMELINE_MAX_TIME } from '../../constants';
import timebarCss from '../../../styles/components/map/c-timebar.scss';
import timelineCss from '../../../styles/components/map/c-timeline.scss';
import extentChanged from '../../util/extentChanged';
import DatePicker from './DatePicker';
import TogglePauseButton from './TogglePauseButton';
import DurationPicker from './DurationPicker';

let width;
let height;
let leftOffset;
let x;
let y;
let xAxis;
let area;
const innerOuterMarginPx = 10;

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

class Timebar extends Component {

  constructor(props) {
    super(props);
    this.onStartDatePickerChange = this.onStartDatePickerChange.bind(this);
    this.onEndDatePickerChange = this.onEndDatePickerChange.bind(this);
    this.onPauseToggle = this.onPauseToggle.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.state = {
      innerExtentPx: [0, 100]  // used only by durationPicker
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
    if (extentChanged(this.props.filters.timelineInnerExtent, newInnerExtent)) {
      this.redrawInnerBrush(newInnerExtent);
    }

    const currentOuterExtent = this.props.filters.timelineOuterExtent;
    const newOuterExtent = nextProps.filters.timelineOuterExtent;
    console.log(currentOuterExtent, newOuterExtent)
    console.log(extentChanged(currentOuterExtent, newOuterExtent))
    if (extentChanged(currentOuterExtent, newOuterExtent)) {
      // redraw
      // this.redrawOuterBrush(newOuterPxExtent, isLargerThanBefore);
      this.redrawOuterBrush(newOuterExtent, currentOuterExtent);
    }
  }

  componentWillUpdate(nextProps) {
    if (this.props.filters.timelinePaused !== nextProps.filters.timelinePaused) {
      this.togglePause(nextProps.filters.timelinePaused);
    }
  }

  componentWillUnmount() {
    this.outerBrush.selectAll('.handle').on('mousedown', null);
    d3.select('body').on('mousemove', null);
    d3.select('body').on('mouseup', null);
    this.innerBrushFunc.on('end', null);
  }

  build() {
    console.log(this.props);
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
    xAxis = d3.axisTop().scale(x);
      // .tickFormat(1, d3.timeFormat("%B lala"));

    // define the way the timeline chart is going to be drawn
    area = d3.area()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.price));
    x.domain(this.props.filters.timelineOverallExtent);
    y.domain([0, d3.max(dummyData.map(d => d.price))]);

    this.svg = d3.select('#timeline_svg_container').append('svg')
      .attr('width', width + 30)
      .attr('height', height + durationPickerHeight);

    this.group = this.svg.append('g')
      .attr('transform', `translate(0,${durationPickerHeight})`);

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
    this.outerBrushFunc = brush();

    this.outerBrush = this.group.append('g')
      .attr('class', timelineCss['c-timeline-outer-brush'])
      .call(this.outerBrushFunc);

    // disable default d3 brush events for the outer brush
    this.outerBrush.on('.brush', null);

    this.innerBrush = this.group.append('g')
      .attr('class', timelineCss['c-timeline-inner-brush'])
      .call(this.innerBrushFunc);

    // no need to keep brush overlays (the invisible interactive zone outside of the brush)
    this.outerBrush.select('.overlay').remove();
    this.outerBrush.select('.selection').attr('cursor', 'default');
    this.outerBrush.select('.selection').classed(timelineCss['c-timeline-outer-brush-selection'], true);
    outerBrushHandleLeft = this.group.append('rect').classed(timelineCss['c-timeline-outer-brush-handle'], true)
      .attr('height', height);
    outerBrushHandleRight = this.group.append('rect').classed(timelineCss['c-timeline-outer-brush-handle'], true)
      .attr('height', height);

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
    this.outerBrushFunc.move(this.outerBrush, [0, width]);
    this.resetOuterBrush();
    this.redrawInnerBrush(this.props.filters.timelineInnerExtent);

    // draw initial outer extent
    // this.redrawOuterBrush(this.props.filters.timelineOuterExtent, this.props.filters.timelineOverallExtent);

    // custom outer brush events
    this.outerBrush.selectAll('.handle').on('mousedown', () => {
      currentHandleIsWest = d3.event.target.classList[1] === 'handle--w';
      dragging = true;
      this.disableInnerBrush();
      this.startTick();
    });

    this.group.on('mousemove', () => {
      this.onMouseOver(d3.event.offsetX);
    });

    d3.select('body').on('mousemove', () => {
      if (dragging) {
        const nx = d3.event.pageX - leftOffset;
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
    const newOuterTimeLeft = x.invert(newOuterPxExtent[0]);
    const newOuterTimeRight = x.invert(newOuterPxExtent[1]);
    const isAfterOverallStartDate = newOuterTimeLeft.getTime() > this.props.filters.timelineOverallExtent[0].getTime();
    const isBeforeOverallEndDate = newOuterTimeRight.getTime() < this.props.filters.timelineOverallExtent[1].getTime();
    const newOuterTimeExtentLeft = isAfterOverallStartDate ? newOuterTimeLeft : this.props.filters.timelineOverallExtent[0];
    const newOuterTimeExtentRight = isBeforeOverallEndDate ? newOuterTimeRight : this.props.filters.timelineOverallExtent[1];
    return [newOuterTimeExtentLeft, newOuterTimeExtentRight];
  }

  resetOuterBrush() {
    currentOuterPxExtent = [0, width];
    this.outerBrush.select('.selection').attr('width', width).attr('x', 0);
    outerBrushHandleLeft.attr('x', 0);
    outerBrushHandleRight.attr('x', width - 2);
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
      console.info('too long');
      const oldExtent = this.props.filters.timelineInnerExtent;

      if (oldExtent[0].getTime() === newExtent[0].getTime()) {
        // right brush was moved
        newExtent[1] = oldExtent[1];
      } else {
        // left brush was moved
        newExtent[0] = oldExtent[0];
      }
      newExtentPx = this.getPxExtent(newExtent);
      this.redrawInnerBrush(newExtent);
    }

    this.redrawInnerBrushCircles(newExtentPx);
    this.redrawInnerBrushFooter(newExtentPx);
  }

  redrawInnerBrush(newInnerExtent) {
    currentInnerPxExtent = this.getPxExtent(newInnerExtent);
    // prevent d3 from dispatching brush events that are not user-initiated
    this.disableInnerBrush();
    this.innerBrushFunc.move(this.innerBrush, currentInnerPxExtent);
    this.redrawInnerBrushCircles(currentInnerPxExtent);
    this.redrawInnerBrushFooter(currentInnerPxExtent);
    this.enableInnerBrush();
  }

  redrawInnerBrushCircles(newInnerPxExtent) {
    innerBrushLeftCircle.attr('cx', newInnerPxExtent[0]);
    innerBrushRightCircle.attr('cx', newInnerPxExtent[1]);
  }

  redrawInnerBrushFooter(newInnerPxExtent) {
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
      extent[0] = Math.min(currentInnerPxExtent[0] - innerOuterMarginPx, outerExtentPx[0]);
    } else {
      extent[1] = Math.max(currentInnerPxExtent[1] + innerOuterMarginPx, outerExtentPx[1]);
    }

    // move outer brush selection rect -- normally done by d3.brush by default,
    // but we disabled all brush events
    this.outerBrush.select('.selection').attr('x', extent[0]);
    this.outerBrush.select('.selection').attr('width', extent[1] - extent[0]);
    outerBrushHandleLeft.attr('x', extent[0]);
    outerBrushHandleRight.attr('x', extent[1] - 2);
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

  playStep(deltaTick) {
    // compute new basePlayStep (used for playback), because we want it to depend on the zoom levels
    const playStep = this.getPlayStep(this.props.filters.timelineOuterExtent) * deltaTick;
    const previousInnerExtent = this.props.filters.timelineInnerExtent;
    let offsetInnerExtent = previousInnerExtent.map(d => new Date(d.getTime() + playStep));
    const endOfTime = this.props.filters.timelineOuterExtent[1];
    const isAtEndOfTime = x(offsetInnerExtent[1]) >= x(endOfTime);


    // if we're at the end of time, just stop playing
    if (isAtEndOfTime) {
      const innerExtentDelta = offsetInnerExtent[1].getTime() - offsetInnerExtent[0].getTime();
      offsetInnerExtent = [new Date(endOfTime.getTime() - innerExtentDelta), endOfTime];
      this.updatePlayingStatus(true);
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
    const timelineOverExtent = this.getExtent([offsetX - 2, offsetX + 2]);
    this.props.updateTimelineOverDates(timelineOverExtent);
  }

  render() {
    return (
      <div className={timebarCss['c-timebar']}>
        <div className={classnames(timebarCss['c-timebar-element'], timebarCss['c-timebar-datepicker'])}>
          <DatePicker
            selected={this.props.filters.timelineOuterExtent && this.props.filters.timelineOuterExtent[0]}
            minDate={this.props.filters.timelineOverallExtent[0]}
            maxDate={this.props.filters.timelineInnerExtent && this.props.filters.timelineInnerExtent[0]}
            onChange={this.onStartDatePickerChange}
          >
            Start<br />Date
          </DatePicker>
        </div>
        <div className={classnames(timebarCss['c-timebar-element'], timebarCss['c-timebar-datepicker'])}>
          <DatePicker
            selected={this.props.filters.timelineOuterExtent && this.props.filters.timelineOuterExtent[1]}
            minDate={this.props.filters.timelineInnerExtent && this.props.filters.timelineInnerExtent[1]}
            maxDate={this.props.filters.timelineOverallExtent[1]}
            onChange={this.onEndDatePickerChange}
          >
            End<br />date
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
            extent={this.props.filters.timelineInnerExtent}
            extentPx={this.state.innerExtentPx}
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
