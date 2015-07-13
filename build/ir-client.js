var IR = IR || {};

IR.client = IR.client || {};

$.extend(IR.remote, {
  default: {
    error_settings: {
      frequency_error: new andiwand.MarginOfError(0.1, false),
      time_error: new andiwand.MarginOfError(0.1, false)
    }
  },
  const: {
    error_frequency_key: "frequency_error",
    error_time_key: "time_error"
  }
});

var IR = IR || {};

IR.Frame = function() {};

IR.Frame.prototype.toString = function() {
  return JSON.stringify(this.serialize());
};

IR.Frame.prototype.getProtocol = andiwand.notImplemented;

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
  andiwand.assert(frame instanceof IR.Frame);
  var result = {};
  var protocol = frame.getProtocol();
  result.protocol = protocol.name;
  result.data = frame.serialize();
  return result;
};

IR.Frame.prototype.serialize = andiwand.notImplemented;

IR.Frame.deserialize = function(o) {
  var protocol = IR.Protocol.map[o.protocol];
  var frameClass = protocol.getFrameClass();
  return frameClass.deserialize(o.data);
};

var IR = IR || {};

IR.interface = IR.interface || {};

$.extend(IR.interface, {
  discover: andiwand.notImplemented,   // (int port, int timeout, int maxPacketSize) -> Station[]
  send: andiwand.notImplemented,       // (Station station, RawFrame raw)
  receive: andiwand.notImplemented,    // (Station station) -> RawFrame
  configure: andiwand.notImplemented,  // (Station station, String name, String ssid, String password)
});

var IR = IR || {};

IR.Protocol = function(name, frequency) {
  andiwand.assert(andiwand.isString(name));
  andiwand.assert((frequency === null) || andiwand.isInt(frequency));
  this.name = name;
  this.frequency = frequency;

  IR.Protocol.map[name] = this;
};

IR.Protocol.map = {};

IR.Protocol.prototype.toString = function() {
  return this.name + " protocol";
};

IR.Protocol.prototype.getFrameClass = andiwand.notImplemented;

IR.Protocol.prototype.encode = function(frame, settings) {
  andiwand.assert(frame instanceof this.getFrameClass());
  var raw = new IR.RawFrame(frame.getFrequency(), []);
  var helper = new IR.RawHelper(raw, settings);
  this._encode(frame, helper, settings);
  return raw;
};

IR.Protocol.prototype._encode = andiwand.notImplemented;

IR.Protocol.prototype.decode = function(raw, settings) {
  andiwand.assert(raw instanceof IR.RawFrame);
  var helper = new IR.RawHelper(raw, settings);
  return this._decode(helper, settings);
};

IR.Protocol.prototype._decode = andiwand.notImplemented;

var IR = IR || {};

IR.Station = function(name, address, port) {
  andiwand.assert(andiwand.isString(name));
  andiwand.assert(andiwand.isString(address));
  andiwand.assert(andiwand.isInt(port));
  this.name = name;
  this._address = address;
  this._port = port;
};

IR.Station.discover = function(port, timeout, maxSize) {
  andiwand.assert(andiwand.isInt(port));
  andiwand.assert(andiwand.isInt(timeout));
  andiwand.assert(andiwand.isInt(maxSize));
  IR.interface.discover(port, timeout, maxSize);
};

IR.Station.prototype.send = function(frame) {
  andiwand.assert(frame instanceof IR.Frame);
  IR.interface.send(this, frame);
};

IR.Station.prototype.receive = function() {
  return IR.interface.receive(this);
};

IR.Station.prototype.configure = function(name, ssid, password) {
  andiwand.assert(andiwand.isString(name));
  andiwand.assert(andiwand.isString(ssid));
  andiwand.assert(andiwand.isString(password));
  IR.interface.configure(this, name, ssid, password);
};

IR.Station.prototype.serialize = function() {
  var result = {};
  result.name = this.name;
  result.address = this._address;
  result.port = this._port;
  return result;
};

IR.Station.deserialize = function(o) {
  return new IR.Station(o.name, o.address, o.port);
};

var IR = IR || {};

IR.RawHelper = function(raw, settings) {
  andiwand.assert(raw instanceof IR.RawFrame);
  andiwand.assert(andiwand.isObject(settings));
  this._raw = raw;
  this._settings = settings;
  this._pos = 0;
};

IR.RawHelper.prototype.size = function() {
  return this._raw._times.length;
};

IR.RawHelper.prototype.position = function(pos) {
  if (pos) {
    andiwand.assert(isInt(pos));
    this._pos = pos;
  } else {
    return this._pos;
  }
};

IR.RawHelper.prototype.write = function(t) {
  this._raw._times[this._pos] = t;
  this._pos++;
};

IR.RawHelper.prototype.matchFrequency = function(reference) {
  var moe = this._settings[IR.const.error_frequency_key];
  return moe.check(this._raw._frequency, reference);
};

IR.RawHelper.prototype.matchTime = function(reference) {
  var moe = this._settings[IR.const.error_time_key];
  var time = this._raw._times[this._pos];
  var result = moe.check(time, reference);
  if (result) this._pos++;
  return result;
};

IR.RawHelper.prototype.match = function(references) {
  andiwand.assert(andiwand.isArray(references));
  for (var i = 0; i < references.length; i++) {
    if (this.matchTime(references[i])) return i;
  }
  return -1;
};

var IR = IR || {};

IR.NecFrame = function(data) {
  IR.Frame.call(this, IR.Frame);
  andiwand(andiwand.isInt32(data));
  this._data = data;
};

IR.NecFrame.prototype = Object.create(IR.Frame.prototype);

IR.NecFrame.prototype.constructor = IR.NecFrame;

IR.NecFrame.prototype.getProtocol = andiwand.dynamicGet(IR, "NecProtocol");

IR.NecFrame.prototype.serialize = function() {
  return this._data;
};

IR.NecFrame.deserialize = function(o) {
  return new IR.NecFrame(o);
};

var IR = IR || {};

IR.RawFrame = function(frequency, times) {
  IR.Frame.call(this, IR.Frame);
  andiwand(andiwand.isInt(frequency));
  andiwand(andiwand.isArray(times));
  this._frequency = frequency;
  this._times = times;
};

IR.RawFrame.prototype = Object.create(IR.Frame.prototype);

IR.RawFrame.prototype.constructor = IR.RawFrame;

IR.RawFrame.prototype.getProtocol = andiwand.dynamicGet(IR, "RawProtocol");

IR.RawFrame.prototype.getFrequency = function() {
  return this.frequency;
};

IR.RawFrame.prototype.serialize = function() {
  var result = {};
  result.frequency = this._frequency;
  result.times = this._times;
  return result;
};

IR.RawFrame.deserialize = function(o) {
  return new IR.RawFrame(o.frequency, o.times);
};

var IR = IR || {};

IR.NecProtocol = new IR.Protocol("NEC", 38222);
$.extend(IR.NecProtocol, {
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

  getFrameClass: andiwand.dynamicGet(IR, "NecFrame"),
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

    return new IR.NecFrame(data);
  }
});

var IR = IR || {};

IR.RawProtocol = new IR.Protocol("RAW", null);
$.extend(IR.RawProtocol, {
  getFrameClass: andiwand.dynamicGet(IR, "RawFrame"),
  encode: function(raw, settings) {
    return raw;
  },
  decode: function(raw, settings) {
    return raw;
  }
});
