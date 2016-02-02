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
