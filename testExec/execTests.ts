import {SpecRegistry} from '../src/specRegistry/spec-registry';
import {AllSpecRunner} from "../src/allSpecRunner/all-spec-runner";
import {SpecRunLogger} from "../src/spec-run-logger/spec-logger";
import {SuccessLogBeautyfier} from "../src/spec-run-logger/spec-log-beautyfier";


console.log('running a script works');


const glob = require('glob'), path = require('path');
var testFiles = [];

//load all testfiles
glob.sync( './dist/src/**/*.tstNxt.js').forEach( function( file ) {
  //require( path.resolve( file ) );
  testFiles.push(path.resolve(file));

});

//load all test-files, Spec-Classes are getting registered
testFiles.forEach((file) => {
  console.log(file);
  require(file);
});

// TODO continue here with running tests
let specLogger = new SpecRunLogger();
let specReg = SpecRegistry.getRestryEntries();
console.log(specReg.length + ' specs to run');
let allSpecRunner = new AllSpecRunner(specReg, specLogger);
allSpecRunner.buildSingleSpecRunners();
allSpecRunner.runSpecs();
console.log(specLogger.getLogs().length + ' logs');
specLogger.getLogs().forEach((specLog) => {
  console.log(SuccessLogBeautyfier.SpecLogToString(specLog));
});


