import { InvisibleSpecs } from './Invisible.spec';
import { Transformer    } from './';

function createTransformer(): Transformer {
    return new Transformer();
}

describe( 'Transformer', () => {

    describe( 'is an Invisible', () => {
        InvisibleSpecs.call( this, createTransformer );
    });

    beforeEach( () => {
        this.transformer = createTransformer();
    });

});
