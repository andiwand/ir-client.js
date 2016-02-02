var ir = ir || {};

ir.NecFrame = function(data) {
  ir.Frame.call(this, ir.Frame);
  andiwand(andiwand.isInt32(data));
  this._data = data;
};

ir.NecFrame.prototype = Object.create(ir.Frame.prototype);

ir.NecFrame.prototype.constructor = ir.NecFrame;

ir.NecFrame.prototype.getProtocol = andiwand.dynamicGet(ir, "NecProtocol");

ir.NecFrame.prototype.serialize = function() {
  return this._data;
};

ir.NecFrame.deserialize = function(o) {
  return new ir.NecFrame(o);
};
