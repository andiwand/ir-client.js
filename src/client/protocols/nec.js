var IR = IR || {};

IR.NecProtocol = new IR.Protocol("NEC", 38222);
$.extend(IR.NecProtocol, {
  _TIME_INIT_MARK: 9000e-6,
  _TIME_INIT_SPACE: 4500e-6,
  _TIME_REPEAT_SPACE: 2250e-6,
  _TIME_BIT_MARK: 562.5e-6,
  _TIME_ZERO_SPACE: 562.5e-6,
  _TIME_ONE_SPACE: 1687.5e-6,
  _TIME_END_MARK: 562.5e-6,
  _TIMES_DEFAULT: 67,
  _TIMES_REPEAT: 3,
  _BITS: 32,
  _REPEAT: 0xffffffff,

  getFrameClass: Util.dynamicGet(IR, "NecFrame"),
  _encode: function(frame, helper, settings) {
    helper.write(this._TIME_INIT_MARK);

    if (nec._data === this._REPEAT) {
      helper.write(this._TIME_REPEAT_SPACE);
    } else {
      helper.write(this._TIME_INIT_SPACE);

      // TODO: check bit order
      for (var i = 0; i < this._BITS; i++) {
        helper.write(this._TIME_BIT_MARK);
        if (((nec._data >> i) & 1) !== 0) {
          helper.write(this._TIME_ONE_SPACE);
        } else {
          helper.write(this._TIME_ZERO_SPACE);
        }
      }
    }

    helper.write(this._TIME_END_MARK);
  },
  _decode: function(helper, settings) {
    var data = 0;

    if (!helper.matchFrequency(this.frequency)) return null;
    if (!helper.matchTime(this._TIME_INIT_MARK)) return null;

    if (helper.matchTime(this._TIME_INIT_SPACE)) {
      // TODO: check bit order
      for (var i = 0; i < this._BITS; i++) {
        if (!helper.matchTime(this._TIME_BIT_MARK)) return null;
        if (helper.matchTime(this._TIME_ONE_SPACE)) {
          data |= 1 << i;
        } else if (helper.matchTime(this._TIME_ZERO_SPACE)) {
        } else {
          return null;
        }
      }
    } else if (helper.matchTime(this._TIME_INIT_SPACE)) {
      data = this._REPEAT;
    } else {
      return null;
    }

    if (!helper.matchTime(this._TIME_END_MARK)) return null;
    if (helper.position() != helper.size()) return null;

    return new IR.NecFrame(data);
  }
});
