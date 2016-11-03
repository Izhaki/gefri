import { Invisible } from './';
import { Control   } from '../../Control';
import { Rect      } from '../../geometry';

// An adapter between the viewee composition and the control.
// There is only one root per viewee hierarchy, and it is created automatically
// by the control.
export
class Root extends Invisible {
    private control: Control;

    constructor( aControl: Control ) {
        super();
        this.control = aControl;
    }

    getBoundingRect(): Rect {
        // TODO change to tactic
        return this.control.getBoundingRect();
    }

}
