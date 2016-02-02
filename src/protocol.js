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
