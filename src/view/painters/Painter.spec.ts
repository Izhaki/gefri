import { Painter } from './Painter';
import { Rect }    from '../geometry/Rect';

export
function PainterSpecs( createPainter: () => Painter ) {

    describe( 'Painter', () => {

        beforeEach( () => {
            this.painter = createPainter();
        });

        describe( 'translate()', () => {

            it( 'should update the painter`s transform matrix', () => {
                this.painter.translate( 10, 20 );
                this.painter.translate( 10, 20 );

                expect( this.painter.matrix.translateX ).toBe( 20 );
                expect( this.painter.matrix.translateY ).toBe( 40 );
            });

        });


        describe( 'intersectClipAreaWith()', () => {

            it( 'should set the clip area to the given rect if the clip area was not intersected before', () => {
                this.painter.intersectClipAreaWith( new Rect( 10, 10, 20, 20) );
                expect( this.painter.clipArea ).toEqualRect( 10, 10, 20, 20 );
            });

            it( 'should intersect an existing clip area with the given rect', () => {
                this.painter.intersectClipAreaWith( new Rect( 10, 10, 20, 20) );
                this.painter.intersectClipAreaWith( new Rect( 15, 15, 20, 20) );
                expect( this.painter.clipArea ).toEqualRect( 15, 15, 15, 15 );
            });

        });


        describe( 'isRectWithinClipArea()', () => {
            var iClipArea = new Rect( 10, 10, 20, 20);

            it( 'should return true if there is no clip area', () => {
                var iRect = new Rect( 15, 15, 20, 20);

                var isWithin = this.painter.isRectWithinClipArea( iRect );
                expect( isWithin ).toBe( true );
            });

            it( 'should return true if the provided rect and the clip area are overlapping', () => {
                var iRect = new Rect( 15, 15, 20, 20);

                this.painter.intersectClipAreaWith( iClipArea );
                var isWithin = this.painter.isRectWithinClipArea( iRect );
                expect( isWithin ).toBe( true );
            });

            it( 'should return false if the provided rect and the clip area do not overlap', () => {
                var iRect = new Rect( 40, 40, 20, 20);

                this.painter.intersectClipAreaWith( iClipArea );
                var isWithin = this.painter.isRectWithinClipArea( iRect );
                expect( isWithin ).toBe( false );
            });

        });


        describe( 'toAbsoluteRect()', () => {

            it( 'should return the rect transformed to absolute coordinates', () => {
                var iRect = new Rect( 100, 100, 100, 100);

                this.painter.translate( 10, 20 );
                this.painter.translate( 10, 20 );

                var iAbsoluteRect = this.painter.toAbsoluteRect( iRect );

                expect( iAbsoluteRect ).toEqualRect( 120, 140, 100, 100 );
            });

        });

        describe( 'popState()', () => {

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

}
