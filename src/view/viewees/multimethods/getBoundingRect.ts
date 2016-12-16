import { Point,
         Rect,
         Rects         } from './../../geometry';
import { getClassName  } from '../../../core/Utils';

import { Viewee        } from '../Viewee';
import { Root          } from '../invisibles';
import { Transformer   } from '../invisibles';
import { Rectangle     } from '../visibles/shapes';
import { Path,
         PathSegment   } from '../visibles/path';

let methods = {

    Root: ( aRoot: Root ): Rect => {
        return aRoot.getLayer().getBoundingRect().clone();
    },

    Transformer: ( aTransformer: Transformer ): Rect => {
        return getBoundingRect( aTransformer.getParent() );
    },

    Rectangle: ( aRectangle: Rectangle ): Rect => {
        return aRectangle.getRect().clone();
    },

    Path: ( aPath: Path ): Rect => {
        let iSegmentBoundingRects: Rects = [];

        aPath.forEachSegment( ( aSegment: PathSegment , aSegmentStart: Point ) => {
            let iSegmentBoundingRect: Rect = aSegment.getBoundingRect( aSegmentStart );
            iSegmentBoundingRects.push( iSegmentBoundingRect );
        });

        return Rect.unionRects( iSegmentBoundingRects );
    }
};

export
function getBoundingRect( aViewee: Viewee ): Rect {
    let iClassName = getClassName( aViewee );
    return methods[iClassName]( aViewee );
}
