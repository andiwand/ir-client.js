var IR = IR || {};

IR.Station = function(name, address, port) {
  assert(isString(name));
  assert(isString(address));
  assert(isInt(port));
  this.name = name;
  this.__address = address;
  this.__port = port;
};

IR.Station.discover = function(port, timeout, maxSize) {
  assert(isInt(port));
  assert(isInt(timeout));
  assert(isInt(maxSize));
  IR.__impl.station_discovery(port, timeout, maxSize);
};

IR.Station.prototype.send = function(frame) {
  assert(frame instanceof IR.Frame);
  IR.__impl.station_send(this, frame);
};

IR.Station.prototype.receive = function() {
  return IR.__impl.station_receive(this);
};

IR.Station.prototype.configure = function(name, ssid, password) {
  assert(isString(name));
  assert(isString(ssid));
  assert(isString(password));
  IR.__impl.station_configure(this, name, ssid, password);
};

IR.Station.prototype.serialize = function() {
  var result = {};
  result.name = this.name;
  result.address = this.__address;
  result.port = this.__port;
  return result;
};

IR.Station.deserialize = function(o) {
  return new IR.Station(o.name, o.address, o.port);
};
