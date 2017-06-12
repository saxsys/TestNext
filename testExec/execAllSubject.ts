import {SpecExecChooser} from "../src/specExecChooser/spec-exec-chooser";

const glob = require('glob'), path = require('path');
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

SpecExecChooser.execBySubjects();





