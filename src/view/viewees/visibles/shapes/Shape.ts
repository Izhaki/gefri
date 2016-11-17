import { Visible          } from './../Visible';
import { Rect,
         Transformations,
         cNoScale,        } from './../../../geometry';

export
abstract class Shape extends Visible {

    getTransformations(): Transformations {
        let iBounds: Rect = this.getBoundingRect();

        return {
            translate: iBounds.getLeftTop(),
            scale:     cNoScale
        }
    }

}
