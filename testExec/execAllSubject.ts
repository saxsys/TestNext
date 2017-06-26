import 'reflect-metadata';

import {SpecExecChooser} from "../src/SpecRunning/specExecChooser/spec-exec-chooser";
import {RunReportOutputConsole} from "../src/SpecRunning/RunReportOutput/run-report-output-console";

const glob = require('glob');
const path = require('path');

let showFailedOnlyArg = process.argv[2];

let showFailedOnly = false;
if(showFailedOnlyArg == 'true')
  showFailedOnly = true;

let testFiles = [];

//load all testfiles
glob.sync('./dist/src/**/*.tstNxt.js').forEach(function (file) {
  //require( path.resolve( file ) );
  testFiles.push(path.resolve(file));
});

//load all test-files, Specr-Classes are getting registered
testFiles.forEach((file) => {
  //console.reportRun(file);
  require(file);
});

let specRunOutput = new RunReportOutputConsole();
specRunOutput.showFailedOnly(showFailedOnly);

SpecExecChooser.execBySubjects(specRunOutput);
specRunOutput.outputReport();




