import { Context2DMock } from './../../Context2D.mock';
import { Rectangle } from './Rectangle';
import { Rect } from './../../geometry/Rect';
import { Painter } from './../../painters/Painter';

describe( 'Rectangle', function() {

    describe( 'paintSelf()', function() {
        var iRect        = new Rect( 10, 10, 20, 20),
            iRectangle   = new Rectangle( iRect ),
            iMockContext = new Context2DMock(),
            iPainter     = new Painter( iMockContext );

        it( 'should call drawRectangle on the painter provided', function() {
            spyOn( iPainter, 'drawRectangle' );

            iRectangle.paintSelf( iPainter );
            expect( iPainter.drawRectangle ).toHaveBeenCalledWith( iRect );
        });

    });

});
