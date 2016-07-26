import { Context2DMock } from './../../Context2D.mock';
import { Rectangle } from './Rectangle';
import { Rect } from './../../geometry/Rect';
import { Painter } from './../../painters/Painter';

describe( 'Rectangle', function() {

    describe( 'paint()', function() {

        it( 'should call drawRectangle on the painter provided', function() {
            var iRect        = new Rect( 10, 10, 20, 20);
            var iRectangle   = new Rectangle( iRect );
            var iMockContext = new Context2DMock();
            var iPainter     = new Painter( iMockContext )

            spyOn( iPainter, 'drawRectangle' );

            iRectangle.paint( iPainter );
            expect( iPainter.drawRectangle ).toHaveBeenCalledWith( iRect );
        });

    });

});
