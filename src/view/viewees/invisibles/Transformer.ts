import { Invisible     } from './';
import { Painter,
         Updater,
         Transformable } from '../../output';
import { Point,
         Rect          } from '../../geometry';
import { summonUpdater } from '../tactics/children/summonUpdater'

export
class Transformer extends Invisible {

    private translation: Point = new Point( 0, 0 );
    private scale:       Point = new Point( 1, 1 );

    constructor() {
        super();
        this.isClipping = false;
    }

    setTranslate( x: number, y: number ) {
        this.translation.set( x, y );
        this.erase();
    }

    setScale( x: number, y: number ) {
        this.scale.set( x, y );
        this.erase();
    }

    /* istanbul ignore next */
    getBoundingRect(): Rect {
        // TODO change to tactic
        return this.getParent().getBoundingRect();
    }

    applyTransformations( aTransformable: Transformable ): void {
        super.applyTransformations( aTransformable );
        aTransformable.translate( this.translation.x, this.translation.y );
        aTransformable.scale( this.scale.x, this.scale.y );
    }

    summonUpdater() : Updater {
        return summonUpdater( this );
    }


}
