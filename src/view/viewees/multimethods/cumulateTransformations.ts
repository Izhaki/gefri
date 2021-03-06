import { currify          } from '../../../core/Utils';
import { methodDispatcher } from '../methodDispatcher'
import { getBoundingRect  } from './getBoundingRect';

import { Transformable } from '../../output';

import { Rect          } from './../../geometry';

import { Root,
         Transformer,
         Rectangle,
         Path          } from '../';

export
let cumulateTransformationsOf = currify(
    ( aTransformable: Transformable) => methodDispatcher({
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
    })
);
