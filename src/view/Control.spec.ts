import { Control } from './Control';
import { Context2DMock } from './Context2D.mock';
import { Rectangle } from './viewees/shapes/Rectangle';
import { Rect } from './geometry/Rect';

describe( 'Control', function() {
    var iContainer,
        iControl,
        iCanvas,
        iMockContext;

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
        iMockContext = new Context2DMock();

        var createElement = document.createElement;
        spyOn( document, 'createElement' ).and.callFake( function( tagName ) {

            var element = createElement.call( document, tagName );
            if ( tagName.toLowerCase() === 'canvas' ) {
                element.getContext = function() {
                    return iMockContext;
                }
            }
            return element;
        });
    });

    beforeEach( function () {
        createContainer();
        iControl = new Control( iContainer );
        iCanvas = iContainer.firstElementChild;
    });

    describe( 'constructor()', function() {

        it( 'should create a canvas and add it to the container', function() {
            expect( iCanvas.tagName ).toBe( 'CANVAS' );
            expect( true ).toBe( true );
        });

        it( 'should size the canvas to the dimensions of its container', function() {
            expect( iCanvas.width  ).toBe( 500 );
            expect( iCanvas.height ).toBe( 400 );
        });

    });

    describe( 'setContents()', function() {

        it( 'should call paint on the provided viewee', function() {
            var iRectangle = new Rectangle( new Rect( 10, 10, 20, 20 ) );
            spyOn( iRectangle, 'paint' )

            iControl.setContents( iRectangle );
            expect( iRectangle.paint ).toHaveBeenCalled();
        });

    });


});