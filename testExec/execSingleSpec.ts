import {SpecExecChooser} from "../src/specExecChooser/spec-exec-chooser";

let testName = process.argv[2];

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

SpecExecChooser.execSpec(testName);

//SpecExecChooser.execAllSpecs();
//SpecExecChooser.execBySubjects();
//SpecExecChooser.execSubject(subject);
//SpecExecChooser.execSpec('IncorrectTest');





