var IR = IR || {};

IR.RawHelper = function(raw, settings) {
  assert(raw instanceof IR.RawFrame);
  assert(isObject(settings));
  this.__raw = raw;
  this.__settings = settings;
  this.__pos = 0;
};

IR.RawHelper.prototype.size = function() {
  return this.__raw.__times.length;
};

IR.RawHelper.prototype.position = function(pos) {
  if (pos) {
    assert(isInt(pos));
    this.__pos = pos;
  } else {
    return this.__pos;
  }
};

IR.RawHelper.prototype.write = function(t) {
  this.__raw.__times[this.__pos] = t;
  this.__pos++;
};

IR.RawHelper.prototype.matchFrequency = function(reference) {
  var moe = this.__settings[IR.const.error_frequency_key];
  return moe.check(this.__raw.__frequency, reference);
};

IR.RawHelper.prototype.matchTime = function(reference) {
  var moe = this.__settings[IR.const.error_time_key];
  var time = this.__raw.__times[this.__pos];
  var result = moe.check(time, reference);
  if (result) this.__pos++;
  return result;
};

IR.RawHelper.prototype.match = function(references) {
  assert(isArray(references));
  for (var i = 0; i < references.length; i++) {
    if (this.matchTime(references[i])) return i;
  }
  return -1;
};
