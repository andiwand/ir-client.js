var ir = ir || {};

ir.client = ir.client || {};

$.extend(ir.remote, {
  defaultSetting: {
    errorFrequency: new andiwand.MarginOfError(0.1, false),
    errorTime: new andiwand.MarginOfError(0.1, false)
  }
});

var ir = ir || {};

ir.Frame = function() {};

ir.Frame.prototype.toString = function() {
  return JSON.stringify(this.serialize());
};

ir.Frame.prototype.getProtocol = andiwand.notImplemented;

ir.Frame.prototype.getFrequency = function() {
  return this.getProtocol().frequency;
};

ir.Frame.prototype.encode = function(settings) {
  return this.getProtocol().encode(this, settings);
};

ir.Frame.prototype.decode = function(raw, settings) {
  return this.getProtocol().decode(raw, settings);
};

ir.Frame.serialize = function(frame) {
  andiwand.assert(frame instanceof ir.Frame);
  var result = {};
  var protocol = frame.getProtocol();
  result.protocol = protocol.name;
  result.data = frame.serialize();
  return result;
};

ir.Frame.prototype.serialize = andiwand.notImplemented;

ir.Frame.deserialize = function(o) {
  var protocol = ir.Protocol.map[o.protocol];
  var frameClass = protocol.getFrameClass();
  return frameClass.deserialize(o.data);
};

var ir = ir || {};

ir.interface = ir.interface || {};

$.extend(ir.interface, {
  discover:   andiwand.notImplemented,  // Station[] discover(int port, int timeout, int maxPacketSize)
  send:       andiwand.notImplemented,  // void send(Station station, RawFrame raw)
  receive:    andiwand.notImplemented,  // RawFrame receive(Station station)
  configure:  andiwand.notImplemented,  // void configure(Station station, String name, String ssid, String password)
});

var ir = ir || {};

ir.Protocol = function(name, frequency) {
  andiwand.assert(andiwand.isString(name));
  andiwand.assert((frequency === null) || andiwand.isInt(frequency));
  this.name = name;
  this.frequency = frequency;

  ir.Protocol.map[name] = this;
};

ir.Protocol.map = {};

ir.Protocol.prototype.toString = function() {
  return this.name + " protocol";
};

ir.Protocol.prototype.getFrameClass = andiwand.notImplemented;

ir.Protocol.prototype.encode = function(frame, settings) {
  andiwand.assert(frame instanceof this.getFrameClass());
  var raw = new ir.RawFrame(frame.getFrequency(), []);
  var helper = new ir.RawHelper(raw, settings);
  this._encode(frame, helper, settings);
  return raw;
};

ir.Protocol.prototype._encode = andiwand.notImplemented;

ir.Protocol.prototype.decode = function(raw, settings) {
  andiwand.assert(raw instanceof ir.RawFrame);
  var helper = new ir.RawHelper(raw, settings);
  return this._decode(helper, settings);
};

ir.Protocol.prototype._decode = andiwand.notImplemented;

var ir = ir || {};

ir.Station = function(name, address, port) {
  andiwand.assert(andiwand.isString(name));
  andiwand.assert(andiwand.isString(address));
  andiwand.assert(andiwand.isInt(port));
  this.name = name;
  this._address = address;
  this._port = port;
};

ir.Station.discover = function(port, timeout, maxSize) {
  andiwand.assert(andiwand.isInt(port));
  andiwand.assert(andiwand.isInt(timeout));
  andiwand.assert(andiwand.isInt(maxSize));
  ir.interface.discover(port, timeout, maxSize);
};

ir.Station.prototype.send = function(frame) {
  andiwand.assert(frame instanceof ir.Frame);
  ir.interface.send(this, frame);
};

ir.Station.prototype.receive = function() {
  return ir.interface.receive(this);
};

ir.Station.prototype.configure = function(name, ssid, password) {
  andiwand.assert(andiwand.isString(name));
  andiwand.assert(andiwand.isString(ssid));
  andiwand.assert(andiwand.isString(password));
  ir.interface.configure(this, name, ssid, password);
};

ir.Station.prototype.serialize = function() {
  var result = {};
  result.name = this.name;
  result.address = this._address;
  result.port = this._port;
  return result;
};

ir.Station.deserialize = function(o) {
  return new ir.Station(o.name, o.address, o.port);
};

var ir = ir || {};

ir.RawHelper = function(raw, settings) {
  andiwand.assert(raw instanceof ir.RawFrame);
  andiwand.assert(andiwand.isObject(settings));
  this._raw = raw;
  this._settings = settings;
  this._pos = 0;
};

ir.RawHelper.prototype.size = function() {
  return this._raw._times.length;
};

ir.RawHelper.prototype.position = function(pos) {
  if (pos) {
    andiwand.assert(isInt(pos));
    this._pos = pos;
  } else {
    return this._pos;
  }
};

ir.RawHelper.prototype.write = function(t) {
  this._raw._times[this._pos] = t;
  this._pos++;
};

