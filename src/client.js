var IR = IR || {};

IR.client = IR.client || {};

$.extend(IR.remote, {
  default: {
    error_settings: {
      frequency_error: new andiwand.MarginOfError(0.1, false),
      time_error: new andiwand.MarginOfError(0.1, false)
    }
  },
  const: {
    error_frequency_key: "frequency_error",
    error_time_key: "time_error"
  }
});
