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
