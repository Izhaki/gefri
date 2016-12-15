import { Visible          } from './../Visible';
import { Rect,
         cNoScale,        } from './../../../geometry';
import { Transformations  } from './../../../output';

import { getBoundingRect } from '../../multimethods';

export
abstract class Shape extends Visible {

    getTransformations(): Transformations {
        let iBounds: Rect = getBoundingRect( this );

        return {
            translate: iBounds.getLeftTop(),
            zoom:      cNoScale,
            scale:     cNoScale
        }
    }

}
