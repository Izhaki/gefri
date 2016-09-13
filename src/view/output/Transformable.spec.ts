import { Transformable } from './Transformable';
import { Rect }    from '../geometry/Rect';

export
function TransformableSpecs( createTransformable: () => Transformable ) {

    describe( 'Transformable', () => {

        beforeEach( () => {
            this.transformable = createTransformable();
        });

        describe( 'translate()', () => {

            it( 'should update the transformable`s transform matrix', () => {
                this.transformable.translate( 10, 20 );
                this.transformable.translate( 10, 20 );

                expect( this.transformable.matrix.translateX ).toBe( 20 );
                expect( this.transformable.matrix.translateY ).toBe( 40 );
            });

        });

        describe( 'scale()', () => {

            it( 'should update the transformable`s transform matrix', () => {
                this.transformable.scale( 2, 2 );
                this.transformable.scale( 4, 4 );

                expect( this.transformable.matrix.scaleX ).toBe( 8 );
                expect( this.transformable.matrix.scaleY ).toBe( 8 );
            });

        });


        describe( 'toAbsoluteRect()', () => {

            it( 'should return the rect transformed to absolute coordinates', () => {
                var iRect = new Rect( 100, 100, 100, 100);

                this.transformable.translate( 10, 20 );
                this.transformable.translate( 10, 20 );

                var iAbsoluteRect = this.transformable.toAbsoluteRect( iRect );

                expect( iAbsoluteRect ).toEqualRect( 120, 140, 100, 100 );
            });

        });

        describe( 'popState()', () => {

            it( 'should restore the transformation matrix', () => {
                this.transformable.translate( 10, 15 );
                this.transformable.pushState();
                this.transformable.translate( 20, 20 );

                this.transformable.popState();

                expect( this.transformable.matrix.translateX ).toBe( 10 );
                expect( this.transformable.matrix.translateY ).toBe( 15 );
            });

        });

    });

}
