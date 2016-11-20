import { Context2DMock              } from '../../../../tests/mocks';
import { Rect                       } from '../../geometry';
import { Contextual,
         cAntialiasingExtraMargins  } from './Contextual';
import { Clipped                    } from './../';
import { ClippedSpecs               } from './../Clipped.spec';

function createContextual(): Clipped {
    return new Contextual( new Context2DMock() );
}

describe( 'Contextual', () => {

    describe( 'is a Clipped', () => {
        ClippedSpecs.call( this, createContextual );
    })

    beforeEach( () => {
        this.contextual = createContextual();
        this.context = this.contextual.context;
    });

    describe( 'drawRectangle()', () => {

        it( 'should draw a rect on the context', () => {
            spyOn( this.context, 'rect' );

            var iRect = new Rect( 10, 10, 20, 20 );
            this.contextual.drawRectangle( iRect );

            expect( this.context.rect ).toHaveBeenCalledWith( 10, 10, 20, 20 );
        });

    });

    describe( 'erase()', () => {

        it( 'should clear the rect on the context while applying some extra margins to account for antialiasing effect', () => {
            spyOn( this.context, 'clearRect' );

            var iRect = new Rect( 10, 10, 20, 20 );
            this.contextual.erase( iRect );

            let iExpected = iRect.clone();
            iExpected.expand( cAntialiasingExtraMargins );

            expect( this.context.clearRect ).toHaveBeenCalledWith( iExpected.x, iExpected.y, iExpected.w, iExpected.h );
        });

    });

    describe( 'intersectClipAreaWith()', () => {

        it( 'should clip the context', () => {
            spyOn( this.context, 'rect' );
            spyOn( this.context, 'clip' );
            this.contextual.intersectClipAreaWith( new Rect( 10, 10, 20, 20 ) );
            expect( this.context.rect ).toHaveBeenCalledWith( 9, 9, 22, 22 );
            expect( this.context.clip ).toHaveBeenCalled();
        });

    });


    describe( 'pushState()', () => {

        it( 'should store the canvas state', () => {
            spyOn( this.context, 'save' );

            this.contextual.pushState();

            expect( this.context.save ).toHaveBeenCalled();
        });

    });


    describe( 'popState()', () => {

        it( 'should restore the canvas state', () => {
            spyOn( this.context, 'restore' );
            this.contextual.pushState();
            this.contextual.popState();

            expect( this.context.restore ).toHaveBeenCalled();
        });

    });

});
