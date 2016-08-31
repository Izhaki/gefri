import { Context2DMock }  from '../../../mocks/Context2D';
import { Rect }           from '../geometry/Rect';
import { Painter }        from './Painter';
import { ContextPainter } from './ContextPainter';

describe( "ContextPainter", function() {

    var iMockContext,
        iPainter;

    beforeEach( function () {
        iMockContext = new Context2DMock();
        iPainter     = new ContextPainter( iMockContext )
    });

    describe( "translate()", function() {

        it( "should update the painter's transform matrix", function() {
            var iDelegate = spyOn( Painter.prototype, 'translate' );

            iPainter.translate( 10, 20 );

            expect( iDelegate ).toHaveBeenCalledWith( 10, 20 );
        });

        it( "should call translate on the context provided", function() {
            spyOn( iMockContext, 'translate' );

            iPainter.translate( 10, 20 );

            expect( iMockContext.translate ).toHaveBeenCalledWith( 10, 20 );
        });

    });


    describe( "drawRectangle()", function() {

        it( "should draw a rect on the context provided", function() {
            spyOn( iMockContext, 'rect' );

            var iRect = new Rect( 10, 10, 20, 20 );
            iPainter.drawRectangle( iRect );

            expect( iMockContext.rect ).toHaveBeenCalledWith( 10, 10, 20, 20 );
        });

    });


    describe( "intersectClipAreaWith()", function() {

        it( "should intersect the clip area with the given rect", function() {
            var iRect     = new Rect( 10, 10, 20, 20 ),
                iDelegate = spyOn( Painter.prototype, 'intersectClipAreaWith' );

            iPainter.intersectClipAreaWith( iRect );

            expect( iDelegate ).toHaveBeenCalledWith( iRect );
        });

        it( "should clip the context", function() {
            spyOn( iMockContext, 'rect' );
            spyOn( iMockContext, 'clip' );
            iPainter.intersectClipAreaWith( new Rect( 10, 10, 20, 20 ) );
            expect( iMockContext.rect ).toHaveBeenCalledWith( 9, 9, 22, 22 );
            expect( iMockContext.clip ).toHaveBeenCalled();
        });

    });


    describe( "pushState()", function() {

        it( "should store the canvas state", function() {
            spyOn( iMockContext, 'save' );

            iPainter.pushState();

            expect( iMockContext.save ).toHaveBeenCalled();
        });

    });


    describe( "popState()", function() {

        it( "should restore the canvas state", function() {
            spyOn( iMockContext, 'restore' );
            iPainter.pushState();

            iPainter.popState();

            expect( iMockContext.restore ).toHaveBeenCalled();
        });

        it( "should restore the transformation matrix", function() {
            iPainter.translate( 10, 15 );
            iPainter.pushState();
            iPainter.translate( 20, 20 );

            iPainter.popState();

            expect( iPainter.matrix.translateX ).toBe( 10 );
            expect( iPainter.matrix.translateY ).toBe( 15 );
        });

        it( "should restore the clip area when it is undefined", function() {
            iPainter.pushState();
            iPainter.intersectClipAreaWith( new Rect( 10, 10, 20, 20 ) );

            iPainter.popState();

            expect( iPainter.clipArea ).not.toBeDefined();
        });

        it( "should restore the clip area when it is defined", function() {
            iPainter.intersectClipAreaWith( new Rect( 10, 10, 20, 20 ) );
            iPainter.pushState();
            iPainter.intersectClipAreaWith( new Rect( 0, 0, 2, 2 ) );

            iPainter.popState();

            expect( iPainter.clipArea ).toEqualRect( 10, 10, 20, 20 );
        });


    });

});
