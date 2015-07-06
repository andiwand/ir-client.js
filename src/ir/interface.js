var IR = IR || {};

IR.interface = IR.interface || {};

$.extend(IR.interface, {
  discover: notImplemented,   // (int port, int timeout, int maxPacketSize) -> Station[]
  send: notImplemented,       // (Station station, RawFrame raw)
  receive: notImplemented,    // (Station station) -> RawFrame
  configure: notImplemented,  // (Station station, String name, String ssid, String password)

  load: notImplemented,       // TODO
  save: notImplemented        // TODO
});
