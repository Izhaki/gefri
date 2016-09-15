var mockDom  = require( '../mocks/mockDom' );
var Jasmine  = require('jasmine');
var failFast = require('jasmine-fail-fast');
var jasmine  = new Jasmine();

jasmine.loadConfig({
    "spec_dir":                     "./src",
    "spec_files":                   [ "**/*.spec.ts" ],
    "stopSpecOnExpectationFailure": true,
    "random":                       false,
    "helpers":                      [ "../tests/unit/jasmineCustomMatchers.js" ]
});

jasmine.configureDefaultReporter({});
jasmine.addReporter( failFast.init() );

jasmine.onComplete( function( passed ) {
    if( passed ) {
        console.log( 'Ola Kala' );
    }
});

mockDom( [], function () {
    jasmine.execute();
});
