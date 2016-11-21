import { Viewee         } from './Viewee';
import { CompositeSpecs } from '../../core/Composite.spec';

export
function VieweeSpecs(  createViewee: () => Viewee ) {

    describe( 'is a Composite', () => {
        CompositeSpecs.call( this, createViewee );
    });

    beforeEach( () => {
        this.viewee  = createViewee();
    });

}
