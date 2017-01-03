import { Point,
         Matrix } from './';

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

    describe( 'applyMatrix()', () => {

        it( 'should apply the transformation matrix on the point regardless of the order in which scale and translation where applied', () => {
            let iPoint1  = new Point( 100, 100 ),
                iMatrix1 = new Matrix();

            iMatrix1.scale( 2, 0.5 );
            iMatrix1.translate( 10, 20 );
            let iTransformedPoint1 = iPoint1.applyMatrix( iMatrix1 );

            let iPoint2  = new Point( 100, 100 ),
                iMatrix2 = new Matrix();

            iMatrix2.translate( 10, 20 );
            iMatrix2.scale( 2, 0.5 );
            let iTransformedPoint2 = iPoint2.applyMatrix( iMatrix2 );

            expect( iTransformedPoint1 ).toEqualPoint( 220, 60 );
            expect( iTransformedPoint1 ).toEqual( iTransformedPoint2 );
        });

    });


});
