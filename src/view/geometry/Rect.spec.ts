import { Rect }  from './';
import { Point } from './';

describe( 'Rect', () => {


    describe( 'clone()', () => {

        it( 'Should return a new rect with the same geometry', () => {
            var iRect  = new Rect( 10, 20, 30, 40 ),
                iClone = iRect.clone();

            expect( iClone ).toEqual( iRect );
        });

    });


    describe( 'getOrigin()', () => {

        it( 'should return the x and y coordinates of the rect', () => {
            var iRect = new Rect( 20, 30, -100, -100 );
            expect( iRect.getOrigin() ).toEqualPoint( 20, 30 );
        });

    });

    describe( 'getLeft()', () => {

        it( 'should return x if the width is positive', () => {
            var iRect = new Rect( 20, 20, 100, 40 );
            expect( iRect.getLeft() ).toEqual( 20 );
        });


        it( 'should return x + w if the width is negative', () => {
            var iRect = new Rect( 20, 20, -10, 40 );
            expect( iRect.getLeft() ).toEqual( 10 );
        });

    });


    describe( 'getRight()', () => {

        it( 'should return x + w if the width is positive', () => {
            var iRect = new Rect( 20, 20, 100, 40 );
            expect( iRect.getRight() ).toEqual( 120 );
        });


        it( 'should return x if the width is negative', () => {
            var iRect = new Rect( 20, 20, -10, 40 );
            expect( iRect.getRight() ).toEqual( 20 );
        });
    });


    describe( 'getTop()', () => {

        it( 'should return y if the height is positive', () => {
            var iRect = new Rect( 20, 20, 100, 40 );
            expect( iRect.getTop() ).toEqual( 20 );
        });


        it( 'should return y + h if the height is negative', () => {
            var iRect = new Rect( 20, 20, 10, -10 );
            expect( iRect.getTop() ).toEqual( 10 );
        });

    });


    describe( 'getBottom()', () => {

        it( 'should return y + h if the height is positive', () => {
            var iRect = new Rect( 20, 20, 100, 40 );
            expect( iRect.getBottom() ).toEqual( 60 );
        });


        it( 'should return y if the height is negative', () => {
            var iRect = new Rect( 20, 30, 10, -40 );
            expect( iRect.getBottom() ).toEqual( 30 );
        });

    });


    describe( 'getLeftTop()', () => {

        it( 'should return the correct point for positive dimensions', () => {
            var iRect = new Rect( 20, 30, 100, 100 );
            expect( iRect.getLeftTop() ).toEqual( new Point( 20, 30 ) );
        });


        it( 'should return the correct point for negative dimensions', () => {
            var iRect = new Rect( 20, 30, -10, -20 );
            expect( iRect.getLeftTop() ).toEqual( new Point( 10, 10 ) );
        });

    });


    describe( 'intersect()', () => {

        describe( 'should properly intersect two rects ', () => {

            it( 'when the corner of one is contained within the other', () => {
                var iRect1 = new Rect( 100, 100, 100, 100 );
                var iRect2 = new Rect( 50,  50,  100, 100 );

                iRect1.intersect( iRect2 );

                expect( iRect1 ).toEqual( jasmine.objectContaining( { x: 100, y: 100, w: 50, h: 50 } ) );
            });


            it( 'when the side of one is contained within the other', () => {
                var iRect1 = new Rect( 100, 100, 100, 100 );
                var iRect2 = new Rect( 150, 120, 100, 60  );

                iRect1.intersect( iRect2 );

                expect( iRect1 ).toEqual( jasmine.objectContaining( { x: 150, y: 120, w: 50, h: 60 } ) );
            });


            it( 'when one contains the other', () => {
                var iRect1 = new Rect( 100, 100, 100, 100 );
                var iRect2 = new Rect( 120, 120, 60,  60  );

                iRect1.intersect( iRect2 );

                expect( iRect1 ).toEqual( jasmine.objectContaining( { x: 120, y: 120, w: 60, h: 60 } ) );
            });
        });

    });


    describe( 'isOverlappingWith()', () => {

        describe( 'should return true', () => {

            it( 'when the top-left corner of one rect is containted within the other', () => {
                var iRect1 = new Rect( 100, 100, 100, 100 );
                var iRect2 = new Rect( 150, 150, 100, 100 );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when the top-right corner of one rect is containted within the other', () => {
                var iRect1 = new Rect( 100, 100, 100, 100 );
                var iRect2 = new Rect( 50,  150, 100, 100 );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when the right side of one rect is containted within the other', () => {
                var iRect1 = new Rect( 100, 100, 100, 100 );
                var iRect2 = new Rect( 50,  120, 100, 20  );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when the left side of one rect is containted within the other', () => {
                var iRect1 = new Rect( 100, 100, 100, 100 );
                var iRect2 = new Rect( 150,  120, 100, 20  );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when the bottom side of one rect is containted within the other', () => {
                var iRect1 = new Rect( 100, 100, 100, 100 );
                var iRect2 = new Rect( 120, 50,  20,  100 );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when the top side of one rect is containted within the other', () => {
                var iRect1 = new Rect( 100, 100, 100, 100 );
                var iRect2 = new Rect( 120, 150, 20,  100 );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });


            it( 'when one rect contains the other', () => {
                var iRect1 = new Rect( 100, 100, 100, 100 );
                var iRect2 = new Rect( 120, 120, 60,  60  );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when two rects are the same', () => {
                var iRect1 = new Rect( 100, 100, 100, 100 );
                var iRect2 = new Rect( 100, 100, 100, 100 );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when one rect contains the other and their left sides are touching', () => {
                var iRect1 = new Rect( 100, 100, 100, 100 );
                var iRect2 = new Rect( 100, 120, 60,  60  );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when one rect contains the other and their right sides are touching', () => {
                var iRect1 = new Rect( 100, 100, 100, 100 );
                var iRect2 = new Rect( 140, 120, 60,  60  );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when one rect contains the other and their top sides are touching', () => {
                var iRect1 = new Rect( 100, 100, 100, 100 );
                var iRect2 = new Rect( 120, 100, 60,  60  );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when one rect contains the other and their bottom sides are touching', () => {
                var iRect1 = new Rect( 100, 100, 100, 100 );
                var iRect2 = new Rect( 140, 100, 60,  60  );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when two rects left sides are touching', () => {
                var iRect1 = new Rect( 100, 100, 100, 100 );
                var iRect2 = new Rect( 0,   100, 100, 100  );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when two rects top sides are touching', () => {
                var iRect1 = new Rect( 100, 100, 100, 100 );
                var iRect2 = new Rect( 100, 0,   100, 100 );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when two rects top-left and bottom-right corners are touching', () => {
                var iRect1 = new Rect( 100, 100, 100, 100 );
                var iRect2 = new Rect( 0  , 0,   100, 100 );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });

            it( 'when two rects top-right and bottom-left corners are touching', () => {
                var iRect1 = new Rect( 100, 100, 100, 100 );
                var iRect2 = new Rect( 0  , 200,   100, 100 );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( true );
            });
        });

        describe( 'should return false', () => {

            it( 'when two rects corners are not touching', () => {
                var iRect1 = new Rect( 101, 101, 100, 100 );
                var iRect2 = new Rect( 0  , 0,   100, 100 );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( false );
            });

            it( 'false when two rects x range overlaps but not the y', () => {
                var iRect1 = new Rect( 100, 100, 100, 100 );
                var iRect2 = new Rect( 100, 201, 100, 100 );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( false );
            });

            it( 'false when two rects y range overlaps but not the x', () => {
                var iRect1 = new Rect( 100, 100, 100, 100 );
                var iRect2 = new Rect( 201, 100, 100, 100 );

                expect( iRect1.isOverlappingWith( iRect2 ) ).toBe( false );
            });

        });

    });

    describe( 'translate()', () => {

        // TODO: what if negative w or h?
        it( 'should add the offset provided to the top left corener', () => {
            var iRect = new Rect( 10, 10, 20, 20 );
            iRect.translate( new Point( 5, -5 ) );
            expect( iRect ).toEqual( jasmine.objectContaining( { x: 15, y: 5, w: 20, h: 20 } ) );
        });

    });


    describe( 'expand()', () => {

        it( 'should expand the rect by the given point when width and height are positive', () => {
            var iRect = new Rect( 10, 10, 20, 20 );
            iRect.expand( 5 );
            expect( iRect ).toEqual( jasmine.objectContaining( { x: 5, y: 5, w: 30, h: 30 } ) );
        });

        it( 'should expand the rect by the given point when width and height are negative', () => {
            var iRect = new Rect( 20, 20, -10, -10 );
            iRect.expand( 5 );
            expect( iRect ).toEqual( jasmine.objectContaining( { x: 25, y: 25, w: -20, h: -20 } ) );
        });

    });

    describe( 'contract()', () => {

        it( 'should contract the rect by the given point when width and height are positive', () => {
            var iRect = new Rect( 10, 10, 20, 20 );
            iRect.contract( 1 );
            expect( iRect ).toEqual( jasmine.objectContaining( { x: 11, y: 11, w: 18, h: 18 } ) );
        });

        it( 'should contract the rect by the given point when width and height are negative', () => {
            var iRect = new Rect( 20, 20, -10, -10 );
            iRect.contract( 1 );
            expect( iRect ).toEqual( jasmine.objectContaining( { x: 19, y: 19, w: -8, h: -8 } ) );
        });

    });

    describe( 'normalise()', () => {

        it( 'should turn a rect with negative width to one with positive one', () => {
            var iRect = new Rect( 100, 100, -20, 20 );
            iRect.normalise();
            expect( iRect ).toEqualRect( 80, 100, 20, 20 );
        });

        it( 'should turn a rect with negative height to one with positive one', () => {
            var iRect = new Rect( 100, 100, 20, -20 );
            iRect.normalise();
            expect( iRect ).toEqualRect( 100, 80, 20, 20 );
        });

    });



});
