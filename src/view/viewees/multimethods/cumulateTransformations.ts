import { Rect          } from './../../geometry';

import { getClassName  } from '../../../core/Utils';

import { Transformable } from '../../output';

import { Viewee        } from '../Viewee';
import { Root          } from '../invisibles';
import { Transformer   } from '../invisibles';
import { Rectangle     } from '../visibles/shapes';
import { Path,
         PathSegment   } from '../visibles/path';

import { getBoundingRect } from './getBoundingRect';

let methods = {

    Root: ( aTransformable: Transformable, aRoot: Root ): void => {
    },

    Transformer: ( aTransformable: Transformable, aTransformer: Transformer ): void => {
        aTransformable.translate( aTransformer.getTranslate() );
        aTransformable.scale    ( aTransformer.getScale()     );
        aTransformable.zoom     ( aTransformer.getZoom()      );
    },

    Rectangle: ( aTransformable: Transformable, aRectangle: Rectangle ): void => {
        let iBounds: Rect = getBoundingRect( aRectangle );
        aTransformable.translate( iBounds.getLeftTop() );
    },

    // Path: ( aTransformable: Transformable, aPath: Path ): void => {
    // }
};

export
function cumulateTransformations( aTransformable: Transformable, aViewee: Viewee ) {
    let iClassName = getClassName( aViewee );
    return methods[iClassName]( aTransformable, aViewee );
}
