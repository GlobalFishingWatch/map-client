class Bounds {
  constructor(bounds) {
    var self = this;

    self.left = undefined;
    self.bottom = undefined;
    self.right = undefined;
    self.top = undefined;
    this.update(bounds);
  }

  /**  */
  clone() {
    var self = this;
    return new self.constructor(self);
  }

  getWidth() {
    var self = this;
    return self.right - self.left;
  }

  getHeight() {
    var self = this;
    return self.top - self.bottom;
  }

  toArray() {
    return [this.left, this.bottom, this.right, this.top];
  }

  toBBOX() {
    var self = this;
    return self.left + "," + self.bottom + "," + self.right + "," + self.top;
  }

  contains(x, y, inclusive) {
    if (inclusive == undefined) {
      inclusive = true;
    }

    if (inclusive) {
      return ((x >= this.left) && (x <= this.right) &&
      (y >= this.bottom) && (y <= this.top));
    } else {
      return ((x > this.left) && (x < this.right) &&
      (y > this.bottom) && (y < this.top));
    }
  }

  containsBounds(bounds, partial, inclusive) {
    if (partial == null) {
      partial = false;
    }
    if (inclusive == null) {
      inclusive = true;
    }
    var bottomLeft = this.contains(bounds.left, bounds.bottom, inclusive);
    var bottomRight = this.contains(bounds.right, bounds.bottom, inclusive);
    var topLeft = this.contains(bounds.left, bounds.top, inclusive);
    var topRight = this.contains(bounds.right, bounds.top, inclusive);

    return (partial) ? (bottomLeft || bottomRight || topLeft || topRight)
      : (bottomLeft && bottomRight && topLeft && topRight);
  }

  intersectsBounds(bounds, options) {
    if (typeof options === "boolean") {
      options = { inclusive: options };
    }
    options = options || {};
    if (options.worldBounds) {
      var self = this.wrapDateLine(options.worldBounds);
      bounds = bounds.wrapDateLine(options.worldBounds);
    } else {
      self = this;
    }
    if (options.inclusive == null) {
      options.inclusive = true;
    }
    var intersects = false;
    var mightTouch = (
      self.left == bounds.right ||
      self.right == bounds.left ||
      self.top == bounds.bottom ||
      self.bottom == bounds.top
    );

    // if the two bounds only touch at an edge, and inclusive is false,
    // then the bounds don't *really* intersect.
    if (options.inclusive || !mightTouch) {
      // otherwise, if one of the boundaries even partially contains another,
      // inclusive of the edges, then they do intersect.
      var inBottom = (
        ((bounds.bottom >= self.bottom) && (bounds.bottom <= self.top)) ||
        ((self.bottom >= bounds.bottom) && (self.bottom <= bounds.top))
      );
      var inTop = (
        ((bounds.top >= self.bottom) && (bounds.top <= self.top)) ||
        ((self.top > bounds.bottom) && (self.top < bounds.top))
      );
      var inLeft = (
        ((bounds.left >= self.left) && (bounds.left <= self.right)) ||
        ((self.left >= bounds.left) && (self.left <= bounds.right))
      );
      var inRight = (
        ((bounds.right >= self.left) && (bounds.right <= self.right)) ||
        ((self.right >= bounds.left) && (self.right <= bounds.right))
      );
      intersects = ((inBottom || inTop) && (inLeft || inRight));
    }
    // document me
    if (options.worldBounds && !intersects) {
      var world = options.worldBounds;
      var width = world.getWidth();
      var selfCrosses = !world.containsBounds(self);
      var boundsCrosses = !world.containsBounds(bounds);
      if (selfCrosses && !boundsCrosses) {
        bounds = bounds.add(-width, 0);
        intersects = self.intersectsBounds(bounds, { inclusive: options.inclusive });
      } else if (boundsCrosses && !selfCrosses) {
        self = self.add(-width, 0);
        intersects = bounds.intersectsBounds(self, { inclusive: options.inclusive });
      }
    }
    return intersects;
  }

  /* Extensions on top of what OpenLayers support */
  containsObj(obj, partial, inclusive) {
    var self = this;
    return self.containsBounds(obj, partial, inclusive);
  }

  intersectsObj(obj, options) {
    var self = this;
    return self.intersectsBounds(obj, options);
  }

  /**
   * Move right and left edges whole revolutions around the globe so
   * that they are within world bounds. */
  rewrapDateLine(world) {
    var self = this;
    if (self.left >= world.left && self.right <= world.right) {
      return self;
    }
    var worldWidth = world.getWidth();
    var res = self.clone();
    while (res.left < world.left) {
      res.left += worldWidth;
    }
    while (res.left > world.right) {
      res.left -= worldWidth;
    }
    while (res.right < world.left) {
      res.right += worldWidth;
    }
    while (res.right > world.right) {
      res.right -= worldWidth;
    }

    /* Normalize the special case around the dateline so that the
     * return values from this function are unique */
    if (res.left == 180) {
      res.left = -180;
    }
    if (res.right == -180) {
      res.right = 180;
    }
    return res;
  }

  /**
   * Move the right edge whole revolutions around the globe until
   * right > left (numerically). */
  unwrapDateLine(world) {
    var self = this;
    if (self.left <= self.right) {
      return self;
    }
    var res = self.clone();
    while (res.left > res.right) {
      res.right += world.getWidth();
    }
    return res;
  }

  getBounds() {
    return this;
  }

  /**
   * Update the Bounds object in place.
   *
   * update("left,bottom,right,top")
   * update([left,bottom,right,top]);
   * update(obj, obj, ...);
   */
  update() {
    var self = this;

    var updateOne = function (obj) {
      var left = undefined;
      var bottom = undefined;
      var right = undefined;
      var top = undefined;


      if (obj.length !== undefined) {
        if (typeof(obj) == "string") {
          obj = obj.split(",");
        }
        self.left = parseFloat(obj[0]);
        self.bottom = parseFloat(obj[1]);
        self.right = parseFloat(obj[2]);
        self.top = parseFloat(obj[3]);
      } else {
        if (obj.getBounds !== undefined) {
          obj = obj.getBounds();
        }

        if (obj.left !== undefined) {
          left = obj.left;
        }
        if (obj.bottom !== undefined) {
          bottom = obj.bottom;
        }
        if (obj.right !== undefined) {
          right = obj.right;
        }
        if (obj.top !== undefined) {
          top = obj.top;
        }
      }

      if (left) {
        left = parseFloat(left);
      }
      if (bottom) {
        bottom = parseFloat(bottom);
      }
      if (right) {
        right = parseFloat(right);
      }
      if (top) {
        top = parseFloat(top);
      }

      if (left !== undefined) {
        self.left = left;
      }
      if (bottom !== undefined) {
        self.bottom = bottom;
      }
      if (right !== undefined) {
        self.right = right;
      }
      if (top !== undefined) {
        self.top = top;
      }
    };

    for (var i = 0; i < arguments.length; i++) {
      updateOne(arguments[i]);
    }
  }

  toString() {
    var self = this;
    return self.toBBOX();
  }

  toJSON() {
    var self = this;
    return { left: self.left, right: self.right, top: self.top, bottom: self.bottom }
  }
}

export default Bounds;
