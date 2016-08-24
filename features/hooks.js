var mockDom = require( '../mocks/mockDom' );

var hooks = function () {

    this.Before( function ( aScenario, aNext ) {
        mockDom( [ 'dist/gefri.js' ], aNext );
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
