import { Context2DMock } from '../../../../mocks/Context2D';
import { Rectangle } from './Rectangle';
import { Rect } from './../../geometry/Rect';
import { Painter } from './../../painters/Painter';

describe( 'Rectangle', function() {

    var iMockContext,
        iPainter;


    beforeEach( function () {
        iMockContext = new Context2DMock();
        iPainter     = new Painter( iMockContext )
    });


    describe( 'paintSelf()', function() {

        var iRect        = new Rect( 10, 10, 20, 20),
            iRectangle   = new Rectangle( iRect );

        it( 'should call drawRectangle on the painter provided', function() {
            spyOn( iPainter, 'drawRectangle' );

            iRectangle.paintSelf( iPainter );
            expect( iPainter.drawRectangle ).toHaveBeenCalledWith( iRect );
        });

    });

    describe( 'getRectBounds()', function() {
        var iRect        = new Rect( 10, 10, 20, 20),
            iRectangle   = new Rectangle( iRect );

        it( 'should return the bounds of the rectangle', function() {
            expect( iRectangle.getRectBounds() ).toBe( iRect );
        });

    });



});
