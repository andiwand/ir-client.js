var IR = IR || {};

IR.default = {
  error_settings: {
    frequency_error: new MarginOfError(0.1, false),
    time_error: new MarginOfError(0.1, false)
  }
};

IR.const = {
  error_frequency_key: "frequency_error",
  error_time_key: "time_error"
};

IR.__impl =  IR.__impl || {
  station_discovery: notImplemented,  // (int port, int timeout, int maxPacketSize) -> Station[]
  station_send: notImplemented,       // (Station station, RawFrame raw)
  station_receive: notImplemented,    // (Station station) -> RawFrame
  station_configure: notImplemented,  // (Station station, String name, String ssid, String password)
};
