var IR = IR || {};

IR.remote = IR.remote || {};

$.extend(IR.remote, {
  data: null,
  load: function() {
    IR.remote.data = IR.interface.load();
    // TODO: verify data
  },
  save: function() {
    IR.interface.save(data);
  }
});
