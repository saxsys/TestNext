import {SpecRegistry} from '../src/testRunner/testCaseRegistry/specRegistry';


console.log('running a script works');


const glob = require('glob'), path = require('path');
var testFiles = [];

glob.sync( './dist/src/**/*.tstNxt.js').forEach( function( file ) {
  //require( path.resolve( file ) );
  testFiles.push(path.resolve(file));

});


testFiles.forEach((file) => {
  console.log(file);
  require(file);
});
// TODO continue here with running tests
console.log(SpecRegistry.getSpecClassNames());

