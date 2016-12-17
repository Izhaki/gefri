import { Rect          } from './../../geometry';

import { getClassName,
         currify       } from '../../../core/Utils';

import { Transformable } from '../../output';

import { Viewee        } from '../Viewee';
import { Root,
         Transformer   } from '../invisibles';
import { Rectangle     } from '../visibles/shapes';
import { Path,
         PathSegment   } from '../visibles/path';

import { getBoundingRect } from './getBoundingRect';

export
let cumulateTransformationsOf = currify(
    ( aTransformable: Transformable) => {
        let methods = {

            Root: ( aRoot: Root ): void => {
            },

            Transformer: ( aTransformer: Transformer ): void => {
                aTransformable.translate( aTransformer.getTranslate() );
                aTransformable.scale    ( aTransformer.getScale()     );
                aTransformable.zoom     ( aTransformer.getZoom()      );
            },

            Rectangle: ( aRectangle: Rectangle ): void => {
                let iBounds: Rect = getBoundingRect( aRectangle );
                aTransformable.translate( iBounds.getLeftTop() );
            },

            // Path: ( aPath: Path ): void => {
            // }
        };

        return ( aViewee ) => {
            let iClassName = getClassName( aViewee );
            return methods[iClassName]( aViewee );
        }
    }
);
