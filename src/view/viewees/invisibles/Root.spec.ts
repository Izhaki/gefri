import { InvisibleSpecs } from './Invisible.spec';
import { createControl  } from '../../Control.spec';
import { createLayer    } from '../../output/canvas/Layer.spec';
import { Root           } from './'

export
function createRoot(): Root {
    let iControl = createControl();
    let iLayer   = createLayer();
    iControl.addLayer( iLayer );
    return iLayer.getRoot();
}

describe( 'Root', () => {

    describe( 'is an Invisibe', () => {
        InvisibleSpecs.call( this, createRoot );
    });

    beforeEach( () => {
        this.root = createRoot();
    });

});
