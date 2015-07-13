var IR = IR || {};

IR.NecFrame = function(data) {
  IR.Frame.call(this, IR.Frame);
  andiwand(andiwand.isInt32(data));
  this._data = data;
};

IR.NecFrame.prototype = Object.create(IR.Frame.prototype);

IR.NecFrame.prototype.constructor = IR.NecFrame;

IR.NecFrame.prototype.getProtocol = andiwand.dynamicGet(IR, "NecProtocol");

IR.NecFrame.prototype.serialize = function() {
  return this._data;
};

IR.NecFrame.deserialize = function(o) {
  return new IR.NecFrame(o);
};