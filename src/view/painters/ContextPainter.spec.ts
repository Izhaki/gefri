import { Context2DMock }  from '../../../mocks/Context2D';
import { Rect }           from '../geometry/Rect';
import { ContextPainter } from './ContextPainter';
import { Painter }        from './Painter';
import { PainterSpecs }   from './Painter.spec.ts';

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


    describe( 'translate()', () => {

        it( 'should call translate on the context provided', () => {
            spyOn( this.context, 'translate' );

            this.painter.translate( 10, 20 );

            expect( this.context.translate ).toHaveBeenCalledWith( 10, 20 );
        });

    });


    describe( 'drawRectangle()', () => {

        it( 'should draw a rect on the context provided', () => {
            spyOn( this.context, 'rect' );

            var iRect = new Rect( 10, 10, 20, 20 );
            this.painter.drawRectangle( iRect );

            expect( this.context.rect ).toHaveBeenCalledWith( 10, 10, 20, 20 );
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
