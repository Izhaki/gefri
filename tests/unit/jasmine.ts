import { mockDom } from '../mocks/mockDom';
import { mockWaitForFrame } from '../mocks/mockWaitForFrame';
import * as di from '../../src/core/di';

const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

var Jasmine  = require( 'jasmine' );
var failFast = require( 'jasmine-fail-fast' );
var iJasmine  = new Jasmine();
var path = require('path');

// To support execution within both ES6(.ts) and transpiled ES5(.js) contexts:
// 1) We retrive the extension,
let extention = path.extname( __filename );
// 2) Set the path relative to this script.
let currentRelativePath = path.relative( process.cwd(), __dirname )
let specPath  = path.join( currentRelativePath, "/../../src")

iJasmine.loadConfig({
    "spec_dir":                     specPath,
    "spec_files":                   [ "**/*.spec" + extention ],
    "stopSpecOnExpectationFailure": true,
    "random":                       false,
    "helpers":                      [ "../tests/unit/jasmineCustomMatchers"  + extention ]
});

//iJasmine.configureDefaultReporter({});
iJasmine.addReporter( failFast.init() );

iJasmine.addReporter(new SpecReporter({  // add jasmine-spec-reporter
  spec: {
    displayPending: true
  }
}));

iJasmine.onComplete( function( passed ) {
    let exitCode = 1;

    if( passed ) {
        console.log( 'Ola Kala' );
        exitCode = 0;
    }

    iJasmine.exit( exitCode, process.platform, process.version, process.exit, require('exit') );
});

mockWaitForFrame( di );

mockDom( [], function () {
    iJasmine.execute();
});
