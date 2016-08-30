import { Shape }          from './Shape';
import { Context2DMock }  from '../../../../mocks/Context2D';
import { ContextPainter } from './../../painters/ContextPainter';
import { Painter }        from './../../painters/Painter';
import { Rect }           from './../../geometry/Rect';

class MockShape extends Shape {
    paintSelf( aPainter: Painter ) {}
    getRectBounds(): Rect { return new Rect( 10, 10, 20, 20); }
}

describe( "Shape", function() {

    var iMockContext: Context2DMock,
        iPainter:     ContextPainter,
        iMockShape:   MockShape;


    beforeEach( function () {
        iMockContext = new Context2DMock();
        iPainter     = new ContextPainter( iMockContext )
        iMockShape   = new MockShape();
    });


    describe( "paint()", function () {

        describe( "when the bound are within the painters clip area", function() {

            beforeEach( function () {
                spyOn( iMockShape, "isWithinClipArea" ).and.returnValue( true );
            });

            it( "should paint itself", function() {
                spyOn( iMockShape, "paintSelf" );

                iMockShape.paint( iPainter );
                expect( iMockShape.paintSelf ).toHaveBeenCalledWith( iPainter );
            });

            it( "should paint its children", function() {
                spyOn( iMockShape, "paintChildren" );

                iMockShape.paint( iPainter );
                expect( iMockShape.paintChildren ).toHaveBeenCalledWith( iPainter );
            });

        });

        describe( "when the bound are not within the painters clip area", function() {

            beforeEach( function() {
                spyOn( iMockShape, 'isWithinClipArea' ).and.returnValue( false );
            });

            it( "should paint itself", function() {
                spyOn( iMockShape, 'paintSelf' );

                iMockShape.paint( iPainter );
                expect( iMockShape.paintSelf ).not.toHaveBeenCalledWith( iPainter );
            });

            it( "should paint its children", function() {
                spyOn( iMockShape, 'paintChildren' );

                iMockShape.paint( iPainter );
                expect( iMockShape.paintChildren ).not.toHaveBeenCalledWith( iPainter );
            });

        });

    });


    describe( "beforeChildrenPainting()", function() {

        var iMockRectBounds = new Rect( 10, 10, 20, 20);

        beforeEach( function() {
            spyOn( iMockShape, 'getRectBounds' ).and.returnValue( iMockRectBounds );
            spyOn( iPainter, 'translate' );
            spyOn( iPainter, 'intersectClipAreaWith' );

            iMockShape.beforeChildrenPainting( iPainter );
        });

        it( "should call translate on the painter with the top-left corner of the shape rectangular bound", function() {
            expect( iPainter.translate ).toHaveBeenCalledWith( 10, 10 );
        });

        it( "should call intersect the clip region with its bounds", function() {
            expect( iPainter.intersectClipAreaWith ).toHaveBeenCalledWith( jasmine.objectContaining( { x: 10, y: 10, w: 20, h: 20 } ) );
        });

    });


    describe( "isWithinClipArea()", function() {

        it( "should return true if the bounds are within the painter's clip area", function() {
            spyOn( iPainter, 'isRectWithinClipArea' ).and.returnValue( true );

            var isWithin = iMockShape.isWithinClipArea( iPainter );
            expect( isWithin ).toBe( true );
        });

        it( "should return false if the bounds are not within the painter's clip area", function() {
            spyOn( iPainter, 'isRectWithinClipArea' ).and.returnValue( false );

            var isWithin = iMockShape.isWithinClipArea( iPainter );
            expect( isWithin ).toBe( false );
        });

    });


});
