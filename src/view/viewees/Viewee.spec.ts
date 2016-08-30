import { Viewee }         from './Viewee';
import { Context2DMock }  from '../../../mocks/Context2D';
import { ContextPainter } from './../painters/ContextPainter';
import { Painter }        from './../painters/Painter';

class TestViewee extends Viewee {
    paint( aPainter: Painter ) {}
}

describe( "Viewee", function() {
    var iTestViewee:  TestViewee,
        iMockContext: Context2DMock,
        iPainter:     ContextPainter;

    beforeEach( function() {
        iTestViewee  = new TestViewee();
        iMockContext = new Context2DMock();
        iPainter     = new ContextPainter( iMockContext );
    });

    describe( "paintChildren()", function() {
        var iChild1: TestViewee,
            iChild2: TestViewee;

        beforeEach( function() {
            iChild1 = new TestViewee();
            iChild2 = new TestViewee();

            iTestViewee.addChildren( iChild1, iChild2 );
        });

        it( "should push the painter state", function() {
            spyOn( iPainter, 'pushState' ).and.callThrough();

            iTestViewee.paintChildren( iPainter );

            expect( iPainter.pushState ).toHaveBeenCalled();
        });


        it( "should call the beforeChildrenPainting method", function() {
            spyOn( iTestViewee, 'beforeChildrenPainting' );

            iTestViewee.paintChildren( iPainter );

            expect( iTestViewee.beforeChildrenPainting ).toHaveBeenCalledWith( iPainter );
        });


        it( "should paint each of its children", function() {
            spyOn( iChild1, 'paint' );
            spyOn( iChild2, 'paint' );

            iTestViewee.paintChildren( iPainter );

            expect( iChild1.paint ).toHaveBeenCalledWith( iPainter );
            expect( iChild2.paint ).toHaveBeenCalledWith( iPainter );
        });

        it( "should pop the painter state", function() {
            spyOn( iPainter, 'popState' );

            iTestViewee.paintChildren( iPainter );

            expect( iPainter.popState ).toHaveBeenCalled();
        });


    });

    describe( "beforeChildrenPainting()", function() {

        it( "should apply transformations", function() {
            spyOn( iTestViewee, 'applyTransformations' );

            iTestViewee.beforeChildrenPainting( iPainter );

            expect( iTestViewee.applyTransformations ).toHaveBeenCalledWith( iPainter );
        });

    });

});
