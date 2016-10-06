var mockDom          = require( '../../../tests/mocks/mockDom' );
var mockWaitForFrame = require( '../../../tests/mocks/mockWaitForFrame.ts' ).mockWaitForFrame;

var hooks = function () {

    this.Before( function ( aScenario, aNext ) {
        mockDom( [ 'demo/gefri.js' ], aNext );
    });

    this.Before( function ( aScenario, aNext ) {
        mockWaitForFrame( gefri.di );
        this.inject       = gefri.di.inject;
        this.waitForFrame = this.inject( 'waitForFrame' );
        aNext();
    });

    this.Before( function ( aScenario, aNext ) {
        var iViewElement = document.getElementById( 'view' );

        iViewElement.offsetWidth  = 500;
        iViewElement.offsetHeight = 400;
        iViewElement.innerHTML = '';

        this.control = new gefri.view.Control( iViewElement );

        aNext();
    });

};

module.exports = hooks;
