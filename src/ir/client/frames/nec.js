var IR = IR || {};

IR.NecFrame = function(data) {
  IR.Frame.call(this, IR.Frame);
  assert(isInt32(data));
  this.__data = data;
};

IR.NecFrame.prototype = Object.create(IR.Frame.prototype);

IR.NecFrame.prototype.constructor = IR.NecFrame;

IR.NecFrame.prototype.getProtocol = dynamicGet(IR, "NecProtocol");

IR.NecFrame.prototype.serialize = function() {
  return this.__data;
};

IR.NecFrame.deserialize = function(o) {
  return new IR.NecFrame(o);
};
