var IR = IR || {};

IR.remote = IR.remote || {};

$.extend(IR.remote, {
  data: null,
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
  _loaded: function(data) {
    // TODO: verify data
    IR.remote.data = data;
    IR.remote._ready = true;
    IR.remote._fire();
  },
  save: function() {
    IR.interface.save(data);
  }
});
