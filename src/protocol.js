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
