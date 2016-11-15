import { Invisible       } from './';
import { Rect,
         Translation,
         Scale,
         cNoTranslate,
         cNoScale,
         Transformations } from '../../geometry';

export
class Transformer extends Invisible {

    private translation: Translation = cNoTranslate.clone();
    private scale:       Scale       = cNoScale.clone();

    constructor() {
        super();
        this.isClipping = false;
    }

    setTranslate( x: number, y: number ) {
        this.translation.set( x, y );
        this.notifyUpdate()
    }

    setScale( x: number, y: number ) {
        this.scale.set( x, y );
        this.notifyUpdate()
    }

    /* istanbul ignore next */
    getBoundingRect(): Rect {
        // TODO change to tactic
        return this.getParent().getBoundingRect();
    }

    getTransformations(): Transformations {
        return {
            translate: this.translation,
            scale:     this.scale
        }
    }

}
