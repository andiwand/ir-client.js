var IR = IR || {};

IR.remote = IR.remote || {};

$.extend(IR.remote, {
  state: null,
  _ready: false,
  _observers: [],
  init: function() {
    IR.interface.load(IR.remote._loaded);
  },
  isReady: function() {
    return IR.remote._ready;
  },
  _fire: function() {
    for(var i = 0; i < IR.remote._observers.length; i++) {
      IR.remote._observers[i]();
    }
  },
  addObserver: function(observer) {
    if (IR.remote._ready) observer();
    IR.remote._observers.push(observer);
  },
  _verify: function(config) {
    // TODO: implement
    return true;
  },
  _load: function(config) {
    var state = {};

    // TODO: maybe deep copy
    $.extend(state, config);
    state.devices = [];

    IR.remote.state = state;
  },
  _loaded: function(config) {
    IR.remote._verify(config);
    IR.remote._load(config);

    IR.remote._ready = true;
    IR.remote._fire();
  },
  save: function() {
    var config = {};

    // TODO: maybe deep copy
    $.extend(config, IR.remote.state);
    delete config.devices;

    IR.interface.save(config);
  }
});
