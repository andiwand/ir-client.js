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
