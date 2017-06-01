import {SpecRegistry} from '../src/specRegistry/spec-registry';


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
console.log(SpecRegistry.getSpecClassNames());


