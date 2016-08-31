import { Shape }          from './Shape';
import { Context2DMock }  from '../../../../mocks/Context2D';
import { ContextPainter } from './../../painters/ContextPainter';
import { Painter }        from './../../painters/Painter';
import { Rect }           from './../../geometry/Rect';

class MockShape extends Shape {
    paintSelf( aPainter: Painter ) {}
    getRectBounds(): Rect { return new Rect( 10, 10, 20, 20); }
}

describe( 'Shape', () => {

    beforeEach( () => {
        this.painter = new ContextPainter( new Context2DMock() );
        this.shape   = new MockShape();
    });


    describe( 'paint()', () => {

        describe( 'when the bound are within the painters clip area', () => {

            beforeEach( () => {
                spyOn( this.shape, 'isWithinClipArea' ).and.returnValue( true );
            });

            it( 'should paint itself', () => {
                spyOn( this.shape, 'paintSelf' );

                this.shape.paint( this.painter );
                expect( this.shape.paintSelf ).toHaveBeenCalledWith( this.painter );
            });

            it( 'should paint its children', () => {
                spyOn( this.shape, 'paintChildren' );

                this.shape.paint( this.painter );
                expect( this.shape.paintChildren ).toHaveBeenCalledWith( this.painter );
            });

        });

        describe( 'when the bound are not within the painters clip area', () => {

            beforeEach( () => {
                spyOn( this.shape, 'isWithinClipArea' ).and.returnValue( false );
            });

            it( 'should paint itself', () => {
                spyOn( this.shape, 'paintSelf' );

                this.shape.paint( this.painter );
                expect( this.shape.paintSelf ).not.toHaveBeenCalledWith( this.painter );
            });

            it( 'should paint its children', () => {
                spyOn( this.shape, 'paintChildren' );

                this.shape.paint( this.painter );
                expect( this.shape.paintChildren ).not.toHaveBeenCalledWith( this.painter );
            });

        });

    });


    describe( 'beforeChildrenPainting()', () => {

        var iMockRectBounds = new Rect( 10, 10, 20, 20);

        beforeEach( () => {
            spyOn( this.shape, 'getRectBounds' ).and.returnValue( iMockRectBounds );
            spyOn( this.painter, 'translate' );
            spyOn( this.painter, 'intersectClipAreaWith' );

            this.shape.beforeChildrenPainting( this.painter );
        });

        it( 'should call translate on the painter with the top-left corner of the shape rectangular bound', () => {
            expect( this.painter.translate ).toHaveBeenCalledWith( 10, 10 );
        });

        it( 'should call intersect the clip region with its bounds', () => {
            expect( this.painter.intersectClipAreaWith ).toHaveBeenCalledWith( jasmine.objectContaining( { x: 10, y: 10, w: 20, h: 20 } ) );
        });

    });


    describe( 'isWithinClipArea()', () => {

        it( 'should return true if the bounds are within the painter`s clip area', () => {
            spyOn( this.painter, 'isRectWithinClipArea' ).and.returnValue( true );

            var isWithin = this.shape.isWithinClipArea( this.painter );
            expect( isWithin ).toBe( true );
        });

        it( 'should return false if the bounds are not within the painter`s clip area', () => {
            spyOn( this.painter, 'isRectWithinClipArea' ).and.returnValue( false );

            var isWithin = this.shape.isWithinClipArea( this.painter );
            expect( isWithin ).toBe( false );
        });

    });


});
