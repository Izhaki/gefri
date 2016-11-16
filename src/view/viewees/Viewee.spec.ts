import { Viewee         } from './Viewee';
import { Rectangle      } from './shapes';
import { CompositeSpecs } from '../../core/Composite.spec';
import { createControl  } from '../Control.spec';
import { Rect,
         Point          } from '../geometry';

export
function VieweeSpecs(  createViewee: () => Viewee ) {

    describe( 'is a Composite', () => {
        CompositeSpecs.call( this, createViewee );
    });

    beforeEach( () => {
        this.viewee  = createViewee();
    });

}
