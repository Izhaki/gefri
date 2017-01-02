import { TransformMatrix,
         Rect             } from './';

describe( 'TransformMatrix', () => {

    describe( 'The static method', () => {

        describe( 'combine()', () => {

            it( 'should return a new matric that that when applied yields similar results as applying the matrices provided one by one', () => {
                this.matrix1 = new TransformMatrix( 2, 2, 10, 20 );
                this.matrix2 = new TransformMatrix( 4, 4, -20, -10 );

                this.combinedMatrix = TransformMatrix.combine( this.matrix1, this.matrix2 );

                this.rect1 = new Rect( 100, 100, 100, 100 );
                this.rect2 = new Rect( 100, 100, 100, 100 );

                this.rect1t = this.rect1.apply( this.matrix1, this.matrix2);
                this.rect2t = this.rect2.apply( this.combinedMatrix);

                expect( this.rect1t ).toEqual( this.rect2t )
            });

        });

    });

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

});
