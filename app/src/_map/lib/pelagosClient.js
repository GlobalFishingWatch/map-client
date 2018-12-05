import Pack from './Pack';

class PelagosClient {

  constructor() {
    this.MAGIC_COOKIE = 'tmtx';
  }

  obtainTile(url, token) {
    return new Promise(function (resolve, reject) {
      this.request = null;
      if (typeof XMLHttpRequest != 'undefined') {
        this.request = new XMLHttpRequest();
      } else {
        throw 'XMLHttpRequest is disabled';
      }
      this.resolve = resolve;
      this.reject = reject;
      this.request.open('GET', url, true);
      if (token) {
        this.request.setRequestHeader("Authorization", `Bearer ${token}`);
      }
      this.request.responseType = "arraybuffer";
      this.request.onload = this.handleData.bind(this);
      this.request.onerror = this.handleData.bind(this);
      this.request.send(null);
    }.bind(this));

  }

  handleData() {
    var self = this;
    if (!this.request) {
      return;
    }
    if (this.error) {
      return true;
    }

    if (this.request.readyState == 4) {
      /* HTTP reports success with a 200 status. The file protocol
       reports success with zero. HTTP returns zero as a status
       code for forbidden cross domain requests.
       https://developer.mozilla.org/En/Using_XMLHttpRequest */
      var success = this.request.status == 200 || (this.isFileUri && this.request.status == 0);
      if (!success) {
        this.resolve(null);
        return;
      }
    }

    if (!this.request.response) {
      return;
    }
    var length = this.request.response.byteLength;
    var response = this.request.response;
    var dataView = new DataView(response);

    if (length < 4 + 4) {
      return;
    }
    if (self.headerLen == null) {
      var cookie = Pack.arrayBufferToString(response.slice(0, 4));
      if (cookie != this.MAGIC_COOKIE) {
        this.reject('Could not load ' + this.url + ' due to incorrect file format. Cookie: [' + this.cookie + ']');
        return;
      }

      self.headerLen = dataView.getInt32(4, true);

      self.offset = 4 + 4;
    }
    if (length < self.offset + self.headerLen) {
      return;
    }
    if (!self.headerIsLoaded) {
      self.header = JSON.parse(Pack.arrayBufferToString(response.slice(self.offset, self.offset + self.headerLen)));
      self.rowLen = 0;
      self.header.colsByName = {};
      for (var colidx = 0; colidx < self.header.cols.length; colidx++) {
        var col = self.header.cols[colidx];
        col.idx = colidx;
        self.header.colsByName[col.name] = col;
        col.typespec = Pack.typemap.byname[col.type];

        if (col.multiplier != undefined && col.min != undefined) {
          col.min = col.min * col.multiplier;
        }
        if (col.offset != undefined && col.min != undefined) {
          col.min = col.min + col.offset;
        }
        if (col.multiplier != undefined && col.max != undefined) {
          col.max = col.max * col.multiplier;
        }
        if (col.offset != undefined && col.max != undefined) {
          col.max = col.max + col.offset;
        }

        self.rowLen += col.typespec.size;
      }
      ;

      self.offset += self.headerLen;

      // Add the padding to nearest 4-byte-boundary
      self.offset += (4 - self.headerLen % 4) % 4;

      self.headerIsLoaded = true;
      if (self.header.orientation != 'rowwise' && self.header.orientation != 'columnwise') {
        self.errorLoading({
          orientation: self.header.orientation,
          toString: function () {
            return 'Could not load ' + this.url + ' due to unsupported file orientation. Orientation: ' + this.orientation + '. Supported orientations: rowwise, columnwise.';
          }
        });
        return true;
      }

      // Empty tile, stop parsing.
      if (!self.rowLen) {
        self.allLoaded();
        return true;
      }
    }
    if (self.header.orientation == "rowwise") {
      var result = {};
      for (; self.offset + self.rowLen <= length; self.rowidx++) {
        var row = {};
        for (var colidx = 0; colidx < self.header.cols.length; colidx++) {
          var col = self.header.cols[colidx];
          var val = dataView[col.typespec.getter](self.offset, true);
          row[col.name] = val;
          self.offset += col.typespec.size;
        }
        // self.rowLoaded(row);

        result[col.name] = row;
      }
      if (self.rowidx == self.header.length) {
        // self.allLoaded();
        this.resolve(result);
      } else {
        // self.batchLoaded();
      }
    } else if (self.header.orientation == 'columnwise') {
      var colValues = null;
      var result = {};
      if (length >= self.offset + self.header.length * self.rowLen) {

        for (var colidx = 0; colidx < self.header.cols.length; colidx++) {
          var col = self.header.cols[colidx];

          colValues = new (eval(col.typespec.array))(response.slice(self.offset, self.offset + col.typespec.size * self.header.length))
          self.offset += self.header.length * col.typespec.size;

          result[col.name] = colValues;
        }

        // self.allLoaded();
        this.resolve(result);
        return true;
      }
    }
  }
}

export default PelagosClient;
