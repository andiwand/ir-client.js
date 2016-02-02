var ir = ir || {};

ir.client = ir.client || {};

$.extend(ir.remote, {
  defaultSetting: {
    errorFrequency: new andiwand.MarginOfError(0.1, false),
    errorTime: new andiwand.MarginOfError(0.1, false)
  }
});
