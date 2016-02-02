var ir = ir || {};

ir.interface = ir.interface || {};

$.extend(ir.interface, {
  discover:   andiwand.notImplemented,  // Station[] discover(int port, int timeout, int maxPacketSize)
  send:       andiwand.notImplemented,  // void send(Station station, RawFrame raw)
  receive:    andiwand.notImplemented,  // RawFrame receive(Station station)
  configure:  andiwand.notImplemented,  // void configure(Station station, String name, String ssid, String password)
});
