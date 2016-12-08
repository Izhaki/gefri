import { Context2DMock   } from '../../../../tests/mocks';
import { Contextual,     } from './Contextual';
import { Clipped         } from './../';
import { ClippedSpecs    } from './../Clipped.spec';

function createContextual(): Clipped {
    return new Contextual( new Context2DMock() );
}

describe( 'Contextual', () => {

    describe( 'is a Clipped', () => {
        ClippedSpecs.call( this, createContextual );
    })

    beforeEach( () => {
        this.contextual = createContextual();
        this.context = this.contextual.context;
    });

});
