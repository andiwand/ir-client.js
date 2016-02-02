var ir = ir || {};

ir.RawHelper = function(raw, settings) {
  andiwand.assert(raw instanceof ir.RawFrame);
  andiwand.assert(andiwand.isObject(settings));
  this._raw = raw;
  this._settings = settings;
  this._pos = 0;
};

ir.RawHelper.prototype.size = function() {
  return this._raw._times.length;
};

ir.RawHelper.prototype.position = function(pos) {
  if (pos) {
    andiwand.assert(isInt(pos));
    this._pos = pos;
  } else {
    return this._pos;
  }
};

ir.RawHelper.prototype.write = function(t) {
  this._raw._times[this._pos] = t;
  this._pos++;
};

ir.RawHelper.prototype.matchFrequency = function(reference) {
  var moe = this._settings[ir.const.error_frequency_key];
  return moe.check(this._raw._frequency, reference);
};

ir.RawHelper.prototype.matchTime = function(reference) {
  var moe = this._settings[ir.const.error_time_key];
  var time = this._raw._times[this._pos];
  var result = moe.check(time, reference);
  if (result) this._pos++;
  return result;
};

ir.RawHelper.prototype.match = function(references) {
  andiwand.assert(andiwand.isArray(references));
  for (var i = 0; i < references.length; i++) {
    if (this.matchTime(references[i])) return i;
  }
  return -1;
};
