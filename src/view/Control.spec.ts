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
        var iRectangle: Rectangle;

        beforeEach( function () {
            iRectangle = new Rectangle( new Rect( 10, 10, 20, 20 ) );
            spyOn( iControl.painter, 'pushState' );
            spyOn( iControl.painter, 'intersectClipAreaWith' );
            spyOn( iRectangle, 'paint' );
            spyOn( iControl.painter, 'popState' );

            iControl.setContents( iRectangle );
        });

        it( 'should push the painter state', function() {
            expect( iControl.painter.pushState ).toHaveBeenCalled();
        });

        it( 'should set the painters clip area to the control bounds', function() {
            var iExpectedControlBounds = jasmine.objectContaining( { x: 0, y: 0, w: 500, h: 400 } );
            expect( iControl.painter.intersectClipAreaWith ).toHaveBeenCalledWith( iExpectedControlBounds );
        });

        it( 'should call paint on the provided viewee', function() {
            expect( iRectangle.paint ).toHaveBeenCalled();
        });

        it( 'should pop the painter state', function() {
            expect( iControl.painter.popState ).toHaveBeenCalled();
        });

    });


});