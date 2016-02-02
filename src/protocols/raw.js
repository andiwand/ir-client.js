var ir = ir || {};

ir.RawProtocol = new ir.Protocol("RAW", null);
$.extend(ir.RawProtocol, {
  getFrameClass: andiwand.dynamicGet(ir, "RawFrame"),
  encode: function(raw, settings) {
    return raw;
  },
  decode: function(raw, settings) {
    return raw;
  }
});
