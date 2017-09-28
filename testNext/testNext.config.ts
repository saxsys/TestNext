export var config = {
  specFiles:{
    fileExtension:"tstNxt",
  },
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
      clearScreenStyle: "\x1b[4A\x1b[0J", /*\x1b[2J\x1b[1;1H*/
      resetStyle: "\x1b[0m",
    }
  },
  outputParameters: {
    sAll: {
      cmd: 'showFailedOnly',
      param: [false],
      description: 'makes all executed Specs visible'
    },
    hIgn: {
      cmd: 'hideIgnored',
      description: 'hides all ignored Specs'
    },
    sNonExec: {
      cmd: 'showNonExecutable',
      description: 'show also non executable Specs'
    },
    hClean:{
      cmd: 'hideCleanup',
      description: 'hide cleanup if not failed'
    },
    oAlpha: {
      cmd: 'orderByAlphabet',
      description: 'order Results by Alphabet'
    },
    oExecStat: {
      cmd: 'orderByExecutionStatus',
      description: 'order Results by execution-status'
    },

  },
  runMode:{
    AllSpecs:{
      heading:'All Specs',
      methodName:'execAllSpecs',
      additionalArgumentCount:0,
    },
    AllSubjects:{
      heading:'Specs ordered by Subject',
      methodName:'execAllSubjects',
      additionalArgumentCount:0,
    },
    Subject:{
      heading:'All Specs of Subject',
      methodName:'execSubject',
      additionalArgumentCount:1,
    },
    Spec:{
      heading:'Spec with Name',
      methodName:'execSpec',
      additionalArgumentCount:1,
    }

  }
};
