var IR = IR || {};

IR.RawHelper = function(raw, settings) {
  andiwand.assert(raw instanceof IR.RawFrame);
  andiwand.assert(andiwand.isObject(settings));
  this._raw = raw;
  this._settings = settings;
  this._pos = 0;
};

IR.RawHelper.prototype.size = function() {
  return this._raw._times.length;
};

IR.RawHelper.prototype.position = function(pos) {
  if (pos) {
    andiwand.assert(isInt(pos));
    this._pos = pos;
  } else {
    return this._pos;
  }
};

IR.RawHelper.prototype.write = function(t) {
  this._raw._times[this._pos] = t;
  this._pos++;
};

IR.RawHelper.prototype.matchFrequency = function(reference) {
  var moe = this._settings[IR.const.error_frequency_key];
  return moe.check(this._raw._frequency, reference);
};

IR.RawHelper.prototype.matchTime = function(reference) {
  var moe = this._settings[IR.const.error_time_key];
  var time = this._raw._times[this._pos];
  var result = moe.check(time, reference);
  if (result) this._pos++;
  return result;
};

IR.RawHelper.prototype.match = function(references) {
  andiwand.assert(andiwand.isArray(references));
  for (var i = 0; i < references.length; i++) {
    if (this.matchTime(references[i])) return i;
  }
  return -1;
};
