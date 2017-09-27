var byname = {
  Uint8: {
    size: Uint8Array.BYTES_PER_ELEMENT,
    array: 'Float32Array',
    getter: 'getUint8',
    setter: 'setUint8'
  },
  Int8: {
    size: Int8Array.BYTES_PER_ELEMENT,
    array: 'Float32Array',
    getter: 'getUint8',
    setter: 'setUint8'
  },
  Uint16: {
    size: Uint16Array.BYTES_PER_ELEMENT,
    array: 'Float32Array',
    getter: 'getUint16',
    setter: 'setUint16'
  },
  Int16: {
    size: Int16Array.BYTES_PER_ELEMENT,
    array: 'Float32Array',
    getter: 'getInt16',
    setter: 'setInt16'
  },
  Uint32: {
    size: Uint32Array.BYTES_PER_ELEMENT,
    array: 'Float32Array',
    getter: 'getUint32',
    setter: 'setUint32'
  },
  Int32: {
    size: Int32Array.BYTES_PER_ELEMENT,
    array: 'Float32Array',
    getter: 'getInt32',
    setter: 'setInt32'
  },
  Float32: {
    size: Float32Array.BYTES_PER_ELEMENT,
    array: 'Float32Array',
    getter: 'getFloat32',
    setter: 'setFloat32'
  },
  Float64: {
    size: Float64Array.BYTES_PER_ELEMENT,
    array: 'Float64Array',
    getter: 'getFloat64',
    setter: 'setFloat64'
  }
};

var writeStringToArrayBuffer = function (str, start, end, buf, bufstart) {
  if (end == undefined) {
    end = str.length;
  }
  if (start == undefined) {
    start = 0;
  }
  if (bufstart == undefined) {
    bufstart = start;
  }
  for (var i = start; i < end; i++) {
    buf[i - start + bufstart] = str.charCodeAt(i) & 0xff;
  }
};

var stringToArrayBuffer = function (str, start, end) {
  var self = this;

  if (end == undefined) {
    end = str.length;
  }
  if (start == undefined) {
    start = 0;
  }
  var res = new Uint8ClampedArray(end - start);
  writeStringToArrayBuffer(str, start, end, res, 0);
  return res.buffer;
};

var arrayBufferToString = function (buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
};

var pack = function (typespec, value, littleendian) {
  var array = new ArrayBuffer(typespec.size);
  new DataView(array)[typespec.setter](0, value, littleendian);
  return arrayBufferToString(array);
};

var Pack = {
  typemap: {
    byname: byname,
    byarray: {}
  },
  pack: pack,
  arrayBufferToString: arrayBufferToString,
  stringToArrayBuffer: stringToArrayBuffer,
  writeStringToArrayBuffer: writeStringToArrayBuffer
};
for (var name in Pack.typemap.byname) {
  var spec = Pack.typemap.byname[name];
  spec.name = name;
  Pack.typemap.byarray[spec.array] = spec;
}

export default Pack;
