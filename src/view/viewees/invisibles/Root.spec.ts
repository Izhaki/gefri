import { InvisibleSpecs } from './Invisible.spec';
import { createControl  } from '../../Control.spec';
import { Root           } from './'

export
function createRoot(): Root {
    let iControl = createControl();
    return iControl.getLayer().getRoot();
}

describe( 'Root', () => {

    describe( 'is an Invisibe', () => {
        InvisibleSpecs.call( this, createRoot );
    });

    beforeEach( () => {
        this.root = createRoot();
    });

});
