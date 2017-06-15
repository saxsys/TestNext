import {SpecExecChooser} from "../src/SpecRunning/specExecChooser/spec-exec-chooser";

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

SpecExecChooser.execBySubjects(showFailedOnly);





