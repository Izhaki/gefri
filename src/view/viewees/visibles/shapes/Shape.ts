import { Visible          } from './../Visible';
import { Rect,
         cNoScale,        } from './../../../geometry';
import { Transformations  } from './../../../output';

export
abstract class Shape extends Visible {

    getTransformations(): Transformations {
        let iBounds: Rect = this.getBoundingRect();

        return {
            translate: iBounds.getLeftTop(),
            zoom:      cNoScale,
            scale:     cNoScale
        }
    }

}
