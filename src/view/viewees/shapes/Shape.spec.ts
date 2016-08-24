import { Shape }         from './Shape';
import { Context2DMock } from '../../../../mocks/Context2D';
import { Painter }       from './../../painters/Painter';
import { Rect }          from './../../geometry/Rect';

class MockShape extends Shape {
    paintSelf( aPainter: Painter ) {}
    getRectBounds(): Rect { return null }
}

describe( 'Shape', function() {

    var iMockContext,
        iPainter,
        iMockShape;


    beforeEach( function () {
        iMockContext = new Context2DMock();
        iPainter     = new Painter( iMockContext )
        iMockShape   = new MockShape();
    });

    describe( 'paint()', function() {


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


    describe( 'applyTransformations()', function() {
        var iMockRectBounds = new Rect( 10, 10, 20, 20);

        it( 'should call translate on the painter with the top-left corner of the shape rectangular bound', function() {
            spyOn( iMockShape, 'getRectBounds' ).and.returnValue( iMockRectBounds );
            spyOn( iPainter, 'translate' );

            iMockShape.applyTransformations( iPainter );
            expect( iPainter.translate ).toHaveBeenCalledWith( 10, 10 );
        });

    });


});
