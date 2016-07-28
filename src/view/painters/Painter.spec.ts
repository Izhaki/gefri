import { Context2DMock } from './../Context2D.mock';
import { Rect } from './../geometry/Rect';
import { Painter } from './../painters/Painter';

describe( 'Painter', function() {

    var iMockContext,
        iPainter;


    beforeEach( function () {
        iMockContext = new Context2DMock();
        iPainter     = new Painter( iMockContext )
    });


    describe( 'drawRectangle()', function() {

        it( 'should call rect on the context provided', function() {
            spyOn( iMockContext, 'rect' );

            var iRect = new Rect( 10, 10, 20, 20);
            iPainter.drawRectangle( iRect );

            expect( iMockContext.rect ).toHaveBeenCalledWith( 10, 10, 20, 20 );
        });

    });


    describe( 'translate()', function() {

        it( 'should call translate on the context provided', function() {
            spyOn( iMockContext, 'translate' );

            iPainter.translate( 10, 20 );

            expect( iMockContext.translate ).toHaveBeenCalledWith( 10, 20 );
        });

    });


    describe( 'pushState()', function() {

        it( 'should store the canvas state', function() {
            spyOn( iMockContext, 'save' );

            iPainter.pushState();

            expect( iMockContext.save ).toHaveBeenCalled();
        });

    });

    describe( 'popState()', function() {

        it( 'should restore the canvas state', function() {
            spyOn( iMockContext, 'restore' );

            iPainter.popState();

            expect( iMockContext.restore ).toHaveBeenCalled();
        });

    });


});
