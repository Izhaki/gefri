import { Point } from './';

describe( 'Point', () => {

    describe( 'constructor()', () => {

        it( 'Should keep the given coordinates', () => {
            var iPoint = new Point( 15, 16 );
            expect( iPoint.x ).toBe( 15 );
            expect( iPoint.y ).toBe( 16 );
        });

    });


    describe( 'clone()', () => {

        it( 'Should return a new point with the same coordinates', () => {
            var iPoint = new Point( 10, 20 ),
                iClone = iPoint.clone();

            expect( iClone ).toEqual( iPoint );
        });

    });

    describe( 'set()', () => {

        it( 'Should set the given parameters and the point coordinate', () => {
            var iPoint = new Point( 10, 20 );

            iPoint.set( 5, 15 )

            expect( iPoint.x ).toEqual( 5 );
            expect( iPoint.y ).toEqual( 15 );
        });

    });


});
