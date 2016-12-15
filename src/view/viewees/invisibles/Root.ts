import { Invisible       } from './';
import { ElementLayer    } from '../../output';
import { Rect,
         cNoTranslate,
         cNoScale        } from '../../geometry';
import { Transformations } from '../../output';

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

    getLayer(): ElementLayer {
        return this.layer;
    }

    getTransformations(): Transformations {
        return {
            translate: cNoTranslate,
            zoom:      cNoScale,
            scale:     cNoScale
        }
    }

}
