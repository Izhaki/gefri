import { Viewee }         from './Viewee';
import { Painter }        from './../painters/Painter';
import { CompositeSpecs } from '../../core/Composite.spec.ts';

export
function VieweeSpecs(  createViewee: () => Viewee, createPainter: () => Painter  ) {

    describe( 'Viewee', () => {

        describe( 'is a Composite', () => {
            CompositeSpecs.call( this, createViewee );
        })

        beforeEach( () => {
            this.viewee  = createViewee();
            this.painter = createPainter();
        });

        describe( 'paintChildren()', () => {
            var iChild1: Viewee,
                iChild2: Viewee;

            beforeEach( () => {
                iChild1 = createViewee();
                iChild2 = createViewee();

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

}
