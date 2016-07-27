import { Shape } from './Shape';
import { Context2DMock } from './../../Context2D.mock';
import { Painter } from './../../painters/Painter';

class MockShape extends Shape {
    paintSelf( aPainter: Painter ) {}
}

describe( 'Shape', function() {

    describe( 'paint()', function() {
        var iMockShape   = new MockShape(),
            iMockContext = new Context2DMock(),
            iPainter     = new Painter( iMockContext );

        it( 'should paint itself', function() {
            spyOn( iMockShape, 'paintSelf' );

            iMockShape.paint( iPainter );
            expect( iMockShape.paintSelf ).toHaveBeenCalledWith( iPainter );
        });

        it( 'should paint its children', function() {
            spyOn( iMockShape, 'paintChildren' );

            iMockShape.paint( iPainter );
            expect( iMockShape.paintChildren ).toHaveBeenCalledWith( iPainter );
        });

    });

});
