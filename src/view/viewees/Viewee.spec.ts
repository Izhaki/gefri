import { Viewee }         from './Viewee';
import { Context2DMock }  from '../../../mocks/Context2D';
import { ContextPainter } from './../painters/ContextPainter';
import { Painter }        from './../painters/Painter';

class TestViewee extends Viewee {
    paint( aPainter: Painter ) {}
}

describe( 'Viewee', () => {

    beforeEach( () => {
        this.viewee  = new TestViewee();
        this.painter = new ContextPainter( new Context2DMock() );
    });


    describe( 'paintChildren()', () => {
        var iChild1: TestViewee,
            iChild2: TestViewee;

        beforeEach( () => {
            iChild1 = new TestViewee();
            iChild2 = new TestViewee();

            this.viewee.addChildren( iChild1, iChild2 );
        });

        it( 'should push the painter`s state', () => {
            spyOn( this.painter, 'pushState' ).and.callThrough();

            this.viewee.paintChildren( this.painter );

            expect( this.painter.pushState ).toHaveBeenCalled();
        });


        it( 'should call the beforeChildrenPainting method', () => {
            spyOn( this.viewee, 'beforeChildrenPainting' );

            this.viewee.paintChildren( this.painter );

            expect( this.viewee.beforeChildrenPainting ).toHaveBeenCalledWith( this.painter );
        });


        it( 'should paint each of its children', () => {
            spyOn( iChild1, 'paint' );
            spyOn( iChild2, 'paint' );

            this.viewee.paintChildren( this.painter );

            expect( iChild1.paint ).toHaveBeenCalledWith( this.painter );
            expect( iChild2.paint ).toHaveBeenCalledWith( this.painter );
        });

        it( 'should pop the painter state', () => {
            spyOn( this.painter, 'popState' );

            this.viewee.paintChildren( this.painter );

            expect( this.painter.popState ).toHaveBeenCalled();
        });


    });


    describe( 'beforeChildrenPainting()', () => {

        it( 'should apply transformations', () => {
            spyOn( this.viewee, 'applyTransformations' );

            this.viewee.beforeChildrenPainting( this.painter );

            expect( this.viewee.applyTransformations ).toHaveBeenCalledWith( this.painter );
        });

    });

});
