export var config = {
  specReportConsoleOutput: {
    style: {
      success: "\x1b[1;32m",
      invalid: "\x1b[1;33m",
      failedRun: "\x1b[1;31m",
      notExecuted: "\x1b[0;37m",
      heading: "\x1b[47;4;30m",
      subHeading: "\x1b[47;30m",
    },
    commands: {
      clearScreenStyle: "\x1b[2J\x1b[1;1H",
      resetStyle: "\x1b[0m",
    }
  }
};
