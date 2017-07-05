import 'reflect-metadata';

import {SpecExecChooser} from "../src/SpecRunning/specExecChooser/spec-exec-chooser";
import {SpecReportOutputConsole} from "../src/SpecRunning/RunReportOutput/spec-report-output-console";
import {SpecReporter} from "../src/SpecRunning/specReporting/specReporter/spec-reporter";
import {specRegistry} from "../src/SpecStorage/specRegistry/spec-registry-storage";

const glob = require('glob');
const path = require('path');

let showFailedOnlyArg = process.argv[2];

let showFailedOnly = false;
if (showFailedOnlyArg == 'true')
  showFailedOnly = true;

let testFiles = [];

//load all testfiles
glob.sync('./dist/src/**/*.tstNxt.js').forEach(function (file) {
  //require( path.resolve( file ) );
  testFiles.push(path.resolve(file));
});
try {
  //load all test-files, Specr-Classes are getting registered
  testFiles.forEach((file) => {
    //console.reportRun(file);
    require(file);
  });

  let reporter = new SpecReporter();
  let specRunOutput = new SpecReportOutputConsole(reporter);
  specRunOutput.showFailedOnly(showFailedOnly);
  specRunOutput.setHeading('Specs Ordered by Subject');

  SpecExecChooser.execBySubjects(specRegistry, reporter);
  specRunOutput.outputResult();
} catch (error) {
  console.error('\x1b[1;31m', 'Error: ' + error.message, '\x1b[0m');
}




