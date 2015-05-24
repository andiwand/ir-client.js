var IR = IR || {};

IR.NecProtocol = new IR.Protocol("NEC", 38222);
$.extend(IR.NecProtocol, {
  __TIME_INIT_MARK: 9000e-6,
  __TIME_INIT_SPACE: 4500e-6,
  __TIME_REPEAT_SPACE: 2250e-6,
  __TIME_BIT_MARK: 562.5e-6,
  __TIME_ZERO_SPACE: 562.5e-6,
  __TIME_ONE_SPACE: 1687.5e-6,
  __TIME_END_MARK: 562.5e-6,
  __TIMES_DEFAULT: 67,
  __TIMES_REPEAT: 3,
  __BITS: 32,
  __REPEAT: 0xffffffff,

  getFrameClass: dynamicGet(IR, "NecFrame"),
  __encode: function(frame, helper, settings) {
    helper.write(this.__TIME_INIT_MARK);

    if (nec.__data === this.__REPEAT) {
      helper.write(this.__TIME_REPEAT_SPACE);
    } else {
      helper.write(this.__TIME_INIT_SPACE);

      // TODO: check bit order
      for (var i = 0; i < this.__BITS; i++) {
        helper.write(this.__TIME_BIT_MARK);
        if (((nec.__data >> i) & 1) !== 0) {
          helper.write(this.__TIME_ONE_SPACE);
        } else {
          helper.write(this.__TIME_ZERO_SPACE);
        }
      }
    }

    helper.write(this.__TIME_END_MARK);
  },
  __decode: function(helper, settings) {
    var data = 0;

    if (!helper.matchFrequency(this.frequency)) return null;
    if (!helper.matchTime(this.__TIME_INIT_MARK)) return null;

    if (helper.matchTime(this.__TIME_INIT_SPACE)) {
      // TODO: check bit order
      for (var i = 0; i < this.__BITS; i++) {
        if (!helper.matchTime(this.__TIME_BIT_MARK)) return null;
        if (helper.matchTime(this.__TIME_ONE_SPACE)) {
          data |= 1 << i;
        } else if (helper.matchTime(this.__TIME_ZERO_SPACE)) {
        } else {
          return null;
        }
      }
    } else if (helper.matchTime(this.__TIME_INIT_SPACE)) {
      data = this.__REPEAT;
    } else {
      return null;
    }

    if (!helper.matchTime(this.__TIME_END_MARK)) return null;
    if (helper.position() != helper.size()) return null;

    return new IR.NecFrame(data);
  }
});
