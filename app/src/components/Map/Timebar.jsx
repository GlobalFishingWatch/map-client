/* eslint react/sort-comp:0 */
import React, { Component } from 'react';
import * as d3 from 'd3'; // TODO: namespace and only do the necessary imports
import classnames from 'classnames';
import { TIMELINE_TOTAL_DATE_EXTENT, TIMELINE_INNER_EXTENT, TIMELINE_MAX_TIME } from '../../constants';
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
    this.state = {
      outerExtent: TIMELINE_TOTAL_DATE_EXTENT,
      paused: true,
      innerExtent: TIMELINE_INNER_EXTENT, // used only by durationPicker
      innerExtentPx: [0, 100]  // used only by durationPicker
    };
  }

  componentDidMount() {
    this.build();
  }

  componentWillReceiveProps(nextProps) {
    // depending on whether state (outerExtent) or props (innerExtent) have been updated, we'll do different things
    const newInnerExtent = nextProps.filters.timelineInnerExtent;
    if (extentChanged(this.props.filters.timelineInnerExtent, newInnerExtent)) {
      this.redrawInnerBrush(newInnerExtent);
    }
    this.setState({
      innerExtent: nextProps.filters.timelineInnerExtent // used only by durationPicker
    });
  }

  componentWillUpdate(nextProps, nextState) {
    // depending on whether state (outerExtent) or props (innerExtent) have been updated, we'll do different things
    if (extentChanged(this.state.outerExtent, nextState.outerExtent)) {
      // redraw
      const newOuterPxExtent = [x(nextState.outerExtent[0]), x(nextState.outerExtent[1])];
      const isLargerThanBefore =
        newOuterPxExtent[0] < x(this.state.outerExtent[0]) ||
        newOuterPxExtent[1] > x(this.state.outerExtent[1]);
      this.redrawOuterBrush(newOuterPxExtent, isLargerThanBefore);
    }
    if (this.state.paused !== nextState.paused) {
      this.togglePause(nextState.paused);
    }
  }

  componentWillUnmount() {
    this.outerBrush.selectAll('.handle').on('mousedown', null);
    d3.select('body').on('mousemove', null);
    d3.select('body').on('mouseup', null);
    this.innerBrushFunc.on('end', null);
  }

  build() {
    const dummyData = this.getDummyData();
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
    x.domain(TIMELINE_TOTAL_DATE_EXTENT);
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

    // custom outer brush events
    this.outerBrush.selectAll('.handle').on('mousedown', () => {
      currentHandleIsWest = d3.event.target.classList[1] === 'handle--w';
      dragging = true;
      this.disableInnerBrush();
      this.startTick();
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

  getDummyData() {
    const dummyData = [];
    const startDate = TIMELINE_TOTAL_DATE_EXTENT[0];
    const endDate = TIMELINE_TOTAL_DATE_EXTENT[1];
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

    this.setState({
      outerExtent
    });
  }

  getNewOuterExtent(newOuterPxExtent) {
    // use the new x scale to compute new time values
    // do not get out of total range for outer brush
    const newOuterTimeLeft = x.invert(newOuterPxExtent[0]);
    const newOuterTimeRight = x.invert(newOuterPxExtent[1]);
    const isAfterStartDate = newOuterTimeLeft.getTime() > TIMELINE_TOTAL_DATE_EXTENT[0].getTime();
    const isBeforeEndDate = newOuterTimeRight.getTime() < TIMELINE_TOTAL_DATE_EXTENT[1].getTime();
    const newOuterTimeExtentLeft = isAfterStartDate ? newOuterTimeLeft : TIMELINE_TOTAL_DATE_EXTENT[0];
    const newOuterTimeExtentRight = isBeforeEndDate ? newOuterTimeRight : TIMELINE_TOTAL_DATE_EXTENT[1];
    return [newOuterTimeExtentLeft, newOuterTimeExtentRight];
  }

  resetOuterBrush() {
    currentOuterPxExtent = [0, width];
    this.outerBrush.select('.selection').attr('width', width).attr('x', 0);
    outerBrushHandleLeft.attr('x', 0);
    outerBrushHandleRight.attr('x', width - 2);
  }

  redrawOuterBrush(newOuterPxExtent, isLargerThanBefore) {
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
    this.props.updateFilters({
      timelineInnerExtent: this.getExtent(d3.event.selection)
    });
  }

  onInnerBrushMoved() {
    let newExtentPx = d3.event.selection;
    const newExtent = this.getExtent(d3.event.selection);

    // time range is too long
    if (newExtent[1].getTime() - newExtent[0].getTime() > TIMELINE_MAX_TIME) {
      console.log('too long')
      const oldExtent = this.state.innerExtent;

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

    this.setState({
      innerExtent: newExtent
    });
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

    if (!this.state.paused) {
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

    if (dragging || !this.state.paused) {
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
    const playStep = this.getPlayStep(this.state.outerExtent) * deltaTick;
    const previousInnerExtent = this.props.filters.timelineInnerExtent;
    let offsetedInnerExtent = previousInnerExtent.map(d => new Date(d.getTime() + playStep));
    let offsetedOuterExtent = this.state.outerExtent.map(d => new Date(d.getTime() + playStep));
    const endOfTime = TIMELINE_TOTAL_DATE_EXTENT[1];
    const isAtEndOfTime = x(offsetedInnerExtent[1]) >= x(endOfTime);


    // if we're at the end of time, just stop playing
    if (isAtEndOfTime) {
      const innerExtentDelta = offsetedInnerExtent[1].getTime() - offsetedInnerExtent[0].getTime();
      const outerExtentDelta = offsetedOuterExtent[1].getTime() - offsetedOuterExtent[0].getTime();
      offsetedInnerExtent = [new Date(endOfTime.getTime() - innerExtentDelta), endOfTime];
      offsetedOuterExtent = [new Date(endOfTime.getTime() - outerExtentDelta), endOfTime];
      this.setState({
        paused: true,
        outerExtent: offsetedOuterExtent
      });
    }

    this.props.updateFilters({
      timelineInnerExtent: offsetedInnerExtent
    });

    // if inner extent gets closer to outer extent right, also offset the outer extent to make the inner extent fit
    if (!isAtEndOfTime && x(offsetedInnerExtent[1]) + innerOuterMarginPx > x(this.state.outerExtent[1])) {
      this.setState({
        outerExtent: offsetedOuterExtent
      });
    }
  }

  onStartDatePickerChange(startDate) {
    this.setState({
      outerExtent: [startDate, this.state.outerExtent[1]]
    });
  }

  onEndDatePickerChange(endDate) {
    this.setState({
      outerExtent: [this.state.outerExtent[0], endDate]
    });
  }

  onPauseToggle() {
    lastTimestamp = null;
    this.setState({
      paused: !this.state.paused
    });
  }

  render() {
    return (
      <div className={timebarCss['c-timebar']}>
        <div className={classnames(timebarCss['c-timebar-element'], timebarCss['c-timebar-datepicker'])}>
          <DatePicker
            selected={this.state.outerExtent[0]}
            minDate={TIMELINE_TOTAL_DATE_EXTENT[0]}
            maxDate={this.props.filters.timelineInnerExtent[0]}
            onChange={this.onStartDatePickerChange}
          >
            Start<br />Date
          </DatePicker>
        </div>
        <div className={classnames(timebarCss['c-timebar-element'], timebarCss['c-timebar-datepicker'])}>
          <DatePicker
            selected={this.state.outerExtent[1]}
            minDate={this.props.filters.timelineInnerExtent[1]}
            maxDate={TIMELINE_TOTAL_DATE_EXTENT[1]}
            onChange={this.onEndDatePickerChange}
          >
            End<br />date
          </DatePicker>
        </div>
        <div className={classnames(timebarCss['c-timebar-element'], timebarCss['c-timebar-playback'])}>
          <TogglePauseButton
            onToggle={this.onPauseToggle}
            paused={this.state.paused}
          />
        </div>

        <div
          className={classnames(timebarCss['c-timebar-element'], timelineCss['c-timeline'])}
          id="timeline_svg_container"
        >
          <DurationPicker
            extent={this.state.innerExtent}
            extentPx={this.state.innerExtentPx}
          />
        </div>
      </div>
    );
  }
}

Timebar.propTypes = {
  updateFilters: React.PropTypes.func,
  filters: React.PropTypes.object
};

export default Timebar;
