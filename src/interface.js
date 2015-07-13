var IR = IR || {};

IR.interface = IR.interface || {};

$.extend(IR.interface, {
  discover: andiwand.notImplemented,   // (int port, int timeout, int maxPacketSize) -> Station[]
  send: andiwand.notImplemented,       // (Station station, RawFrame raw)
  receive: andiwand.notImplemented,    // (Station station) -> RawFrame
  configure: andiwand.notImplemented,  // (Station station, String name, String ssid, String password)
});
