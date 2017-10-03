import * as path from 'path';
import * as glob from 'glob';
import 'reflect-metadata';

import {SpecRegistry} from "../SpecStorage/specRegistry/spec-registry";
import {specRegistry} from "../SpecStorage/specRegistry/spec-registry-storage";
import {config} from '../testNext.config';


export class SpecLoader {
  static loadSpecs(dirPath:string): SpecRegistry {
    let testFiles = [];

    //load all testfiles
    glob.sync(dirPath +'/**/*'+ config.specFiles.fileExtension + '.js').forEach(function (file) {
      //require( path.resolve( file ) );
      testFiles.push(path.resolve(file));
    });
    
    //load all test-files, Specr-Classes are getting registered
    testFiles.forEach((file) => {
      //console.reportRun(file);
      require(file);
    });

    return specRegistry;

  }

}
