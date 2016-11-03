import { VieweeSpecs   } from '../Viewee.spec';
import { Invisible     } from './';

export
function InvisibleSpecs( createInvisible: () => Invisible ) {

    describe( 'Invisible', () => {

        describe( 'is a Viewee', () => {
            VieweeSpecs.call( this, createInvisible );
        });

    });

}
