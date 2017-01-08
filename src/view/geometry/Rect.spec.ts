import { Point,
         Rect,
         Matrix } from './';

describe( 'Rect', () => {

    describe( 'The static method', () => {

        describe( 'union()', () => {

            it( 'should return a new rect that is a union of all the provided rects', () => {
                let iUnion = Rect.union([
                    new Rect( 10, 20, 30, 40 ),
                    new Rect( 30, 40, 50, 60 ),
                    new Rect( 20, 20, 10, 10 ),
                ]);

                expect( iUnion ).toEqualRect( 10, 20, 70, 80 );
            });

        });

    });

    describe( 'constructor()', () => {

        it( 'should throw if the provided argument list is invalid', () => {
            let createRect = () => new Rect( {} as Point, {} as Point );
            expect( createRect ).toThrow();
        });

    });

    describe( 'clone()', () => {

        it( 'Should return a new rect with the same geometry', () => {
            let iRect  = new Rect( 10, 20, 30, 40 ),
                iClone = iRect.clone();

            expect( iClone ).toEqual( iRect );
        });

    });


    describe( 'getOrigin()', () => {

        it( 'should return the x and y coordinates of the rect', () => {
            let iRect = new Rect( 20, 30, -100, -100 );
            expect( iRect.getOrigin() ).toEqualPoint( 20, 30 );
        });

    });

    describe( 'getLeft()', () => {

        it( 'should return x if the width is positive', () => {
            let iRect = new Rect( 20, 20, 100, 40 );
            expect( iRect.getLeft() ).toEqual( 20 );
        });


        it( 'should return x + w if the width is negative', () => {
            let iRect = new Rect( 20, 20, -10, 40 );
            expect( iRect.getLeft() ).toEqual( 10 );
        });

    });


    describe( 'getRight()', () => {

        it( 'should return x + w if the width is positive', () => {
            let iRect = new Rect( 20, 20, 100, 40 );
            expect( iRect.getRight() ).toEqual( 120 );
        });


        it( 'should return x if the width is negative', () => {
            let iRect = new Rect( 20, 20, -10, 40 );
            expect( iRect.getRight() ).toEqual( 20 );
        });
    });


    describe( 'getTop()', () => {

        it( 'should return y if the height is positive', () => {
            let iRect = new Rect( 20, 20, 100, 40 );
            expect( iRect.getTop() ).toEqual( 20 );
        });


        it( 'should return y + h if the height is negative', () => {
            let iRect = new Rect( 20, 20, 10, -10 );
            expect( iRect.getTop() ).toEqual( 10 );
        });

    });


    describe( 'getBottom()', () => {

        it( 'should return y + h if the height is positive', () => {
            let iRect = new Rect( 20, 20, 100, 40 );
            expect( iRect.getBottom() ).toEqual( 60 );
        });


        it( 'should return y if the height is negative', () => {
            let iRect = new Rect( 20, 30, 10, -40 );
            expect( iRect.getBottom() ).toEqual( 30 );
        });

    });


    describe( 'getLeftTop()', () => {

        it( 'should return the correct point for positive dimensions', () => {
            let iRect = new Rect( 20, 30, 100, 100 );
            expect( iRect.getLeftTop() ).toEqualPoint( 20, 30 );
        });


        it( 'should return the correct point for negative dimensions', () => {
            let iRect = new Rect( 20, 30, -10, -20 );
            expect( iRect.getLeftTop() ).toEqualPoint( 10, 10 );
        });

    });


    describe( 'intersect()', () => {

        describe( 'should properly intersect two rects ', () => {

            it( 'when the corner of one is contained within the other', () => {
                let iRect1 = new Rect( 100, 100, 100, 100 );
                let iRect2 = new Rect( 50,  50,  100, 100 );

                iRect1.intersect( iRect2 );

                expect( iRect1 ).toEqualRect( 100, 100, 50, 50 );
            });


            it( 'when the side of one is contained within the other', () => {
                let iRect1 = new Rect( 100, 100, 100, 100 );
                let iRect2 = new Rect( 150, 120, 100, 60  );

                iRect1.intersect( iRect2 );

                expect( iRect1 ).toEqualRect( 150, 120, 50, 60 );
            });


            it( 'when one contains the other', () => {
                let iRect1 = new Rect( 100, 100, 100, 100 );
                let iRect2 = new Rect( 120, 120, 60,  60  );

                iRect1.intersect( iRect2 );

                expect( iRect1 ).toEqualRect( 120, 120, 60, 60 );
            });
        });

    });

    describe( 'union()', () => {

        describe( 'should union the rect with the rect provided', () => {

            it( 'when both have positive dimensions', () => {
                let iRect1 = new Rect( 10, 20, 30, 40 );
                let iRect2 = new Rect( 20, 30, 40, 50 );

                iRect1.union( iRect2 );

                expect( iRect1 ).toEqualRect( 10, 20, 50, 60 );
            });

            it( 'when both have negative dimensions', () => {
                let iRect1 = new Rect( 40,  30,  -20, -10 );
                let iRect2 = new Rect( 110, 120, -10, -20 );

                iRect1.union( iRect2 );

                expect( iRect1 ).toEqualRect( 20, 20, 90, 100 );
            });

            // A particular union algorithm may assign the x or y before
            // working out the width and height, which will result in wrong
            // union.
            it( 'when the first rect origin is bigger than the second rect origin', () => {
                let iRect1 = new Rect( 15, 15, 10, 10 );
                let iRect2 = new Rect( 10, 10, 10, 10 );

                iRect1.union( iRect2 );

                expect( iRect1 ).toEqualRect( 10, 10, 15, 15 );
            });


        });

    });

    describe( 'isOverlappingWith()', () => {

        describe( 'should return true', () => {

            it( 'when the top-left corner of one rect is containted within the other', () => {
                let iRect1 = new Rect( 100, 100, 100, 100 );
                let iRect2 = new Rect( 150, 150, 100, 100 );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when the top-right corner of one rect is containted within the other', () => {
                let iRect1 = new Rect( 100, 100, 100, 100 );
                let iRect2 = new Rect( 50,  150, 100, 100 );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when the right side of one rect is containted within the other', () => {
                let iRect1 = new Rect( 100, 100, 100, 100 );
                let iRect2 = new Rect( 50,  120, 100, 20  );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when the left side of one rect is containted within the other', () => {
                let iRect1 = new Rect( 100, 100, 100, 100 );
                let iRect2 = new Rect( 150,  120, 100, 20  );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when the bottom side of one rect is containted within the other', () => {
                let iRect1 = new Rect( 100, 100, 100, 100 );
                let iRect2 = new Rect( 120, 50,  20,  100 );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when the top side of one rect is containted within the other', () => {
                let iRect1 = new Rect( 100, 100, 100, 100 );
                let iRect2 = new Rect( 120, 150, 20,  100 );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });


            it( 'when one rect contains the other', () => {
                let iRect1 = new Rect( 100, 100, 100, 100 );
                let iRect2 = new Rect( 120, 120, 60,  60  );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when two rects are the same', () => {
                let iRect1 = new Rect( 100, 100, 100, 100 );
                let iRect2 = new Rect( 100, 100, 100, 100 );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when one rect contains the other and their left sides are touching', () => {
                let iRect1 = new Rect( 100, 100, 100, 100 );
                let iRect2 = new Rect( 100, 120, 60,  60  );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when one rect contains the other and their right sides are touching', () => {
                let iRect1 = new Rect( 100, 100, 100, 100 );
                let iRect2 = new Rect( 140, 120, 60,  60  );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when one rect contains the other and their top sides are touching', () => {
                let iRect1 = new Rect( 100, 100, 100, 100 );
                let iRect2 = new Rect( 120, 100, 60,  60  );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when one rect contains the other and their bottom sides are touching', () => {
                let iRect1 = new Rect( 100, 100, 100, 100 );
                let iRect2 = new Rect( 140, 100, 60,  60  );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when two rects left sides are touching', () => {
                let iRect1 = new Rect( 100, 100, 100, 100 );
                let iRect2 = new Rect( 0,   100, 100, 100  );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when two rects top sides are touching', () => {
                let iRect1 = new Rect( 100, 100, 100, 100 );
                let iRect2 = new Rect( 100, 0,   100, 100 );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when two rects top-left and bottom-right corners are touching', () => {
                let iRect1 = new Rect( 100, 100, 100, 100 );
                let iRect2 = new Rect( 0  , 0,   100, 100 );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when two rects top-right and bottom-left corners are touching', () => {
                let iRect1 = new Rect( 100, 100, 100, 100 );
                let iRect2 = new Rect( 0  , 200,   100, 100 );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });
        });

        describe( 'should return false', () => {

            it( 'when two rects corners are not touching', () => {
                let iRect1 = new Rect( 101, 101, 100, 100 );
                let iRect2 = new Rect( 0  , 0,   100, 100 );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( false );
            });

            it( 'false when two rects x range overlaps but not the y', () => {
                let iRect1 = new Rect( 100, 100, 100, 100 );
                let iRect2 = new Rect( 100, 201, 100, 100 );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( false );
            });

            it( 'false when two rects y range overlaps but not the x', () => {
                let iRect1 = new Rect( 100, 100, 100, 100 );
                let iRect2 = new Rect( 201, 100, 100, 100 );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( false );
            });

        });

    });

    describe( 'translate()', () => {

        // TODO: what if negative w or h?
        it( 'should add the offset provided to the top left corener', () => {
            let iRect = new Rect( 10, 10, 20, 20 );
            iRect.translate( new Point( 5, -5 ) );
            expect( iRect ).toEqualRect( 15, 5, 20, 20 );
        });

    });


    describe( 'expand()', () => {

        it( 'should expand the rect by the given point when width and height are positive', () => {
            let iRect = new Rect( 10, 10, 20, 20 );
            iRect.expand( 5 );
            expect( iRect ).toEqualRect( 5, 5, 30, 30 );
        });

        it( 'should expand the rect by the given point when width and height are negative', () => {
            let iRect = new Rect( 20, 20, -10, -10 );
            iRect.expand( 5 );
            expect( iRect ).toEqualRect( 25, 25, -20, -20 );
        });

    });

    describe( 'contract()', () => {

        it( 'should contract the rect by the given point when width and height are positive', () => {
            let iRect = new Rect( 10, 10, 20, 20 );
            iRect.contract( 1 );
            expect( iRect ).toEqualRect( 11, 11, 18, 18 );
        });

        it( 'should contract the rect by the given point when width and height are negative', () => {
            let iRect = new Rect( 20, 20, -10, -10 );
            iRect.contract( 1 );
            expect( iRect ).toEqualRect( 19, 19, -8, -8 );
        });

    });

    describe( 'normalise()', () => {

        it( 'should turn a rect with negative width to one with positive one', () => {
            let iRect = new Rect( 100, 100, -20, 20 );
            iRect.normalise();
            expect( iRect ).toEqualRect( 80, 100, 20, 20 );
        });

        it( 'should turn a rect with negative height to one with positive one', () => {
            let iRect = new Rect( 100, 100, 20, -20 );
            iRect.normalise();
            expect( iRect ).toEqualRect( 100, 80, 20, 20 );
        });

    });

    describe( 'applyMatrix()', () => {

        it( 'should apply the transformation matrix on the rect regardless of the order in which scale and translation where applied', () => {
            let iRect1   = new Rect( 100, 100, 100, 100 ),
                iMatrix1 = new Matrix();

            iMatrix1.scale( 2, 0.5 );
            iMatrix1.translate( 10, 20 );
            let iTransformedRect1 = iRect1.applyMatrix( iMatrix1 );

            let iRect2   = new Rect( 100, 100, 100, 100 ),
                iMatrix2 = new Matrix();

            iMatrix2.translate( 10, 20 );
            iMatrix2.scale( 2, 0.5 );
            let iTransformedRect2 = iRect2.applyMatrix( iMatrix2 );

            expect( iTransformedRect1 ).toEqualRect( 220, 60, 200, 50 );
            expect( iTransformedRect1 ).toEqual( iTransformedRect2 );
        });

    });

});
