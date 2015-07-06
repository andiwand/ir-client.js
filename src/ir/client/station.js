var IR = IR || {};

IR.Station = function(name, address, port) {
  assert(isString(name));
  assert(isString(address));
  assert(isInt(port));
  this.name = name;
  this._address = address;
  this._port = port;
};

IR.Station.discover = function(port, timeout, maxSize) {
  assert(isInt(port));
  assert(isInt(timeout));
  assert(isInt(maxSize));
  IR.interface.discover(port, timeout, maxSize);
};

IR.Station.prototype.send = function(frame) {
  assert(frame instanceof IR.Frame);
  IR.interface.send(this, frame);
};

IR.Station.prototype.receive = function() {
  return IR.interface.receive(this);
};

IR.Station.prototype.configure = function(name, ssid, password) {
  assert(isString(name));
  assert(isString(ssid));
  assert(isString(password));
  IR.interface.configure(this, name, ssid, password);
};

IR.Station.prototype.serialize = function() {
  var result = {};
  result.name = this.name;
  result.address = this._address;
  result.port = this._port;
  return result;
};

IR.Station.deserialize = function(o) {
  return new IR.Station(o.name, o.address, o.port);
};