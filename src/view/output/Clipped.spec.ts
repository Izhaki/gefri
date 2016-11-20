import { TransformableSpecs } from './Transformable.spec'
import { Clipped            } from './';
import { Rect               } from '../geometry';

export
function ClippedSpecs( createClipped: () => Clipped ) {

    describe( 'is a Transformable', () => {
        TransformableSpecs.call( this, createClipped );
    })

    beforeEach( () => {
        this.clipped = createClipped();
    });


    describe( 'intersectClipAreaWith()', () => {

        it( 'should set the clip area to the given rect if the clip area was not intersected before', () => {
            this.clipped.intersectClipAreaWith( new Rect( 10, 10, 20, 20) );
            expect( this.clipped.clipArea ).toEqualRect( 10, 10, 20, 20 );
        });

        it( 'should intersect an existing clip area with the given rect', () => {
            this.clipped.intersectClipAreaWith( new Rect( 10, 10, 20, 20) );
            this.clipped.intersectClipAreaWith( new Rect( 15, 15, 20, 20) );
            expect( this.clipped.clipArea ).toEqualRect( 15, 15, 15, 15 );
        });

    });


    describe( 'isRectWithinClipArea()', () => {
        var iClipArea = new Rect( 10, 10, 20, 20);

        it( 'should return true if there is no clip area', () => {
            var iRect = new Rect( 15, 15, 20, 20);

            var isWithin = this.clipped.isRectWithinClipArea( iRect );
            expect( isWithin ).toBe( true );
        });

        it( 'should return true if the provided rect and the clip area are overlapping', () => {
            var iRect = new Rect( 15, 15, 20, 20);

            this.clipped.intersectClipAreaWith( iClipArea );
            var isWithin = this.clipped.isRectWithinClipArea( iRect );
            expect( isWithin ).toBe( true );
        });

        it( 'should return false if the provided rect and the clip area do not overlap', () => {
            var iRect = new Rect( 40, 40, 20, 20);

            this.clipped.intersectClipAreaWith( iClipArea );
            var isWithin = this.clipped.isRectWithinClipArea( iRect );
            expect( isWithin ).toBe( false );
        });

    });


    describe( 'popState()', () => {

        it( 'should restore the clip area when it is undefined', () => {
            this.clipped.pushState();
            this.clipped.intersectClipAreaWith( new Rect( 10, 10, 20, 20 ) );

            this.clipped.popState();

            expect( this.clipped.clipArea ).not.toBeDefined();
        });

        it( 'should restore the clip area when it is defined', () => {
            this.clipped.intersectClipAreaWith( new Rect( 10, 10, 20, 20 ) );
            this.clipped.pushState();
            this.clipped.intersectClipAreaWith( new Rect( 0, 0, 2, 2 ) );

            this.clipped.popState();

            expect( this.clipped.clipArea ).toEqualRect( 10, 10, 20, 20 );
        });


    });

}
