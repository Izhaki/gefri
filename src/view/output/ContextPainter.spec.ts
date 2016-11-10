import { Context2DMock              } from '../../../tests/mocks';
import { Rect                       } from '../geometry';
import { ContextPainter,
         cAntialiasingExtraMargins } from './ContextPainter';
import { Painter                    } from './';
import { PainterSpecs               } from './Painter.spec';

function createPainter(): Painter {
    return new ContextPainter( new Context2DMock() );
}

describe( 'ContextPainter', () => {

    describe( 'is a Painter', () => {
        PainterSpecs.call( this, createPainter );
    })

    beforeEach( () => {
        this.painter = createPainter();
        this.context = this.painter.context;
    });

    describe( 'drawRectangle()', () => {

        it( 'should draw a rect on the context', () => {
            spyOn( this.context, 'rect' );

            var iRect = new Rect( 10, 10, 20, 20 );
            this.painter.drawRectangle( iRect );

            expect( this.context.rect ).toHaveBeenCalledWith( 10, 10, 20, 20 );
        });

    });

    describe( 'erase()', () => {

        it( 'should clear the rect on the context while applying some extra margins to account for antialiasing effect', () => {
            spyOn( this.context, 'clearRect' );

            var iRect = new Rect( 10, 10, 20, 20 );
            this.painter.erase( iRect );

            let iExpected = iRect.clone();
            iExpected.expand( cAntialiasingExtraMargins );

            expect( this.context.clearRect ).toHaveBeenCalledWith( iExpected.x, iExpected.y, iExpected.w, iExpected.h );
        });

    });

    describe( 'intersectClipAreaWith()', () => {

        it( 'should clip the context', () => {
            spyOn( this.context, 'rect' );
            spyOn( this.context, 'clip' );
            this.painter.intersectClipAreaWith( new Rect( 10, 10, 20, 20 ) );
            expect( this.context.rect ).toHaveBeenCalledWith( 9, 9, 22, 22 );
            expect( this.context.clip ).toHaveBeenCalled();
        });

    });


    describe( 'pushState()', () => {

        it( 'should store the canvas state', () => {
            spyOn( this.context, 'save' );

            this.painter.pushState();

            expect( this.context.save ).toHaveBeenCalled();
        });

    });


    describe( 'popState()', () => {

        it( 'should restore the canvas state', () => {
            spyOn( this.context, 'restore' );
            this.painter.pushState();
            this.painter.popState();

            expect( this.context.restore ).toHaveBeenCalled();
        });

    });

});
