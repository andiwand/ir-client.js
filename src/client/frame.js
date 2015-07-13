var IR = IR || {};

IR.Frame = function() {};

IR.Frame.prototype.toString = function() {
  return JSON.stringify(this.serialize());
};

IR.Frame.prototype.getProtocol = Util.notImplemented;

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
  Exception.assert(frame instanceof IR.Frame);
  var result = {};
  var protocol = frame.getProtocol();
  result.protocol = protocol.name;
  result.data = frame.serialize();
  return result;
};

IR.Frame.prototype.serialize = Util.notImplemented;

IR.Frame.deserialize = function(o) {
  var protocol = IR.Protocol.map[o.protocol];
  var frameClass = protocol.getFrameClass();
  return frameClass.deserialize(o.data);
};
