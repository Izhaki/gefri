import { Context2DMock } from './../../Context2D.mock';
import { Rectangle } from './Rectangle';
import { Rect } from './../../geometry/Rect';

describe( 'Rectangle', function() {

    describe( 'paint()', function() {

        it( 'should call rect on the context provided', function() {
            var iRectangle   = new Rectangle( new Rect( 10, 10, 20, 20) );
            var iMockContext = new Context2DMock();

            spyOn( iMockContext, 'rect' );

            iRectangle.paint( iMockContext );
            expect( iMockContext.rect ).toHaveBeenCalledWith( 10, 10, 20, 20 );
        });

    });

});
