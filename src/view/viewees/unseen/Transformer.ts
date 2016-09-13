import { Unseen }        from './Unseen';
import { Painter }       from '../../output/Painter';
import { Transformable } from './../../output/Transformable';
import { Point }         from '../../geometry/Point';

export
class Transformer extends Unseen {

    private translation: Point = new Point( 0, 0 );
    private scale:       Point = new Point( 1, 1 );

    setTranslate( x: number, y: number ) {
        this.translation.set( x, y );
    }

    setScale( x: number, y: number ) {
        this.scale.set( x, y );
    }

    protected applyTransformations( aTransformable: Transformable ): void {
        super.applyTransformations( aTransformable );
        aTransformable.translate( this.translation.x, this.translation.y );
        aTransformable.scale( this.scale.x, this.scale.y );
    }

}
