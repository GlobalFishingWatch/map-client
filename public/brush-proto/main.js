/* globals d3 */

var margin = {top: 10, right: 50, bottom: 40, left: 50};
var width = 960 - margin.left - margin.right;
var height = 250 - margin.top - margin.bottom;

var parseDate = d3.timeParse('%m %Y');

function type(d) {
  d.date = parseDate(d.date);
  d.price = +d.price;
  return d;
}

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom().scale(x);

var area = d3.area()
  .x(function(d) { return x(d.date); })
  .y0(height)
  .y1(function(d) { return y(d.price); });

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

var context = svg.append("g")
  .attr("class", "context")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var brush = () => {
  return d3.brushX()
      .extent([[0, -10], [width, height + 7]])
};

var innerBrushFunc = brush().on("brush", innerBrushed);
var outerBrushFunc = brush() /*.on("end", outerBrushedEnd).on('brush', outerBrushedMoved);*/
var innerBrush, outerBrush;

function outerBrushedEnd(currentOuterOffsetExtent) {

  // grab inner time extent before changing scale
  var prevInnerTimeExtent = [x.invert(currentInnerOffsetExtent[0]), x.invert(currentInnerOffsetExtent[1])];

  // use the new x scale to compute new time values
  // do not get out of total range for outer brush
  var newOuterTimeExtentLeft = d3.max([x.invert(currentOuterOffsetExtent[0]), totalDateExtent[0]], d => d.getTime());
  var newOuterTimeExtentRight = d3.min([x.invert(currentOuterOffsetExtent[1]), totalDateExtent[1]], d => d.getTime());
  var newOuterTimeExtent = [newOuterTimeExtentLeft, newOuterTimeExtentRight];
  x.domain(newOuterTimeExtent);

  // redraw components
  context.select(".area").attr("d", area)
  context.select('.x-axis').call(xAxis);

  // calculate new inner extent, using old inner extent on new x scale
  currentInnerOffsetExtent = [x(prevInnerTimeExtent[0]), x(prevInnerTimeExtent[1])]
  innerBrushFunc.move(innerBrush, currentInnerOffsetExtent);
}


function innerBrushed() {
  currentInnerOffsetExtent = d3.event.selection;
}


var dragging;
var currentOuterOffsetExtent = [0, width];
var currentInnerOffsetExtent = [300, 400];
var currentHandleIsWest;
var totalDateExtent;
var startTick;

d3.csv('dummy.csv', type, function(error, data) {
  totalDateExtent = d3.extent(data.map(function(d) { return d.date; }));

  x.domain(totalDateExtent);
  y.domain([0, d3.max(data.map(function(d) { return d.price; }))]);

  context.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);

  context.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + (height + 15) + ")")
      .call(xAxis);

  outerBrush = context.append("g")
      .attr("class", "outer-brush")
      .call(outerBrushFunc);

  outerBrush.on(".brush", null);

  innerBrush = context.append("g")
      .attr("class", "inner-brush")
      .call(innerBrushFunc)

  outerBrushFunc.move(outerBrush, [0, width]);
  innerBrushFunc.move(innerBrush, currentInnerOffsetExtent);
  innerBrush.select('.overlay').remove();
  outerBrush.select('.overlay').remove();
  outerBrush.select('.selection').attr('cursor', 'default');

  outerBrush.selectAll('.handle').on('mousedown', () => {
    currentHandleIsWest = d3.event.target.classList[1] === 'handle--w';
    dragging = true;
    window.requestAnimationFrame(tick);
  });

  d3.select('body').on("mousemove", () => {
    if (dragging) {
      var x = d3.event.pageX - margin.left;
      if (currentHandleIsWest) {
        currentOuterOffsetExtent[0] = x;
      } else {
        currentOuterOffsetExtent[1] = x;
      }
    }
  });
  d3.select('body').on('mouseup', () => {
    dragging = false;

  });
});

function tick(timestamp) {

  var isZoomingIn = currentOuterOffsetExtent[0] >= 0 && currentOuterOffsetExtent[1] <= width;

  if (isZoomingIn) {
    if (dragging) {
      // do not go within the inner brush
      currentOuterOffsetExtent[0] = Math.min(currentInnerOffsetExtent[0] - 10, currentOuterOffsetExtent[0]);
      currentOuterOffsetExtent[1] = Math.max(currentInnerOffsetExtent[1] + 10, currentOuterOffsetExtent[1]);

      // move outer brush selection rect -- normally done by d3.brush by default, but we disabled all brush events
      outerBrush.select('.selection').attr('x', currentOuterOffsetExtent[0]);
      outerBrush.select('.selection').attr('width', currentOuterOffsetExtent[1] - currentOuterOffsetExtent[0]);
    } else {

      // release, actually do the zoom in
      outerBrushedEnd(currentOuterOffsetExtent);

      // back to full width
      currentOuterOffsetExtent = [0, width];
      outerBrush.select('.selection').attr('width', width).attr('x',0);

    }
  }
  else {
    if (!startTick) startTick = timestamp;
    var deltaTick = timestamp - startTick;

    // get prev offset
    var offset = [currentOuterOffsetExtent[0], currentOuterOffsetExtent[1]];

    // get delta
    var deltaOffset = (currentHandleIsWest) ? currentOuterOffsetExtent[0] : currentOuterOffsetExtent[1] - width;

    deltaOffset *= deltaOffset * deltaTick * 0.000001;

    if (currentHandleIsWest) {
      offset[0] = - deltaOffset;
    } else {
      offset[1] = width + deltaOffset;
    }

    if (!dragging) {
      currentOuterOffsetExtent = [0, width];
    }

    outerBrushedEnd(offset);
  }

  if (dragging) {
    window.requestAnimationFrame(tick);
  }
}
