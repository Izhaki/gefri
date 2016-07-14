var Jasmine = require('jasmine');
var jasmine = new Jasmine();

//jasmine.loadConfigFile( 'jasmine.json' );

jasmine.loadConfig({
  "spec_dir": "./src",
  "spec_files": [ "**/*.spec.ts" ],
  "stopSpecOnExpectationFailure": true,
  "random": false
});
jasmine.configureDefaultReporter({});

jasmine.onComplete(function(passed) {
    if(passed) {
        console.log( 'Ola Kala' );
    }
    else {
    }
});

jasmine.execute();
