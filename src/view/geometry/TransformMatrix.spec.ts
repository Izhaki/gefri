import { TransformMatrix,
         Rect,
         Point            } from './';

describe( 'TransformMatrix', () => {

    beforeEach( () => {
        this.transformMatrix = new TransformMatrix();
    });


    describe( 'constructor()', () => {

        it( 'should initiate the translation', () => {
            expect( this.transformMatrix.translateX ).toBe( 0 );
            expect( this.transformMatrix.translateY ).toBe( 0 );
        });

        it( 'should initiate the scale', () => {
            expect( this.transformMatrix.scaleX ).toBe( 1 );
            expect( this.transformMatrix.scaleY ).toBe( 1 );
        });

    });


    describe( 'clone()', () => {

        it( 'should return an indentical state', () => {
            var iClone = this.transformMatrix.clone();
            expect( iClone ).toEqual( this.transformMatrix );
        });

    });

    describe( 'translate()', () => {

        it( 'should apply the translation in a cumulative fashion', () => {
            this.transformMatrix.translate( -10, 20 );
            this.transformMatrix.translate( -30, 5 );

            expect( this.transformMatrix.translateX ).toBe( -40 );
            expect( this.transformMatrix.translateY ).toBe( 25 );
        });

    });


    describe( 'scale()', () => {

        it( 'should apply the scale in a cumulative fashion', () => {
            this.transformMatrix.scale( 2, 0.5 );
            this.transformMatrix.scale( 2, 0.5 );

            expect( this.transformMatrix.scaleX ).toBe( 4 );
            expect( this.transformMatrix.scaleY ).toBe( 0.25 );
        });

        it( 'should apply the scale to existing translation', () => {
            this.transformMatrix.translate( 10, 10 );
            this.transformMatrix.scale( 2, 0.5 );

            expect( this.transformMatrix.translateX ).toBe( 20 );
            expect( this.transformMatrix.translateY ).toBe( 5 );
        });

    });


    describe( 'transformPoint()', () => {
        var iPoint: Point;

        beforeEach( () => {
            iPoint = new Point ( 10, 20 );
        });

        it( 'should apply the translation to the given point', () => {
            this.transformMatrix.translate( -10, 20 );
            var iTransformedPoint = this.transformMatrix.transformPoint( iPoint );

            expect( iTransformedPoint.x ).toBe( 0 );
            expect( iTransformedPoint.y ).toBe( 40 );
        });

        it( 'should apply the scale to the given point', () => {
            this.transformMatrix.scale( 2, 0.5 );
            var iTransformedPoint = this.transformMatrix.transformPoint( iPoint );

            expect( iTransformedPoint.x ).toBe( 20 );
            expect( iTransformedPoint.y ).toBe( 10 );
        });

        it( 'should apply both the scale and the translation to the given point', () => {
            this.transformMatrix.translate( 10, 20 );
            this.transformMatrix.scale( 2, 0.5 );
            var iTransformedPoint = this.transformMatrix.transformPoint( iPoint );

            expect( iTransformedPoint.x ).toBe( 40 );
            expect( iTransformedPoint.y ).toBe( 20 );
        });

        it( 'should matter not at which order there scale and translation where applied', () => {
            var iTransformMatrix1 = new TransformMatrix();
            iTransformMatrix1.translate( 10, 20 );
            iTransformMatrix1.scale( 2, 0.5 );
            var iTransformedPoint1 = iTransformMatrix1.transformPoint( iPoint );

            var iTransformMatrix2 = new TransformMatrix();
            iTransformMatrix2.translate( 10, 20 );
            iTransformMatrix2.scale( 2, 0.5 );
            var iTransformedPoint2 = iTransformMatrix2.transformPoint( iPoint );

            expect( iTransformedPoint1 ).toEqual( iTransformedPoint2 );
        });

    });


    describe( 'transformRect()', () => {
        var iRect: Rect;

        beforeEach( () => {
            iRect = new Rect( 100, 100, 100, 100 );
        });

        it( 'should transform the rect when only translation apply', () => {
            this.transformMatrix.translate( 10, 20 );
            var iTransformedRect = this.transformMatrix.transformRect( iRect );

            expect( iTransformedRect ).toEqual( new Rect( 110, 120, 100, 100 ) );
        });

        it( 'should transform the rect when only scale apply', () => {
            this.transformMatrix.scale( 2, 0.5 );
            var iTransformedRect = this.transformMatrix.transformRect( iRect );

            expect( iTransformedRect ).toEqual( new Rect( 200, 50, 200, 50 ) );
        });

        it( 'should transform the rect when both scale and translation apply', () => {
            this.transformMatrix.scale( 2, 0.5 );
            this.transformMatrix.translate( 10, 20 );
            var iTransformedRect = this.transformMatrix.transformRect( iRect );

            expect( iTransformedRect ).toEqual( new Rect( 220, 60, 200, 50 ) );
        });

        it( 'should matter not at which order there scale and translation where applied', () => {
            var iTransformMatrix1 = new TransformMatrix();
            iTransformMatrix1.scale( 2, 0.5 );
            iTransformMatrix1.translate( 10, 20 );
            var iTransformedRect1 = iTransformMatrix1.transformRect( iRect );

            var iTransformMatrix2 = new TransformMatrix();
            iTransformMatrix2.translate( 10, 20 );
            iTransformMatrix2.scale( 2, 0.5 );
            var iTransformedRect2 = iTransformMatrix1.transformRect( iRect );

            expect( iTransformedRect1 ).toEqual( iTransformedRect2 );
        });


    });

    describe( 'detransformPoint()', () => {

        it( 'should undo what transformPoint did', () => {
            var iPoint = new Point ( 10, 20 );

            this.transformMatrix.translate( -10, 20 );
            this.transformMatrix.scale( 2, 4 );
            var iTransformedPoint = this.transformMatrix.transformPoint( iPoint );
            var idetransformedPoint = this.transformMatrix.detransformPoint( iTransformedPoint );

            expect( idetransformedPoint.x ).toBe( 10 );
            expect( idetransformedPoint.y ).toBe( 20 );
        });

    });

    describe( 'detransformRect()', () => {

        it( 'should undo what transformRect did', () => {
            var iRect = new Rect ( 10, 20, 30, 40 );

            this.transformMatrix.translate( -10, 20 );
            this.transformMatrix.scale( 2, 4 );
            var iTransformedRect = this.transformMatrix.transformRect( iRect );
            var idetransformedRect = this.transformMatrix.detransformRect( iTransformedRect );

            expect( idetransformedRect ).toEqualRect( 10, 20, 30, 40 );

        });

    });



});
