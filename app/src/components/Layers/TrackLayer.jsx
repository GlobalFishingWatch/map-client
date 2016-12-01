/* eslint no-underscore-dangle:0 */
/* eslint func-names:0 */
const MATCH_COLOR = 'rgba(165, 247, 253, 1)';
const OUT_OF_INNER_EXTENT_COLOR = 'rgba(165, 247, 253, .1)';

const createTrackLayer = function (google) {
  function TrackLayer(map, width, height) {
    this.map = map;
    // Explicitly call setMap on this overlay.
    this.setMap(map);
    this.offset = {
      x: 0,
      y: 0
    };

    const canvas = document.createElement('canvas');
    canvas.style.border = '1px solid black';
    canvas.style.margin = '0';
    canvas.style.padding = '0';
    canvas.style.borderStyle = 'none';
    canvas.style.borderWidth = '0px';
    canvas.style.position = 'absolute';
    canvas.width = width;
    canvas.height = height;

    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    canvas.style.left = '0px';
    canvas.style.top = '0px';
    ctx.width = canvas.width = width;
    ctx.height = canvas.height = height;
    ctx.fillStyle = 'rgba(0,0,0,.4)';
    canvas.ctx = ctx;
    this.ctx = this.canvas.ctx;
  }

  TrackLayer.prototype = new google.maps.OverlayView();
  TrackLayer.prototype.regenerate = function () {
    this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  TrackLayer.prototype.recalculatePosition = function () {
    this.canvas.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const map = this.getMap();

    // topLeft can't be calculated from map.getBounds(), because bounds are
    // clamped to -180 and 180 when completely zoomed out. Instead, calculate
    // left as an offset from the center, which is an unwrapped LatLng.
    const top = map.getBounds().getNorthEast().lat();
    const center = map.getCenter();
    const scale = Math.pow(2, map.getZoom());
    const left = center.lng() - (this.canvasCssWidth_ * 180) / (256 * scale);
    this.topLeft_ = new google.maps.LatLng(top, left);

    // Canvas position relative to draggable map's container depends on
    // overlayView's projection, not the map's. Have to use the center of the
    // map for this, not the top left, for the same reason as above.
    const projection = this.getProjection();
    const divCenter = projection.fromLatLngToDivPixel(center);
    const offsetX = -Math.round(window.innerWidth / 2 - divCenter.x);
    const offsetY = -Math.round(window.innerHeight / 2 - divCenter.y);
    this.offset = {
      x: offsetX,
      y: offsetY
    };
    this.canvas.style[TrackLayer.CSS_TRANSFORM_] = `translate(${offsetX}px,${offsetY}px)`;
  };

  TrackLayer.CSS_TRANSFORM_ = (() => {
    const div = document.createElement('div');
    const transformProps = ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'];
    for (let i = 0; i < transformProps.length; i++) {
      const prop = transformProps[i];
      if (div.style[prop] !== undefined) {
        return prop;
      }
    }

    // return unprefixed version by default
    return transformProps[0];
  })();

  /**
   * Calculates the rendering style (color + alpha) to be drawn for the current vessel track/point
   * @param timestamp the current point timestamp
   * @param startTimestamp the starting timestamp from the timeline inner extent
   * @param endTimestamp the end timestamp from the timeline inner extent
   **/
  TrackLayer.prototype.getDrawStyle = function (timestamp, startTimestamp, endTimestamp) {
    if (timestamp > startTimestamp && timestamp < endTimestamp) {
      return MATCH_COLOR;
    }
    return OUT_OF_INNER_EXTENT_COLOR;
  };

  /**
   * Draws a single vessel point of a track
   * @param overlayProjection
   * @param data
   * @param i
   * @param drawStyle
   * @returns {*}
   */
  TrackLayer.prototype.drawPoint = function (overlayProjection, data, i, drawStyle) {
    const point = overlayProjection.fromLatLngToDivPixel(
      new google.maps.LatLng(data.latitude[i], data.longitude[i])
    );

    const weight = data.weight[i];
    if (weight > 0.75) {
      this.ctx.fillStyle = drawStyle;
      this.ctx.fillRect(~~point.x - this.offset.x, ~~point.y - this.offset.y, 2, 2);
    } else if (weight > 0.50) {
      this.ctx.fillStyle = drawStyle;
      this.ctx.fillRect(~~point.x - this.offset.x, ~~point.y - this.offset.y, 1, 1);
    } else {
      this.ctx.fillStyle = drawStyle;
      this.ctx.fillRect(~~point.x - this.offset.x, ~~point.y - this.offset.y, 1, 1);
    }
    return point;
  };

  /**
   * Draws the tile's content based on the provided vessel data
   *
   * @param data
   * @param series
   * @param filters
   * @param vesselTrackDisplayMode
   */
  TrackLayer.prototype.drawTile = function (data, series, filters, vesselTrackDisplayMode) {
    this.regenerate();
    const overlayProjection = this.getProjection();
    if (!overlayProjection || !data) {
      return;
    }

    let point = null;
    let previousPoint = null;
    let drawStyle = null;
    let previousDrawStyle = null;

    console.log('drawtile', filters, vesselTrackDisplayMode)
    let numPointsDrawn = 0;

    const startTimestamp = filters.timelineInnerExtent[0].getTime();
    const endTimestamp = filters.timelineInnerExtent[1].getTime();

    for (let i = 0, length = data.latitude.length; i < length; i++) {
      previousDrawStyle = drawStyle;
      previousPoint = point;
      // drawStyle = this.getDrawStyle(data, i, filters, series, vesselTrackDisplayMode);
      drawStyle = this.getDrawStyle(data.datetime[i], startTimestamp, endTimestamp);
      if (!drawStyle || series !== data.series[i]) {
        continue;
      }
      numPointsDrawn++;

      point = this.drawPoint(overlayProjection, data, i, drawStyle);

      if (previousDrawStyle !== drawStyle || (i > 0 && data.series[i - 1] !== data.series[i])) {
        if (previousDrawStyle) {
          this.ctx.stroke();
        }
        this.ctx.beginPath();
        this.ctx.strokeStyle = drawStyle;
        if ((i > 0 && data.series[i - 1] === data.series[i]) && previousPoint) {
          this.ctx.moveTo(~~previousPoint.x - this.offset.x, ~~previousPoint.y - this.offset.y);
        }
      }
      this.ctx.lineTo(~~point.x - this.offset.x, ~~point.y - this.offset.y);
    }

    if (numPointsDrawn > 0) {
      this.ctx.stroke();
    }
  };

  TrackLayer.prototype.onAdd = function () {
    const panes = this.getPanes();
    panes.overlayLayer.appendChild(this.canvas);
  };

  // We use the south-west and north-east
  // coordinates of the overlay to peg it to the correct position and size.
  // To do this, we need to retrieve the projection from the overlay.
  TrackLayer.prototype.draw = function () {

  };

  // The onRemove() method will be called automatically from the API if
  // we ever set the overlay's map property to 'null'.
  TrackLayer.prototype.onRemove = function () {
    this.canvas.parentNode.removeChild(this.canvas);
    this.canvas = null;
  };

  return TrackLayer;
};

export default createTrackLayer;
