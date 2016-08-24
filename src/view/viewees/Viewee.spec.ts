import { Viewee } from './Viewee';
import { Context2DMock } from '../../../mocks/Context2D';
import { Painter } from './../painters/Painter';

class MockViewee extends Viewee {
    paint( aPainter: Painter ) {}
}

describe( 'Viewee', function() {

    describe( 'paintChildren()', function() {
        var iMockViewee  = new MockViewee(),
            iChild1      = new MockViewee(),
            iChild2      = new MockViewee(),

            iMockContext = new Context2DMock(),
            iPainter     = new Painter( iMockContext );

        iMockViewee.addChildren( iChild1, iChild2 );

        it( 'should push the painter state', function() {
            spyOn( iPainter, 'pushState' ).and.callThrough();

            iMockViewee.paintChildren( iPainter );

            expect( iPainter.pushState ).toHaveBeenCalled();
        });


        it( 'should apply any transformations to the painter', function() {
            spyOn( iMockViewee, 'applyTransformations' );

            iMockViewee.paintChildren( iPainter );

            expect( iMockViewee.applyTransformations ).toHaveBeenCalledWith( iPainter );
        });


        it( 'should paint each of its children', function() {
            spyOn( iChild1, 'paint' );
            spyOn( iChild2, 'paint' );

            iMockViewee.paintChildren( iPainter );

            expect( iChild1.paint ).toHaveBeenCalledWith( iPainter );
            expect( iChild2.paint ).toHaveBeenCalledWith( iPainter );
        });

        it( 'should pop the painter state', function() {
            spyOn( iPainter, 'popState' );

            iMockViewee.paintChildren( iPainter );

            expect( iPainter.popState ).toHaveBeenCalled();
        });


    });

});
