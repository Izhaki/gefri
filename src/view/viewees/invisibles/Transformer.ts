import { Invisible }     from './Invisible';
import { Painter }       from '../../output/Painter';
import { Updater }       from '../../output/Updater';
import { Transformable } from '../../output/Transformable';
import { Point }         from '../../geometry/Point';
import { Rect }          from '../../geometry/Rect';

import { summonUpdater } from '../tactics/children/summonUpdater'

export
class Transformer extends Invisible {

    private translation: Point = new Point( 0, 0 );
    private scale:       Point = new Point( 1, 1 );

    setTranslate( x: number, y: number ) {
        this.translation.set( x, y );
    }

    setScale( x: number, y: number ) {
        this.scale.set( x, y );
    }

    protected getBoundingRect(): Rect {
        // TODO change to tactic
        return new Rect( 0, 0, 100, 100 );
    }

    protected applyTransformations( aTransformable: Transformable ): void {
        super.applyTransformations( aTransformable );
        aTransformable.translate( this.translation.x, this.translation.y );
        aTransformable.scale( this.scale.x, this.scale.y );
    }

    summonUpdater() : Updater {
        return summonUpdater( this );
    }


}
