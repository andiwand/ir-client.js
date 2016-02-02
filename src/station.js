var ir = ir || {};

ir.Station = function(name, address, port) {
  andiwand.assert(andiwand.isString(name));
  andiwand.assert(andiwand.isString(address));
  andiwand.assert(andiwand.isInt(port));
  this.name = name;
  this._address = address;
  this._port = port;
};

ir.Station.discover = function(port, timeout, maxSize) {
  andiwand.assert(andiwand.isInt(port));
  andiwand.assert(andiwand.isInt(timeout));
  andiwand.assert(andiwand.isInt(maxSize));
  ir.interface.discover(port, timeout, maxSize);
};

ir.Station.prototype.send = function(frame) {
  andiwand.assert(frame instanceof ir.Frame);
  ir.interface.send(this, frame);
};

ir.Station.prototype.receive = function() {
  return ir.interface.receive(this);
};

ir.Station.prototype.configure = function(name, ssid, password) {
  andiwand.assert(andiwand.isString(name));
  andiwand.assert(andiwand.isString(ssid));
  andiwand.assert(andiwand.isString(password));
  ir.interface.configure(this, name, ssid, password);
};

ir.Station.prototype.serialize = function() {
  var result = {};
  result.name = this.name;
  result.address = this._address;
  result.port = this._port;
  return result;
};

ir.Station.deserialize = function(o) {
  return new ir.Station(o.name, o.address, o.port);
};
