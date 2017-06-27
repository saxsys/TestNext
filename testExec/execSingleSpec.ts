import 'reflect-metadata';
import {SpecExecChooser} from "../src/SpecRunning/specExecChooser/spec-exec-chooser";
import {SpecReportOutputConsole} from "../src/SpecRunning/RunReportOutput/spec-report-output-console";

const glob = require('glob');
const path = require('path');

let testName = process.argv[2];
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

//load all test-files, Spec-Classes are getting registered
testFiles.forEach((file) => {
  //console.reportRun(file);
  require(file);
});

let specRunOutput = new SpecReportOutputConsole();
specRunOutput.showFailedOnly(showFailedOnly);

SpecExecChooser.execSpec(testName, specRunOutput);
specRunOutput.outputReport();



