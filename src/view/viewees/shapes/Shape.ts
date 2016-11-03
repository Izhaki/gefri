import { Viewee        } from './../Viewee';
import { Transformable } from './../../output';
import { Rect          } from './../../geometry';

export
abstract class Shape extends Viewee {

    applyTransformations( aTransformable: Transformable ): void {
        super.applyTransformations( aTransformable );
        var iBounds: Rect = this.getBoundingRect();
        aTransformable.translate( iBounds.getLeft(), iBounds.getTop() );
    }

}
