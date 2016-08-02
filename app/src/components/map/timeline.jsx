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
const area = d3.area()
  .x(d => x(d.date))
  .y0(height)
  .y1(d => y(d.price));

let currentInnerOffsetExtent = [300, 400];
let currentOuterOffsetExtent = [0, width];
let currentHandleIsWest;
let dragging;
let startTick;

const brush = () => d3.brushX().extent([[0, -10], [width, height + 7]]);

class Timeline extends Component {

  constructor(props) {
    super(props);
    this.updateOuterExtent = this.updateOuterExtent.bind(this);
    this.state = {
      outerExtent: TIMELINE_TOTAL_DATE_EXTENT
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.innerBrushFunc = brush().on('end', this.onInnerBrushed.bind(this));
    this.outerBrushFunc = brush();

    this.build();
  }

  componentDidUpdate() {
    const newOuterOffsetExtent = [x(this.state.outerExtent[0]), x(this.state.outerExtent[1])];
    // console.log(newOuterOffsetExtent)
    this.redrawOuter(newOuterOffsetExtent);
  }

  componentWillUnmount() {
    this.outerBrush.selectAll('.handle').on('mousedown', null);
    d3.select('body').on('mousemove', null);
    d3.select('body').on('mouseup', null);
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
          date: new Date(y, m, 1),
          price: Math.random()
        });
      }
    }
    return dummyData;
  }

  onTick(timestamp) {
    const isZoomingIn = currentOuterOffsetExtent[0] >= 0 && currentOuterOffsetExtent[1] <= width;

    if (isZoomingIn) {
      if (dragging) {
        // do not go within the inner brush
        currentOuterOffsetExtent[0] = Math.min(currentInnerOffsetExtent[0] - 10, currentOuterOffsetExtent[0]);
        currentOuterOffsetExtent[1] = Math.max(currentInnerOffsetExtent[1] + 10, currentOuterOffsetExtent[1]);

        // move outer brush selection rect -- normally done by d3.brush by default,
        // but we disabled all brush events
        this.outerBrush.select('.selection').
          attr('x', currentOuterOffsetExtent[0]);
        this.outerBrush.select('.selection').
          attr('width', currentOuterOffsetExtent[1] - currentOuterOffsetExtent[0]);
      } else {
        // release, actually do the zoom in
        this.setOuterZoom(currentOuterOffsetExtent);

        // back to full width
        currentOuterOffsetExtent = [0, width];
        this.outerBrush.select('.selection').attr('width', width).attr('x', 0);
      }
    } else {
      if (!startTick) {
        startTick = timestamp;
      }
      const deltaTick = timestamp - startTick;

      // get prev offset
      const offset = [currentOuterOffsetExtent[0], currentOuterOffsetExtent[1]];

      // get delta
      let deltaOffset = (currentHandleIsWest) ? currentOuterOffsetExtent[0] : currentOuterOffsetExtent[1] - width;
      deltaOffset *= deltaOffset * deltaTick * 0.000001;

      if (currentHandleIsWest) {
        offset[0] = -deltaOffset;
      } else {
        offset[1] = width + deltaOffset;
      }

      if (!dragging) {
        currentOuterOffsetExtent = [0, width];
      }

      this.setOuterZoom(offset);
    }

    if (dragging) {
      window.requestAnimationFrame(this.onTick.bind(this));
    }
  }

  setOuterZoom() {
    const newOuterTimeExtent = this.redrawOuter(currentOuterOffsetExtent);
    // propagate to state
    // console.log(newOuterTimeExtent)
    this.setState({
      outerExtent: newOuterTimeExtent
    });
  }

  build() {
    const dummyData = this.getDummyData();

    x.domain(TIMELINE_TOTAL_DATE_EXTENT);
    y.domain([0, d3.max(dummyData.map(d => d.price))]);

    this.svg = d3.select('#timeline_svg_container').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    this.group = this.svg.append('g')
      .attr('class', css.c_timeline)
      .attr('transform', `translate(${margin.left},${margin.top})`);

    this.group.append('path')
        .datum(dummyData)
        .attr('class', css.c_timeline_area)
        .attr('d', area);

    this.group.append('g')
        .attr('class', css.c_timeline_x_axis)
        .attr('transform', `translate(0, ${height + 15})`)
        .call(xAxis);

    this.outerBrush = this.group.append('g')
        .attr('class', css.c_timeline_outer_brush)
        .call(this.outerBrushFunc);

    // disable default d3 brush events
    this.outerBrush.on('.brush', null);
    //

    this.innerBrush = this.group.append('g')
        .attr('class', css.c_timeline_outer_brush)
        .call(this.innerBrushFunc);

    // this.innerBrush.on('.brush', null);

    this.outerBrushFunc.move(this.outerBrush, [0, width]);
    this.innerBrushFunc.move(this.innerBrush, currentInnerOffsetExtent);
    // no need to keep brush overlays (the invisible interactive zone outside of the brush)
    this.outerBrush.select('.overlay').remove();
    this.outerBrush.select('.selection').attr('cursor', 'default');
    this.innerBrush.select('.overlay').remove();

    this.outerBrush.selectAll('.handle').on('mousedown', () => {
      currentHandleIsWest = d3.event.target.classList[1] === 'handle--w';
      dragging = true;
      window.requestAnimationFrame(this.onTick.bind(this));
    });

    d3.select('body').on('mousemove', () => {
      if (dragging) {
        const nx = d3.event.pageX - margin.left;
        if (currentHandleIsWest) {
          currentOuterOffsetExtent[0] = nx;
        } else {
          currentOuterOffsetExtent[1] = nx;
        }
      }
    });
    d3.select('body').on('mouseup', () => {
      dragging = false;
    });
  }

  redrawOuter(newOuterOffsetExtent) {
    // grab inner time extent before changing scale
    const prevInnerTimeExtent = [x.invert(currentInnerOffsetExtent[0]), x.invert(currentInnerOffsetExtent[1])];

    // use the new x scale to compute new time values
    // do not get out of total range for outer brush
    const newOuterTimeLeft = x.invert(newOuterOffsetExtent[0]);
    const newOuterTimeRight = x.invert(newOuterOffsetExtent[1]);
    const isAfterStartDate = newOuterTimeLeft.getTime() > TIMELINE_TOTAL_DATE_EXTENT[0].getTime();
    const isBeforeEndDate = newOuterTimeRight.getTime() < TIMELINE_TOTAL_DATE_EXTENT[1].getTime();
    const newOuterTimeExtentLeft = isAfterStartDate ? newOuterTimeLeft : TIMELINE_TOTAL_DATE_EXTENT[0];
    const newOuterTimeExtentRight = isBeforeEndDate ? newOuterTimeRight : TIMELINE_TOTAL_DATE_EXTENT[1];
    const newOuterTimeExtent = [newOuterTimeExtentLeft, newOuterTimeExtentRight];
    x.domain(newOuterTimeExtent);

    // redraw components
    this.group.select(`.${css.c_timeline_area}`).attr('d', area);
    this.group.select(`.${css.c_timeline_x_axis}`).call(xAxis);

    // calculate new inner extent, using old inner extent on new x scale
    currentInnerOffsetExtent = [x(prevInnerTimeExtent[0]), x(prevInnerTimeExtent[1])];
    this.innerBrushFunc.move(this.innerBrush, currentInnerOffsetExtent);

    return newOuterTimeExtent;
  }

  onInnerBrushed() {
    // const innerOffsetExtent = d3.event.selection;
    // const innerExtent = [x.invert(innerOffsetExtent[0]), x.invert(innerOffsetExtent[1])];
    // TODO : call some callback to propagate to map
  }

  updateOuterExtent(outerExtent) {
    this.setState({
      outerExtent
    });
  }

  render() {
    return (
      <div>
        <DatePicker
          updateOuterExtent={this.updateOuterExtent}
          start={this.state.outerExtent[0]}
          end={this.state.outerExtent[1]}
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
