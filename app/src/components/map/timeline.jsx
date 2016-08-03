import React, { Component } from 'react';
import * as d3 from 'd3'; // TODO: namespace and only do the necessary imports
import { TIMELINE_TOTAL_DATE_EXTENT } from '../../constants';
import css from '../../../styles/index.scss';
import DatePicker from './date_picker';

const margin = { top: 10, right: 50, bottom: 40, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 200 - margin.top - margin.bottom;

const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);
const xAxis = d3.axisBottom().scale(x);

// define the way the timeline chart is going to be drawn
const area = d3.area()
  .x(d => x(d.date))
  .y0(height)
  .y1(d => y(d.price));

let currentInnerPxExtent = [0, 1];
let currentOuterPxExtent = [0, width];
let currentHandleIsWest;
let dragging;
let startTick;

const brush = () => d3.brushX().extent([[0, -10], [width, height + 7]]);

const extentChanged = (oldExtent, newExtent) =>
  oldExtent[0].getTime() !== newExtent[0].getTime() ||
  oldExtent[1].getTime() !== newExtent[1].getTime();

class Timeline extends Component {

  constructor(props) {
    super(props);
    this.onDatePickerChange = this.onDatePickerChange.bind(this);
    this.state = {
      outerExtent: TIMELINE_TOTAL_DATE_EXTENT
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
  }

  componentWillUpdate(nextProps, nextState) {
    // depending on whether state (outerExtent) or props (innerExtent) have been updated, we'll do different things
    if (extentChanged(this.state.outerExtent, nextState.outerExtent)) {
      const newOuterPxExtent = [x(nextState.outerExtent[0]), x(nextState.outerExtent[1])];
      this.redrawOuterBrush(newOuterPxExtent);
    }
  }

  componentWillUnmount() {
    this.outerBrush.selectAll('.handle').on('mousedown', null);
    d3.select('body').on('mousemove', null);
    d3.select('body').on('mouseup', null);
    this.innerBrushFunc.on('end', null);
  }

  getDummyData() {
    const dummyData = [];
    const startDate = TIMELINE_TOTAL_DATE_EXTENT[0];
    const endDate = TIMELINE_TOTAL_DATE_EXTENT[1];
    for (let year = startDate.getFullYear(); year <= endDate.getFullYear(); year++) {
      const startMonth = (year === startDate.getFullYear()) ? startDate.getMonth() : 0;
      const endMonth = (year === endDate.getFullYear()) ? endDate.getMonth() : 11;

      for (let m = startMonth; m <= endMonth; m++) {
        dummyData.push({
          date: new Date(year, m, 1),
          price: Math.random()
        });
      }
    }
    return dummyData;
  }

  build() {
    const dummyData = this.getDummyData();

    x.domain(TIMELINE_TOTAL_DATE_EXTENT);
    y.domain([0, d3.max(dummyData.map(d => d.price))]);

    this.svg = d3.select('#timeline_svg_container').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    this.group = this.svg.append('g')
      .attr('class', css['c-timeline'])
      .attr('transform', `translate(${margin.left},${margin.top})`);

    this.group.append('path')
        .datum(dummyData)
        .attr('class', css['c-timeline-area'])
        .attr('d', area);

    this.group.append('g')
        .attr('class', css['c-timeline-x-axis'])
        .attr('transform', `translate(0, ${height + 15})`)
        .call(xAxis);

    // set up brush generators
    this.innerBrushFunc = brush();
    this.outerBrushFunc = brush();

    this.outerBrush = this.group.append('g')
        .attr('class', css['c-timeline-outer-brush'])
        .call(this.outerBrushFunc);

    // disable default d3 brush events for the outer brush
    this.outerBrush.on('.brush', null);

    this.innerBrush = this.group.append('g')
        .attr('class', css['c-timeline-inner-brush'])
        .call(this.innerBrushFunc);

    // mmove both brushes to initial position
    this.outerBrushFunc.move(this.outerBrush, [0, width]);
    this.redrawInnerBrush(this.props.filters.timelineInnerExtent);


    // no need to keep brush overlays (the invisible interactive zone outside of the brush)
    this.outerBrush.select('.overlay').remove();
    this.outerBrush.select('.selection').attr('cursor', 'default');
    this.innerBrush.select('.overlay').remove();

    // custom outer brush events
    this.outerBrush.selectAll('.handle').on('mousedown', () => {
      currentHandleIsWest = d3.event.target.classList[1] === 'handle--w';
      dragging = true;
      this.disableInnerBrush();
      window.requestAnimationFrame(this.onTick.bind(this));
    });

    d3.select('body').on('mousemove', () => {
      if (dragging) {
        const nx = d3.event.pageX - margin.left;
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

  enableInnerBrush() {
    this.innerBrushFunc.on('end', this.onInnerBrushed.bind(this));
  }
  disableInnerBrush() {
    this.innerBrushFunc.on('end', null);
  }

  onTick(timestamp) {
    if (!dragging) return;

    const outerExtentPx = currentOuterPxExtent;

    if (this.isZoomingIn(outerExtentPx)) {
      this.zoomIn(outerExtentPx);
    } else {
      this.zoomOut(outerExtentPx, timestamp);
    }

    window.requestAnimationFrame(this.onTick.bind(this));
  }

  isZoomingIn(outerExtentPx) {
    return outerExtentPx[0] >= 0 && outerExtentPx[1] <= width;
  }

  zoomIn(outerExtentPx) {
    const extent = outerExtentPx;
    // do not go within the inner brush
    extent[0] = Math.min(currentInnerPxExtent[0] - 10, outerExtentPx[0]);
    extent[1] = Math.max(currentInnerPxExtent[1] + 10, outerExtentPx[1]);

    // move outer brush selection rect -- normally done by d3.brush by default,
    // but we disabled all brush events
    this.outerBrush.select('.selection').
      attr('x', extent[0]);
    this.outerBrush.select('.selection').
      attr('width', extent[1] - extent[0]);
  }

  zoomOut(outerExtentPx, timestamp) {
    if (!startTick) {
      startTick = timestamp;
    }
    const deltaTick = timestamp - startTick;

    // get prev offset
    const extent = [outerExtentPx[0], outerExtentPx[1]];

    // get delta
    let deltaOffset = (currentHandleIsWest) ? outerExtentPx[0] : outerExtentPx[1] - width;
    deltaOffset *= deltaOffset * deltaTick * 0.000001;

    if (currentHandleIsWest) {
      extent[0] = -deltaOffset;
    } else {
      extent[1] = width + deltaOffset;
    }

    this.setOuterExtent(extent);
  }

  setOuterExtent(outerExtentPx) {
    const outerExtent = this.getNewOuterExtent(outerExtentPx);

    this.setState({
      outerExtent
    });
  }

  resetOuterBrush() {
    currentOuterPxExtent = [0, width];
    this.outerBrush.select('.selection').attr('width', width).attr('x', 0);
  }

  redrawOuterBrush(newOuterPxExtent) {
    // grab inner time extent before changing x scale
    const prevInnerTimeExtent = [x.invert(currentInnerPxExtent[0]), x.invert(currentInnerPxExtent[1])];

    const newOuterTimeExtent = this.getNewOuterExtent(newOuterPxExtent);
    x.domain(newOuterTimeExtent);

    // redraw components
    this.group.select(`.${css['c-timeline-area']}`).attr('d', area);
    this.group.select(`.${css['c-timeline-x-axis']}`).call(xAxis);

    // calculate new inner extent, using old inner extent on new x scale
    currentInnerPxExtent = [x(prevInnerTimeExtent[0]), x(prevInnerTimeExtent[1])];
    this.innerBrushFunc.move(this.innerBrush, currentInnerPxExtent);

    return newOuterTimeExtent;
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
    const newOuterTimeExtent = [newOuterTimeExtentLeft, newOuterTimeExtentRight];
    return newOuterTimeExtent;
  }

  onInnerBrushed() {
    currentInnerPxExtent = d3.event.selection;
    const innerExtent = [x.invert(currentInnerPxExtent[0]), x.invert(currentInnerPxExtent[1])];

    this.props.updateFilters({
      timelineInnerExtent: innerExtent
    });
  }

  redrawInnerBrush(newInnerExtent) {
    currentInnerPxExtent = [x(newInnerExtent[0]), x(newInnerExtent[1])];
    // prevent d3 from dispatching brush events that are not user -initiated
    this.disableInnerBrush();
    this.innerBrushFunc.move(this.innerBrush, currentInnerPxExtent);
    this.enableInnerBrush();
  }

  onDatePickerChange(outerExtent) {
    this.setState({
      outerExtent
    });
  }

  render() {
    return (
      <div>
        <DatePicker
          onDatePickerChange={this.onDatePickerChange}
          start={this.state.outerExtent[0]}
          end={this.state.outerExtent[1]}
          startMin={TIMELINE_TOTAL_DATE_EXTENT[0]}
          startMax={this.props.filters.timelineInnerExtent[0]}
          endMin={this.props.filters.timelineInnerExtent[1]}
          endMax={TIMELINE_TOTAL_DATE_EXTENT[1]}
        />
        <div id="timeline_svg_container" />
      </div>
    );
  }
}

Timeline.propTypes = {
  updateFilters: React.PropTypes.func,
  filters: React.PropTypes.object
};

export default Timeline;