ir.RawHelper.prototype.matchFrequency = function(reference) {
  var moe = this._settings[ir.const.error_frequency_key];
  return moe.check(this._raw._frequency, reference);
};

ir.RawHelper.prototype.matchTime = function(reference) {
  var moe = this._settings[ir.const.error_time_key];
  var time = this._raw._times[this._pos];
  var result = moe.check(time, reference);
  if (result) this._pos++;
  return result;
};

ir.RawHelper.prototype.match = function(references) {
  andiwand.assert(andiwand.isArray(references));
  for (var i = 0; i < references.length; i++) {
    if (this.matchTime(references[i])) return i;
  }
  return -1;
};

var ir = ir || {};

ir.NecFrame = function(data) {
  ir.Frame.call(this, ir.Frame);
  andiwand(andiwand.isInt32(data));
  this._data = data;
};

ir.NecFrame.prototype = Object.create(ir.Frame.prototype);

ir.NecFrame.prototype.constructor = ir.NecFrame;

ir.NecFrame.prototype.getProtocol = andiwand.dynamicGet(ir, "NecProtocol");

ir.NecFrame.prototype.serialize = function() {
  return this._data;
};

ir.NecFrame.deserialize = function(o) {
  return new ir.NecFrame(o);
};

var ir = ir || {};

ir.RawFrame = function(frequency, times) {
  ir.Frame.call(this, ir.Frame);
  andiwand(andiwand.isInt(frequency));
  andiwand(andiwand.isArray(times));
  this._frequency = frequency;
  this._times = times;
};

ir.RawFrame.prototype = Object.create(ir.Frame.prototype);

ir.RawFrame.prototype.constructor = ir.RawFrame;

ir.RawFrame.prototype.getProtocol = andiwand.dynamicGet(ir, "RawProtocol");

ir.RawFrame.prototype.getFrequency = function() {
  return this.frequency;
};

ir.RawFrame.prototype.serialize = function() {
  var result = {};
  result.frequency = this._frequency;
  result.times = this._times;
  return result;
};

ir.RawFrame.deserialize = function(o) {
  return new ir.RawFrame(o.frequency, o.times);
};

var ir = ir || {};

ir.NecProtocol = new ir.Protocol("NEC", 38222);
$.extend(ir.NecProtocol, {
  _TIME_INIT_MARK: 9000e-6,
  _TIME_INIT_SPACE: 4500e-6,
  _TIME_REPEAT_SPACE: 2250e-6,
  _TIME_BIT_MARK: 562.5e-6,
  _TIME_ZERO_SPACE: 562.5e-6,
  _TIME_ONE_SPACE: 1687.5e-6,
  _TIME_END_MARK: 562.5e-6,
  _TIMES_DEFAULT: 67,
  _TIMES_REPEAT: 3,
  _BITS: 32,
  _REPEAT: 0xffffffff,

  getFrameClass: andiwand.dynamicGet(ir, "NecFrame"),
  _encode: function(frame, helper, settings) {
    helper.write(this._TIME_INIT_MARK);

    if (nec._data === this._REPEAT) {
      helper.write(this._TIME_REPEAT_SPACE);
    } else {
      helper.write(this._TIME_INIT_SPACE);

      // TODO: check bit order
      for (var i = 0; i < this._BITS; i++) {
        helper.write(this._TIME_BIT_MARK);
        if (((nec._data >> i) & 1) !== 0) {
          helper.write(this._TIME_ONE_SPACE);
        } else {
          helper.write(this._TIME_ZERO_SPACE);
        }
      }
    }

    helper.write(this._TIME_END_MARK);
  },
  _decode: function(helper, settings) {
    var data = 0;

    if (!helper.matchFrequency(this.frequency)) return null;
    if (!helper.matchTime(this._TIME_INIT_MARK)) return null;

    if (helper.matchTime(this._TIME_INIT_SPACE)) {
      // TODO: check bit order
      for (var i = 0; i < this._BITS; i++) {
        if (!helper.matchTime(this._TIME_BIT_MARK)) return null;
        if (helper.matchTime(this._TIME_ONE_SPACE)) {
          data |= 1 << i;
        } else if (helper.matchTime(this._TIME_ZERO_SPACE)) {
        } else {
          return null;
        }
      }
    } else if (helper.matchTime(this._TIME_INIT_SPACE)) {
      data = this._REPEAT;
    } else {
      return null;
    }

    if (!helper.matchTime(this._TIME_END_MARK)) return null;
    if (helper.position() != helper.size()) return null;

    return new ir.NecFrame(data);
  }
});

var ir = ir || {};

ir.RawProtocol = new ir.Protocol("RAW", null);
$.extend(ir.RawProtocol, {
  getFrameClass: andiwand.dynamicGet(ir, "RawFrame"),
  encode: function(raw, settings) {
    return raw;
  },
  decode: function(raw, settings) {
    return raw;
  }
});
