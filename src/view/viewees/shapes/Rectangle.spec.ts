import { Context2DMock }  from '../../../../mocks/Context2D';
import { Rectangle }      from './Rectangle';
import { Rect }           from './../../geometry/Rect';
import { ContextPainter } from './../../painters/ContextPainter';

describe( "Rectangle", function() {

    var iMockContext: Context2DMock,
        iPainter :    ContextPainter;


    beforeEach( function () {
        iMockContext = new Context2DMock();
        iPainter     = new ContextPainter( iMockContext )
    });


    describe( "paintSelf()", function() {

        var iRect        = new Rect( 10, 10, 20, 20),
            iRectangle   = new Rectangle( iRect );

        it( "should call drawRectangle on the painter provided", function() {
            spyOn( iPainter, 'drawRectangle' );

            iRectangle.paintSelf( iPainter );
            expect( iPainter.drawRectangle ).toHaveBeenCalledWith( iRect );
        });

    });

    describe( "getRectBounds()", function() {
        var iRect        = new Rect( 10, 10, 20, 20),
            iRectangle   = new Rectangle( iRect );

        it( "should return the bounds of the rectangle", function() {
            expect( iRectangle.getRectBounds() ).toBe( iRect );
        });

    });



});
