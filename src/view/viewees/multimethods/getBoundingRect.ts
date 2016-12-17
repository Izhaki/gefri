import { methodDispatcher } from '../methodDispatcher'

import { Point,
         Rect,
         Rects         } from './../../geometry';

import { Root,
         Transformer,
         Rectangle,
         Path,
         PathSegment   } from '../';

export
let getBoundingRect = methodDispatcher({

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
});
