import { Viewee           } from './../Viewee';
import { Rect,
         Transformations,
         cNoScale,        } from './../../geometry';

export
abstract class Shape extends Viewee {

    getTransformations(): Transformations {
        let iBounds: Rect = this.getBoundingRect();

        return {
            translate: iBounds.getLeftTop(),
            scale:     cNoScale
        }
    }

}
