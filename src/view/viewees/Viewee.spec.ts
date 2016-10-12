import { Viewee         } from './Viewee';
import { Painter        } from './../output';
import { Rectangle      } from './shapes';
import { CompositeSpecs } from '../../core/Composite.spec';
import { createControl  } from '../Control.spec';
import { Rect,
         Point          } from '../geometry';


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


        describe( 'erase()', () => {

            beforeEach( () => {

                this.control = createControl();
                this.painter = this.control.painter;

                // To ensure we erase in absolute coordinates
                this.absoluteOffset = new Point( 10, 12 );
                this.rect = new Rectangle( new Rect( this.absoluteOffset.x, this.absoluteOffset.y , 500, 500 ) );
                this.rect.addChildren( this.viewee );

                this.control.setContents( this.rect );

                spyOn( this.painter, 'erase' );
            });

            it( 'should erase its bounds from the context', () => {
                this.viewee.erase();
                this.control.waitForFrame.flush();

                let iActualBound    = this.painter.erase.calls.argsFor(0)[0],
                    iExpectedBounds = this.viewee.getBoundingRect();

                // Accounting for absolute coordinates.
                iExpectedBounds.translate( this.absoluteOffset );

                expect( iActualBound ).toEqual( iExpectedBounds );
            });

        });

    });

}
