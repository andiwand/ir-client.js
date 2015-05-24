MarginOfError = function(error, absolute) {
  assert(isNumber(error));
  assert(isBoolean(absolute));
  this.__error = error;
  this.__absolute = absolute;
};
MarginOfError.prototype.checkAbsolute = function(value, reference, error) {
  if (error == Number.POSITIVE_INFINITY) return true;
  return (value >= (reference - error)) && (value <= (reference + error));
};
MarginOfError.prototype.checkRelative = function(value, reference, error) {
  if (error == Number.POSITIVE_INFINITY) return true;
  return this.checkAbsolute(value, reference, reference * error);
};
MarginOfError.prototype.check = function(value, reference) {
  if (this.__absolute) {
    return this.checkAbsolute(value, reference, this.__error);
  } else {
    return this.checkRelative(value, reference, this.__error);
  }
};

function throwError(message) {
  message = message || "Error";
  if (typeof Error !== "undefined") throw new Error(message);
  throw message;
}

function assert(condition, message) {
  if (!condition) throwError("Assertion failed");
}

function notImplemented() {
  throwError("not implemented");
}

function staticGet(o) {
  return function() { return o; };
}

function dynamicGet(o, prop) {
  return function() { return o[prop]; };
}

function isObject(o) {
  return typeof o === "object";
}

function isArray(o) {
  return $.isArray(o);
}

function isString(o) {
  return (typeof o === "string") || (o instanceof String);
}

function isBoolean(o) {
  return (typeof o === "boolean") || (o instanceof Boolean);
}

function isNumberInt(n) {
  return (n % 1) === 0;
}

function isNumberFloat(n) {
  return (n % 1) !== 0;
}

function isNumber(o) {
  return $.isNumeric(o);
}

function isInt(o) {
  return isNumber(o) && isNumberInt(o);
}

function isFloat(o) {
  return isNumber(o) && isNumberFloat(o);
}

function isInt32(o) {
  return isInt(o) && (o >= 0) && (o <= 0xffffffff);
}

var IR = IR || {};

IR.Frame = function() {};

IR.Frame.prototype.toString = function() {
  return JSON.stringify(this.serialize());
};

IR.Frame.prototype.getProtocol = notImplemented;

IR.Frame.prototype.getFrequency = function() {
  return this.getProtocol().frequency;
};

IR.Frame.prototype.encode = function(settings) {
  return this.getProtocol().encode(this, settings);
};

IR.Frame.prototype.decode = function(raw, settings) {
  return this.getProtocol().decode(raw, settings);
};

IR.Frame.serialize = function(frame) {
  assert(frame instanceof IR.Frame);
  var result = {};
  var protocol = frame.getProtocol();
  result.protocol = protocol.name;
  result.data = frame.serialize();
  return result;
};

IR.Frame.prototype.serialize = notImplemented;

IR.Frame.deserialize = function(o) {
  var protocol = IR.Protocol.map[o.protocol];
  var frameClass = protocol.getFrameClass();
  return frameClass.deserialize(o.data);
};

var IR = IR || {};

IR.default = {
  error_settings: {
    frequency_error: new MarginOfError(0.1, false),
    time_error: new MarginOfError(0.1, false)
  }
};

IR.const = {
  error_frequency_key: "frequency_error",
  error_time_key: "time_error"
};

IR.__impl =  IR.__impl || {
  station_discovery: notImplemented,  // (int port, int timeout, int maxPacketSize) -> Station[]
  station_send: notImplemented,       // (Station station, RawFrame raw)
  station_receive: notImplemented,    // (Station station) -> RawFrame
  station_configure: notImplemented,  // (Station station, String name, String ssid, String password)
};

var IR = IR || {};

IR.Protocol = function(name, frequency) {
  assert(isString(name));
  assert((frequency === null) || isInt(frequency));
  this.name = name;
  this.frequency = frequency;

  IR.Protocol.map[name] = this;
};

IR.Protocol.map = {};

IR.Protocol.prototype.toString = function() {
  return this.name + " protocol";
};

IR.Protocol.prototype.getFrameClass = notImplemented;

IR.Protocol.prototype.encode = function(frame, settings) {
  assert(frame instanceof this.getFrameClass());
  var raw = new IR.RawFrame(frame.getFrequency(), []);
  var helper = new IR.RawHelper(raw, settings);
  this.__encode(frame, helper, settings);
  return raw;
};

IR.Protocol.prototype.__encode = notImplemented;

IR.Protocol.prototype.decode = function(raw, settings) {
  assert(raw instanceof IR.RawFrame);
  var helper = new IR.RawHelper(raw, settings);
  return this.__decode(helper, settings);
};

IR.Protocol.prototype.__decode = notImplemented;

var IR = IR || {};

IR.Station = function(name, address, port) {
  assert(isString(name));
  assert(isString(address));
  assert(isInt(port));
  this.name = name;
  this.__address = address;
  this.__port = port;
};

IR.Station.discover = function(port, timeout, maxSize) {
  assert(isInt(port));
  assert(isInt(timeout));
  assert(isInt(maxSize));
  IR.__impl.station_discovery(port, timeout, maxSize);
};

IR.Station.prototype.send = function(frame) {
  assert(frame instanceof IR.Frame);
  IR.__impl.station_send(this, frame);
};

IR.Station.prototype.receive = function() {
  return IR.__impl.station_receive(this);
};

IR.Station.prototype.configure = function(name, ssid, password) {
  assert(isString(name));
  assert(isString(ssid));
  assert(isString(password));
  IR.__impl.station_configure(this, name, ssid, password);
};

