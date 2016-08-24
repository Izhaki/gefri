import { Control } from './Control';
import { Rectangle } from './viewees/shapes/Rectangle';
import { Rect } from './geometry/Rect';

describe( 'Control', function() {
    var iControl,
        iCanvas

    beforeEach( function () {
        var iViewElement = document.getElementById( 'view' );

        iViewElement.offsetWidth  = 500;
        iViewElement.offsetHeight = 400;
        iViewElement.innerHTML = '';

        iControl = new Control( iViewElement );
        iCanvas = iViewElement.firstElementChild;
    });

    describe( 'constructor()', function() {

        it( 'should create a canvas and add it to the container', function() {
            expect( iCanvas.tagName ).toBe( 'CANVAS' );
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