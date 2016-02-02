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