IR.Station.prototype.serialize = function() {
  var result = {};
  result.name = this.name;
  result.address = this.__address;
  result.port = this.__port;
  return result;
};

IR.Station.deserialize = function(o) {
  return new IR.Station(o.name, o.address, o.port);
};

var IR = IR || {};

IR.RawHelper = function(raw, settings) {
  assert(raw instanceof IR.RawFrame);
  assert(isObject(settings));
  this.__raw = raw;
  this.__settings = settings;
  this.__pos = 0;
};

IR.RawHelper.prototype.size = function() {
  return this.__raw.__times.length;
};

IR.RawHelper.prototype.position = function(pos) {
  if (pos) {
    assert(isInt(pos));
    this.__pos = pos;
  } else {
    return this.__pos;
  }
};

IR.RawHelper.prototype.write = function(t) {
  this.__raw.__times[this.__pos] = t;
  this.__pos++;
};

IR.RawHelper.prototype.matchFrequency = function(reference) {
  var moe = this.__settings[IR.const.error_frequency_key];
  return moe.check(this.__raw.__frequency, reference);
};

IR.RawHelper.prototype.matchTime = function(reference) {
  var moe = this.__settings[IR.const.error_time_key];
  var time = this.__raw.__times[this.__pos];
  var result = moe.check(time, reference);
  if (result) this.__pos++;
  return result;
};

IR.RawHelper.prototype.match = function(references) {
  assert(isArray(references));
  for (var i = 0; i < references.length; i++) {
    if (this.matchTime(references[i])) return i;
  }
  return -1;
};

var IR = IR || {};

IR.NecFrame = function(data) {
  IR.Frame.call(this, IR.Frame);
  assert(isInt32(data));
  this.__data = data;
};

IR.NecFrame.prototype = Object.create(IR.Frame.prototype);

IR.NecFrame.prototype.constructor = IR.NecFrame;

IR.NecFrame.prototype.getProtocol = dynamicGet(IR, "NecProtocol");

IR.NecFrame.prototype.serialize = function() {
  return this.__data;
};

IR.NecFrame.deserialize = function(o) {
  return new IR.NecFrame(o);
};

var IR = IR || {};

IR.RawFrame = function(frequency, times) {
  IR.Frame.call(this, IR.Frame);
  assert(isInt(frequency));
  assert(isArray(times));
  this.__frequency = frequency;
  this.__times = times;
};

IR.RawFrame.prototype = Object.create(IR.Frame.prototype);

IR.RawFrame.prototype.constructor = IR.RawFrame;

IR.RawFrame.prototype.getProtocol = dynamicGet(IR, "RawProtocol");

IR.RawFrame.prototype.getFrequency = function() {
  return this.frequency;
};

IR.RawFrame.prototype.serialize = function() {
  var result = {};
  result.frequency = this.__frequency;
  result.times = this.__times;
  return result;
};

IR.RawFrame.deserialize = function(o) {
  return new IR.RawFrame(o.frequency, o.times);
};

var IR = IR || {};

IR.NecProtocol = new IR.Protocol("NEC", 38222);
$.extend(IR.NecProtocol, {
  __TIME_INIT_MARK: 9000e-6,
  __TIME_INIT_SPACE: 4500e-6,
  __TIME_REPEAT_SPACE: 2250e-6,
  __TIME_BIT_MARK: 562.5e-6,
  __TIME_ZERO_SPACE: 562.5e-6,
  __TIME_ONE_SPACE: 1687.5e-6,
  __TIME_END_MARK: 562.5e-6,
  __TIMES_DEFAULT: 67,
  __TIMES_REPEAT: 3,
  __BITS: 32,
  __REPEAT: 0xffffffff,

  getFrameClass: dynamicGet(IR, "NecFrame"),
  __encode: function(frame, helper, settings) {
    helper.write(this.__TIME_INIT_MARK);

    if (nec.__data === this.__REPEAT) {
      helper.write(this.__TIME_REPEAT_SPACE);
    } else {
      helper.write(this.__TIME_INIT_SPACE);

      // TODO: check bit order
      for (var i = 0; i < this.__BITS; i++) {
        helper.write(this.__TIME_BIT_MARK);
        if (((nec.__data >> i) & 1) !== 0) {
          helper.write(this.__TIME_ONE_SPACE);
        } else {
          helper.write(this.__TIME_ZERO_SPACE);
        }
      }
    }

    helper.write(this.__TIME_END_MARK);
  },
  __decode: function(helper, settings) {
    var data = 0;

    if (!helper.matchFrequency(this.frequency)) return null;
    if (!helper.matchTime(this.__TIME_INIT_MARK)) return null;

    if (helper.matchTime(this.__TIME_INIT_SPACE)) {
      // TODO: check bit order
      for (var i = 0; i < this.__BITS; i++) {
        if (!helper.matchTime(this.__TIME_BIT_MARK)) return null;
        if (helper.matchTime(this.__TIME_ONE_SPACE)) {
          data |= 1 << i;
        } else if (helper.matchTime(this.__TIME_ZERO_SPACE)) {
        } else {
          return null;
        }
      }
    } else if (helper.matchTime(this.__TIME_INIT_SPACE)) {
      data = this.__REPEAT;
    } else {
      return null;
    }

    if (!helper.matchTime(this.__TIME_END_MARK)) return null;
    if (helper.position() != helper.size()) return null;

    return new IR.NecFrame(data);
  }
});

var IR = IR || {};

IR.RawProtocol = new IR.Protocol("RAW", null);
$.extend(IR.RawProtocol, {
  getFrameClass: dynamicGet(IR, "RawFrame"),
  encode: function(raw, settings) {
    return raw;
  },
  decode: function(raw, settings) {
    return raw;
  }
});
