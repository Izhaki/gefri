import { InvisibleSpecs } from './Invisible.spec';
import { createControl  } from '../../Control.spec';
import { Layer          } from '../../output/canvas';
import { Root           } from './'

export
function createRoot(): Root {
    let iControl = createControl();
    let iLayer   = new Layer();
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
