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
