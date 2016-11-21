import { Control       }  from '../../Control';
import { createControl } from '../../Control.spec'
import * as helpers from '../../../../tests/unit/helpers';

export
function setup(): void {

    beforeEach( () => {
        this.createViewees = helpers.createViewees;
    });

    beforeEach( () => {
        this.control  = createControl();
        this.context  = this.control.getLayer().context;
    });

}
