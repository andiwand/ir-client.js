var IR = IR || {};

IR.interface = IR.interface || {};

$.extend(IR.interface, {
  discover: Util.notImplemented,   // (int port, int timeout, int maxPacketSize) -> Station[]
  send: Util.notImplemented,       // (Station station, RawFrame raw)
  receive: Util.notImplemented,    // (Station station) -> RawFrame
  configure: Util.notImplemented,  // (Station station, String name, String ssid, String password)

  load: Util.notImplemented,       // TODO
  save: Util.notImplemented        // TODO
});
