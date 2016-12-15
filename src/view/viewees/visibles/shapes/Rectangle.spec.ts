import { ShapeSpecs         } from './Shape.spec';
import { Rectangle          } from './';

function createRectangle(): Rectangle {
    return new Rectangle( 10, 10, 20, 20 );
}

describe( 'Rectangle', () => {

    describe( 'is a Shape', () => {
        ShapeSpecs.call( this, createRectangle);
    })

    beforeEach( () => {
        this.rectangle = createRectangle();
    });

});
