import { Context2DMock } from './../Context2D.mock';
import { Rect } from './../geometry/Rect';
import { Painter } from './../painters/Painter';

describe( 'Painter', function() {

    describe( 'drawRectangle()', function() {

        it( 'should call rect on the context provided', function() {
            var iRect        = new Rect( 10, 10, 20, 20);
            var iMockContext = new Context2DMock();
            var iPainter     = new Painter( iMockContext )

            spyOn( iMockContext, 'rect' );

            iPainter.drawRectangle( iRect );
            expect( iMockContext.rect ).toHaveBeenCalledWith( 10, 10, 20, 20 );
        });

    });

});
