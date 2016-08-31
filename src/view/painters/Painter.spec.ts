import { Rect }    from '../geometry/Rect';
import { Painter } from './Painter';

class TestPainter extends Painter {
    public matrix;
    public clipArea;

    drawRectangle( aRect: Rect ): void {}
}

describe( "Painter", function() {

    var iPainter: TestPainter;

    beforeEach( function () {
        iPainter = new TestPainter()
    });


    describe( "translate()", function() {

        it( "should update the painter's transform matrix", function() {
            iPainter.translate( 10, 20 );
            iPainter.translate( 10, 20 );

            expect( iPainter.matrix.translateX ).toBe( 20 );
            expect( iPainter.matrix.translateY ).toBe( 40 );
        });

    });


    describe( "intersectClipAreaWith()", function() {

        it( "should set the clip area to the given rect if the clip area was not intersected before", function() {
            iPainter.intersectClipAreaWith( new Rect( 10, 10, 20, 20) );
            expect( iPainter.clipArea ).toEqualRect( 10, 10, 20, 20 );
        });

        it( "should intersect an existing clip area with the given rect", function() {
            iPainter.intersectClipAreaWith( new Rect( 10, 10, 20, 20) );
            iPainter.intersectClipAreaWith( new Rect( 15, 15, 20, 20) );
            expect( iPainter.clipArea ).toEqualRect( 15, 15, 15, 15 );
        });

    });


    describe( "isRectWithinClipArea()", function() {
        var iClipArea = new Rect( 10, 10, 20, 20);

        it( "should return true if there is no clip area", function() {
            var iRect = new Rect( 15, 15, 20, 20);

            var isWithin = iPainter.isRectWithinClipArea( iRect );
            expect( isWithin ).toBe( true );
        });

        it( "should return true if the provided rect and the clip area are overlapping", function() {
            var iRect = new Rect( 15, 15, 20, 20);

            iPainter.intersectClipAreaWith( iClipArea );
            var isWithin = iPainter.isRectWithinClipArea( iRect );
            expect( isWithin ).toBe( true );
        });

        it( "should return false if the provided rect and the clip area do not overlap", function() {
            var iRect = new Rect( 40, 40, 20, 20);

            iPainter.intersectClipAreaWith( iClipArea );
            var isWithin = iPainter.isRectWithinClipArea( iRect );
            expect( isWithin ).toBe( false );
        });

    });


    describe( "toAbsoluteRect()", function() {

        it( "should return the rect transformed to absolute coordinates", function() {
            var iRect = new Rect( 100, 100, 100, 100);

            iPainter.translate( 10, 20 );
            iPainter.translate( 10, 20 );

            var iAbsoluteRect = iPainter.toAbsoluteRect( iRect );

            expect( iAbsoluteRect ).toEqualRect( 120, 140, 100, 100 );
        });

    });

});
