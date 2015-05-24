MarginOfError = function(error, absolute) {
  assert(isNumber(error));
  assert(isBoolean(absolute));
  this.__error = error;
  this.__absolute = absolute;
};
MarginOfError.prototype.checkAbsolute = function(value, reference, error) {
  if (error == Number.POSITIVE_INFINITY) return true;
  return (value >= (reference - error)) && (value <= (reference + error));
};
MarginOfError.prototype.checkRelative = function(value, reference, error) {
  if (error == Number.POSITIVE_INFINITY) return true;
  return this.checkAbsolute(value, reference, reference * error);
};
MarginOfError.prototype.check = function(value, reference) {
  if (this.__absolute) {
    return this.checkAbsolute(value, reference, this.__error);
  } else {
    return this.checkRelative(value, reference, this.__error);
  }
};

function throwError(message) {
  message = message || "Error";
  if (typeof Error !== "undefined") throw new Error(message);
  throw message;
}

function assert(condition, message) {
  if (!condition) throwError("Assertion failed");
}

function notImplemented() {
  throwError("not implemented");
}

function staticGet(o) {
  return function() { return o; };
}

function dynamicGet(o, prop) {
  return function() { return o[prop]; };
}

function isObject(o) {
  return typeof o === "object";
}

function isArray(o) {
  return $.isArray(o);
}

function isString(o) {
  return (typeof o === "string") || (o instanceof String);
}

function isBoolean(o) {
  return (typeof o === "boolean") || (o instanceof Boolean);
}

function isNumberInt(n) {
  return (n % 1) === 0;
}

function isNumberFloat(n) {
  return (n % 1) !== 0;
}

function isNumber(o) {
  return $.isNumeric(o);
}

function isInt(o) {
  return isNumber(o) && isNumberInt(o);
}

function isFloat(o) {
  return isNumber(o) && isNumberFloat(o);
}

function isInt32(o) {
  return isInt(o) && (o >= 0) && (o <= 0xffffffff);
}
