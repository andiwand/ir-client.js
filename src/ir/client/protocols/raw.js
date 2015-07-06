var IR = IR || {};

IR.RawProtocol = new IR.Protocol("RAW", null);
$.extend(IR.RawProtocol, {
  getFrameClass: dynamicGet(IR, "RawFrame"),
  encode: function(raw, settings) {
    return raw;
  },
  decode: function(raw, settings) {
    return raw;
  }
});
