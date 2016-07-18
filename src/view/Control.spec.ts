import { Control } from './Control';

describe( 'Control', function() {
    var iContainer,
        iChild,
        iTonyBlair;

    function createContainer() {
        iContainer = document.createElement( 'div' );

        // For headless browser
        iContainer.setAttribute( 'style','width:500px; height:400px;');

        // For mocks
        iContainer.offsetWidth  = 500;
        iContainer.offsetHeight = 400;
        document.body.appendChild( iContainer );
    }

    beforeEach( function () {
        createContainer();
        var iControl = new Control( iContainer );
        iChild = iContainer.firstElementChild;
    });

    describe( 'constructor()', function() {

        it( 'should create a canvas and add it to the container', function() {
            expect( iChild.tagName ).toBe( 'CANVAS' );
            expect( true ).toBe( true );
        });

        it( 'should size the canvas to the dimensions of its container', function() {
            expect( iChild.width  ).toBe( 500 );
            expect( iChild.height ).toBe( 400 );
        });

    });

});