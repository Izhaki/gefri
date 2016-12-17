import { createControl     } from '../../../Control.spec'
import { Layer             } from '../'
import { triggerNextFrame  } from '../../onNextFrame'
import * as helpers from '../../../../../tests/unit/helpers';
import { overrideProviders } from '../../../../core/di';

function disableAntialiasingEraseCompensation(): void {

    beforeEach( () => {
        overrideProviders([{
            provide: 'antialiasingExtraMargins', useValue: 0
        }]);
    });
}

export
function setup( antialiasingEraseCompensation: Boolean = false ): void {

    if ( !antialiasingEraseCompensation ) {
        disableAntialiasingEraseCompensation();
    }

    beforeEach( () => {
        this.createViewees = helpers.createViewees;
    });

    beforeEach( () => {
        this.control  = createControl();
        this.layer    = new Layer();
        this.control.addLayer( this.layer );

        this.context  = this.layer.context;
    });

    beforeEach( () => {
        this.clearRenderedLog = () => {
            triggerNextFrame();
            this.context.reset();
        }
    });

    beforeEach( () => {
        this.clearRenderedLog();
    });

}
