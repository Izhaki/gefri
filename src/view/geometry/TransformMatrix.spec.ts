import { TransformMatrix,
         Rect,
         Point            } from './';

describe( 'TransformMatrix', () => {

    beforeEach( () => {
        this.matrix = new TransformMatrix();
    });


    describe( 'constructor()', () => {

        it( 'should initiate the translation', () => {
            expect( this.matrix.translateX ).toBe( 0 );
            expect( this.matrix.translateY ).toBe( 0 );
        });

        it( 'should initiate the scale', () => {
            expect( this.matrix.scaleX ).toBe( 1 );
            expect( this.matrix.scaleY ).toBe( 1 );
        });

    });


    describe( 'clone()', () => {

        it( 'should return an indentical state', () => {
            var iClone = this.matrix.clone();
            expect( iClone ).toEqual( this.matrix );
        });

    });

    describe( 'translate()', () => {

        it( 'should apply the translation in a cumulative fashion', () => {
            this.matrix.translate( -10, 20 );
            this.matrix.translate( -30, 5 );

            expect( this.matrix.translateX ).toBe( -40 );
            expect( this.matrix.translateY ).toBe( 25 );
        });

    });


    describe( 'scale()', () => {

        it( 'should apply the scale in a cumulative fashion', () => {
            this.matrix.scale( 2, 0.5 );
            this.matrix.scale( 2, 0.5 );

            expect( this.matrix.scaleX ).toBe( 4 );
            expect( this.matrix.scaleY ).toBe( 0.25 );
        });

        it( 'should apply the scale to existing translation', () => {
            this.matrix.translate( 10, 10 );
            this.matrix.scale( 2, 0.5 );

            expect( this.matrix.translateX ).toBe( 20 );
            expect( this.matrix.translateY ).toBe( 5 );
        });

    });


    describe( 'transformPoint()', () => {
        var iPoint: Point;

        beforeEach( () => {
            iPoint = new Point ( 10, 20 );
        });

        it( 'should apply the translation to the given point', () => {
            this.matrix.translate( -10, 20 );
            var iTransformedPoint = this.matrix.transformPoint( iPoint );

            expect( iTransformedPoint ).toEqualPoint( 0, 40 );
        });

        it( 'should apply the scale to the given point', () => {
            this.matrix.scale( 2, 0.5 );
            var iTransformedPoint = this.matrix.transformPoint( iPoint );

            expect( iTransformedPoint ).toEqualPoint( 20, 10 );
        });

        it( 'should apply both the scale and the translation to the given point', () => {
            this.matrix.translate( 10, 20 );
            this.matrix.scale( 2, 0.5 );
            var iTransformedPoint = this.matrix.transformPoint( iPoint );

            expect( iTransformedPoint ).toEqualPoint( 40, 20 );
        });

        it( 'should matter not at which order there scale and translation where applied', () => {
            var iMatrix1 = new TransformMatrix();
            iMatrix1.translate( 10, 20 );
            iMatrix1.scale( 2, 0.5 );
            var iTransformedPoint1 = iMatrix1.transformPoint( iPoint );

            var iMatrix2 = new TransformMatrix();
            iMatrix2.translate( 10, 20 );
            iMatrix2.scale( 2, 0.5 );
            var iTransformedPoint2 = iMatrix2.transformPoint( iPoint );

            expect( iTransformedPoint1 ).toEqual( iTransformedPoint2 );
        });

    });


    describe( 'transformRect()', () => {
        var iRect: Rect;

        beforeEach( () => {
            iRect = new Rect( 100, 100, 100, 100 );
        });

        it( 'should transform the rect when only translation apply', () => {
            this.matrix.translate( 10, 20 );
            var iTransformedRect = this.matrix.transformRect( iRect );

            expect( iTransformedRect ).toEqualRect( 110, 120, 100, 100 );
        });

        it( 'should transform the rect when only scale apply', () => {
            this.matrix.scale( 2, 0.5 );
            var iTransformedRect = this.matrix.transformRect( iRect );

            expect( iTransformedRect ).toEqualRect( 200, 50, 200, 50 );
        });

        it( 'should transform the rect when both scale and translation apply', () => {
            this.matrix.scale( 2, 0.5 );
            this.matrix.translate( 10, 20 );
            var iTransformedRect = this.matrix.transformRect( iRect );

            expect( iTransformedRect ).toEqualRect( 220, 60, 200, 50 );
        });

        it( 'should matter not at which order there scale and translation where applied', () => {
            var iMatrix1 = new TransformMatrix();
            iMatrix1.scale( 2, 0.5 );
            iMatrix1.translate( 10, 20 );
            var iTransformedRect1 = iMatrix1.transformRect( iRect );

            var iMatrix2 = new TransformMatrix();
            iMatrix2.translate( 10, 20 );
            iMatrix2.scale( 2, 0.5 );
            var iTransformedRect2 = iMatrix1.transformRect( iRect );

            expect( iTransformedRect1 ).toEqual( iTransformedRect2 );
        });


    });

    describe( 'detransformPoint()', () => {

        it( 'should undo what transformPoint did', () => {
            var iPoint = new Point ( 10, 20 );

            this.matrix.translate( -10, 20 );
            this.matrix.scale( 2, 4 );
            var iTransformedPoint = this.matrix.transformPoint( iPoint );
            var idetransformedPoint = this.matrix.detransformPoint( iTransformedPoint );

            expect( idetransformedPoint ).toEqualPoint( 10, 20 );
        });

    });

    describe( 'detransformRect()', () => {

        it( 'should undo what transformRect did', () => {
            var iRect = new Rect ( 10, 20, 30, 40 );

            this.matrix.translate( -10, 20 );
            this.matrix.scale( 2, 4 );
            var iTransformedRect = this.matrix.transformRect( iRect );
            var idetransformedRect = this.matrix.detransformRect( iTransformedRect );

            expect( idetransformedRect ).toEqualRect( 10, 20, 30, 40 );

        });

    });



});
