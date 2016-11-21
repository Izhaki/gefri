import { Invisible       } from './';
import { ElementLayer    } from '../../output';
import { Rect,
         cNoTranslate,
         cNoScale,
         Transformations } from '../../geometry';

// An adapter between the viewee composition and the control.
// There is only one root per viewee hierarchy, and it is created automatically
// by the control.
export
class Root extends Invisible {
    private layer: ElementLayer;

    constructor( aElementLayer: ElementLayer ) {
        super();
        this.layer = aElementLayer;
    }

    getBoundingRect(): Rect {
        // TODO change to tactic
        return this.layer.getBoundingRect();
    }

    getTransformations(): Transformations {
        return {
            translate: cNoTranslate,
            scale:     cNoScale
        }
    }

}
