/* eslint no-underscore-dangle:0 */
import { TIMELINE_STEP } from '../../constants';

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
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    canvas.ctx = ctx;
    this.ctx = this.canvas.ctx;
    // this.pointStyles = ['rgba(0,101,193,0.7)','rgba(255,207,59,0.5)','rgba(0,255,242,1)'];
    this.pointStyles = ['rgba(255, 0, 0,1)', 'rgba(255, 0, 0,1)', 'rgba(255, 0, 0,1)'];
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

  TrackLayer.prototype.checkFilter = function (data, index, series, timestamp, filters) {
    if (series && data.series[index] === series) {
      return false;
    }
    if (timestamp && (data.datetime[index] - (data.datetime[index] % TIMELINE_STEP)) !== timestamp) {
      return false;
    }
    if (filters && filters.startDate && data.datetime[index] < filters.startDate) {
      return false;
    }
    if (filters && filters.endDate && data.datetime[index] > filters.endDate) {
      return false;
    }
    return true;
  };

  TrackLayer.prototype.drawTile = function (data, series, filters, timestamp) {
    let coords;
    this.regenerate();
    // debugger;
    const overlayProjection = this.getProjection();
    if (overlayProjection) {
      let nextPoint = null;
      let first = true;
      for (let i = 0, length = data.latitude.length; i < length; i++) {
        if (this.checkFilter(data, i, series, timestamp, filters)) {
          coords = overlayProjection.fromLatLngToDivPixel(
            new google.maps.LatLng(data.latitude[i], data.longitude[i])
          );
          const weight = data.weight[i];
          if (i + 1 < length) {
            nextPoint = overlayProjection.fromLatLngToDivPixel(
              new google.maps.LatLng(data.latitude[i + 1], data.longitude[i + 1])
            );
          }
          if (weight > 0.75) {
            this.ctx.fillStyle = this.pointStyles[0];
            this.ctx.fillRect(~~coords.x - this.offset.x, ~~coords.y - this.offset.y, 2, 2);
            continue;
          } else if (weight > 0.50) {
            this.ctx.fillStyle = this.pointStyles[1];
            this.ctx.fillRect(~~coords.x - this.offset.x, ~~coords.y - this.offset.y, 1, 1);
            continue;
          } else {
            this.ctx.fillStyle = this.pointStyles[2];
            this.ctx.fillRect(~~coords.x - this.offset.x, ~~coords.y - this.offset.y, 1, 1);
          }
        }
        if (nextPoint && !timestamp) {
          if (first) {
            this.ctx.beginPath();
            this.ctx.moveTo(~~coords.x - this.offset.x, ~~coords.y - this.offset.y);
            first = false;
          } else {
            this.ctx.strokeStyle = 'rgba(255,0,0, 1)';
            this.ctx.lineTo(~~nextPoint.x - this.offset.x, ~~nextPoint.y - this.offset.y);
          }
        }
      }
      if (!timestamp) {
        this.ctx.closePath();
        this.ctx.stroke();
      }
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
