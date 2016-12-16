import { Invisible       } from './';
import { Translation,
         Scale,
         cNoTranslate,
         cNoScale        } from '../../geometry';

export
class Transformer extends Invisible {

    private translation: Translation = cNoTranslate.clone();
    private zoom:        Scale       = cNoScale.clone();
    private scale:       Scale       = cNoScale.clone();

    constructor() {
        super();
        this.isClipping = false;
    }

    setTranslate( x: number, y: number ) {
        this.translation.set( x, y );
        this.notifyUpdate()
    }

    getTranslate(): Translation {
        return this.translation;
    }

    setZoom( x: number, y: number ) {
        this.zoom.set( x, y );
        this.notifyUpdate()
    }

    getZoom(): Scale {
        return this.zoom;
    }

    setScale( x: number, y: number ) {
        this.scale.set( x, y );
        this.notifyUpdate()
    }

    getScale(): Scale {
        return this.scale;
    }

}
