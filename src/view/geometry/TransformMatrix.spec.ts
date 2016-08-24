import { TransformMatrix } from './TransformMatrix';
import { Rect }            from './Rect';
import { Point }           from './Point';

describe( 'TransformMatrix', function() {
    var iTransformMatrix: TransformMatrix;

    beforeEach( function () {
        iTransformMatrix = new TransformMatrix();
    });

    describe( 'constructor()', function() {

        it( 'should initiate the translation', function() {
            expect( iTransformMatrix.translateX ).toBe( 0 );
            expect( iTransformMatrix.translateY ).toBe( 0 );
        });

        it( 'should initiate the scale', function() {
            expect( iTransformMatrix.scaleX ).toBe( 1 );
            expect( iTransformMatrix.scaleY ).toBe( 1 );
        });

    });

    describe( 'clone()', function() {

        it( 'should return an indentical state', function() {
            var iClone = iTransformMatrix.clone();
            expect( iClone ).toEqual( iTransformMatrix );
        });

    });

    describe( 'translate()', function() {

        it( 'should apply the translation in a cumulative fashion', function() {
            iTransformMatrix.translate( new Point( -10, 20 ) );
            iTransformMatrix.translate( new Point( -30, 5 ) );

            expect( iTransformMatrix.translateX ).toBe( -40 );
            expect( iTransformMatrix.translateY ).toBe( 25 );
        });

    });

    describe( 'scale()', function() {

        it( 'should apply the scale in a cumulative fashion', function() {
            iTransformMatrix.scale( new Point( 2, 0.5 ) );
            iTransformMatrix.scale( new Point( 2, 0.5 ) );

            expect( iTransformMatrix.scaleX ).toBe( 4 );
            expect( iTransformMatrix.scaleY ).toBe( 0.25 );
        });

        it( 'should apply the scale to existing translation', function() {
            iTransformMatrix.translate( new Point( 10, 10 ) );
            iTransformMatrix.scale( new Point( 2, 0.5 ) );

            expect( iTransformMatrix.translateX ).toBe( 20 );
            expect( iTransformMatrix.translateY ).toBe( 5 );
        });

    });

    describe( 'transformPoint()', function() {
        var iPoint: Point;

        beforeEach( function () {
            iPoint = new Point ( 10, 20 );
        });

        it( 'should apply the translation to the given point', function() {
            iTransformMatrix.translate( new Point( -10, 20 ) );
            var iTransformedPoint = iTransformMatrix.transformPoint( iPoint );

            expect( iTransformedPoint.x ).toBe( 0 );
            expect( iTransformedPoint.y ).toBe( 40 );
        });

        it( 'should apply the scale to the given point', function() {
            iTransformMatrix.scale( new Point( 2, 0.5 ) );
            var iTransformedPoint = iTransformMatrix.transformPoint( iPoint );

            expect( iTransformedPoint.x ).toBe( 20 );
            expect( iTransformedPoint.y ).toBe( 10 );
        });

        it( 'should apply both the scale and the translation to the given point', function() {
            iTransformMatrix.translate( new Point( 10, 20 ) );
            iTransformMatrix.scale( new Point( 2, 0.5 ) );
            var iTransformedPoint = iTransformMatrix.transformPoint( iPoint );

            expect( iTransformedPoint.x ).toBe( 40 );
            expect( iTransformedPoint.y ).toBe( 20 );
        });

        it( 'should matter not at which order there scale and translation where applied', function() {
            var iTransformMatrix1 = new TransformMatrix();
            iTransformMatrix1.translate( new Point( 10, 20 ) );
            iTransformMatrix1.scale( new Point( 2, 0.5 ) );
            var iTransformedPoint1 = iTransformMatrix1.transformPoint( iPoint );

            var iTransformMatrix2 = new TransformMatrix();
            iTransformMatrix2.translate( new Point( 10, 20 ) );
            iTransformMatrix2.scale( new Point( 2, 0.5 ) );
            var iTransformedPoint2 = iTransformMatrix2.transformPoint( iPoint );

            expect( iTransformedPoint1 ).toEqual( iTransformedPoint2 );
        });

    });

    describe( 'transformRect()', function() {
        var iRect: Rect;

        beforeEach( function () {
            iRect = new Rect( 100, 100, 100, 100 );
        });

        it( 'should transform the rect when only translation apply', function() {
            iTransformMatrix.translate( new Point( 10, 20 ) );
            var iTransformedRect = iTransformMatrix.transformRect( iRect );

            expect( iTransformedRect ).toEqual( new Rect( 110, 120, 100, 100 ) );
        });

        it( 'should transform the rect when only scale apply', function() {
            iTransformMatrix.scale( new Point( 2, 0.5 ) );
            var iTransformedRect = iTransformMatrix.transformRect( iRect );

            expect( iTransformedRect ).toEqual( new Rect( 200, 50, 200, 50 ) );
        });

        it( 'should transform the rect when both scale and translation apply', function() {
            iTransformMatrix.scale( new Point( 2, 0.5 ) );
            iTransformMatrix.translate( new Point( 10, 20 ) );
            var iTransformedRect = iTransformMatrix.transformRect( iRect );

            expect( iTransformedRect ).toEqual( new Rect( 220, 60, 200, 50 ) );
        });

        it( 'should matter not at which order there scale and translation where applied', function() {
            var iTransformMatrix1 = new TransformMatrix();
            iTransformMatrix1.scale( new Point( 2, 0.5 ) );
            iTransformMatrix1.translate( new Point( 10, 20 ) );
            var iTransformedRect1 = iTransformMatrix1.transformRect( iRect );

            var iTransformMatrix2 = new TransformMatrix();
            iTransformMatrix2.translate( new Point( 10, 20 ) );
            iTransformMatrix2.scale( new Point( 2, 0.5 ) );
            var iTransformedRect2 = iTransformMatrix1.transformRect( iRect );

            expect( iTransformedRect1 ).toEqual( iTransformedRect2 );
        });


    });


});
