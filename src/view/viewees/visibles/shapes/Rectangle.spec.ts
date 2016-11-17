import { ShapeSpecs         } from './Shape.spec';
import { Rectangle          } from './';
import { Rect               } from '../../../geometry';

function createRectangle(): Rectangle {
    return new Rectangle( new Rect( 10, 10, 20, 20 ) );
}

describe( 'Rectangle', () => {

    describe( 'is a Shape', () => {
        ShapeSpecs.call( this, createRectangle);
    })

    beforeEach( () => {
        this.rectangle = createRectangle();
    });

    describe( 'getBoundingRect()', () => {
        it( 'should return the bounds of the rectangle', () => {
            expect( this.rectangle.getBoundingRect() ).toEqualRect( 10, 10, 20, 20 );
        });

    });

});
