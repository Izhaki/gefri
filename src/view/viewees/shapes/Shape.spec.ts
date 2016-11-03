import { VieweeSpecs } from '../Viewee.spec';
import { Shape       } from './';

export
function ShapeSpecs( createShape: () => Shape ) {

    describe( 'Shape', () => {

        describe( 'is a Viewee', () => {
            VieweeSpecs.call( this, createShape );
        });

        beforeEach( () => {
            this.shape = createShape();
        });

    });

}
