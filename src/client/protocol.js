var IR = IR || {};

IR.Protocol = function(name, frequency) {
  Exception.assert(Object.isString(name));
  Exception.assert((frequency === null) || Object.isInt(frequency));
  this.name = name;
  this.frequency = frequency;

  IR.Protocol.map[name] = this;
};

IR.Protocol.map = {};

IR.Protocol.prototype.toString = function() {
  return this.name + " protocol";
};

IR.Protocol.prototype.getFrameClass = Util.notImplemented;

IR.Protocol.prototype.encode = function(frame, settings) {
  Exception.assert(frame instanceof this.getFrameClass());
  var raw = new IR.RawFrame(frame.getFrequency(), []);
  var helper = new IR.RawHelper(raw, settings);
  this._encode(frame, helper, settings);
  return raw;
};

IR.Protocol.prototype._encode = Util.notImplemented;

IR.Protocol.prototype.decode = function(raw, settings) {
  Exception.assert(raw instanceof IR.RawFrame);
  var helper = new IR.RawHelper(raw, settings);
  return this._decode(helper, settings);
};

IR.Protocol.prototype._decode = Util.notImplemented;
