import { createControl    } from '../../../Control.spec'
import { createLayer      } from '../Layer.spec'
import { triggerNextFrame } from '../../../onNextFrame'
import * as helpers from '../../../../../tests/unit/helpers';

export
function setup(): void {

    beforeEach( () => {
        this.createViewees = helpers.createViewees;
    });

    beforeEach( () => {
        this.control  = createControl();
        this.layer    = createLayer();
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
