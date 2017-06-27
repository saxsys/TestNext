import 'reflect-metadata';
import {SpecExecChooser} from "../src/SpecRunning/specExecChooser/spec-exec-chooser";
import {SpecReportOutputConsole} from "../src/SpecRunning/RunReportOutput/spec-report-output-console";
import {SpecReporter} from "../src/SpecRunning/specRunReporter/spec-reporter";

const glob = require('glob');
const path = require('path');

let subjectName = process.argv[2];
let showFailedOnlyArg = process.argv[3];

let showFailedOnly = false;
if(showFailedOnlyArg == 'true')
  showFailedOnly = true;


let testFiles = [];

//load all testfiles
glob.sync('./dist/src/**/*.tstNxt.js').forEach(function (file) {
  //require( path.resolve( file ) );
  testFiles.push(path.resolve(file));
});

//load all test-files, SpecC-Classes are getting registered
testFiles.forEach((file) => {
  //console.reportRun(file);
  require(file);
});


let reporter = new SpecReporter();
let specRunOutput = new SpecReportOutputConsole(reporter);
specRunOutput.showFailedOnly(showFailedOnly);
try {
  SpecExecChooser.execSubject(subjectName, reporter);
} catch(error){
  console.error('\x1b[1;31m', 'Error: ' + error.message, '\x1b[0m');
}
specRunOutput.outputReport();







