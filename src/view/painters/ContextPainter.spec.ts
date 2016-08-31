import { Context2DMock }  from '../../../mocks/Context2D';
import { Rect }           from '../geometry/Rect';
import { Painter }        from './Painter';
import { ContextPainter } from './ContextPainter';

describe( 'ContextPainter', () => {

    beforeEach( () => {
        this.context = new Context2DMock();
        this.painter = new ContextPainter( this.context )
    });


    describe( 'translate()', () => {

        it( 'should update the painter`s transform matrix', () => {
            var iDelegate = spyOn( Painter.prototype, 'translate' );

            this.painter.translate( 10, 20 );

            expect( iDelegate ).toHaveBeenCalledWith( 10, 20 );
        });

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

        it( 'should intersect the clip area with the given rect', () => {
            var iRect     = new Rect( 10, 10, 20, 20 ),
                iDelegate = spyOn( Painter.prototype, 'intersectClipAreaWith' );

            this.painter.intersectClipAreaWith( iRect );

            expect( iDelegate ).toHaveBeenCalledWith( iRect );
        });

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

        it( 'should restore the transformation matrix', () => {
            this.painter.translate( 10, 15 );
            this.painter.pushState();
            this.painter.translate( 20, 20 );

            this.painter.popState();

            expect( this.painter.matrix.translateX ).toBe( 10 );
            expect( this.painter.matrix.translateY ).toBe( 15 );
        });

        it( 'should restore the clip area when it is undefined', () => {
            this.painter.pushState();
            this.painter.intersectClipAreaWith( new Rect( 10, 10, 20, 20 ) );

            this.painter.popState();

            expect( this.painter.clipArea ).not.toBeDefined();
        });

        it( 'should restore the clip area when it is defined', () => {
            this.painter.intersectClipAreaWith( new Rect( 10, 10, 20, 20 ) );
            this.painter.pushState();
            this.painter.intersectClipAreaWith( new Rect( 0, 0, 2, 2 ) );

            this.painter.popState();

            expect( this.painter.clipArea ).toEqualRect( 10, 10, 20, 20 );
        });


    });

});
