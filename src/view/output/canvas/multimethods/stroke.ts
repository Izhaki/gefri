import { currify          } from '../../../../core/Utils';
import { methodDispatcher } from '../../../viewees/methodDispatcher'
import { Renderer         } from '../';

import { Root,
         Transformer,
         Rectangle,
         Path,
         PathSegment,
         LineSegment,
         QuadSegment,
         CubicSegment  } from '../../../viewees';

export
let stroke = currify(
    ( aRenderer: Renderer) => methodDispatcher({

        Root: ( aRoot: Root ): void => {
        },

        Transformer: ( aTransformer: Transformer ): void => {
        },

        Rectangle: ( aRectangle: Rectangle ): void => {
            aRenderer.strokeRect( aRectangle.getRect() );
        },

        Path: ( aPath: Path ): void => {
            aRenderer.startPath( aPath.getStart() );

            aPath.forEachSegment( ( aSegment: PathSegment ) => {
                aRenderer.stroke( aSegment );
            });

            aRenderer.endPath();
        },

        LineSegment: ( aSegment: LineSegment ): void => {
            aRenderer.lineTo( aSegment.getEnd() );
        },

        QuadSegment: ( aSegment: QuadSegment ): void => {
            aRenderer.quadTo( aSegment.getControl(), aSegment.getEnd() );
        },

        CubicSegment: ( aSegment: CubicSegment ): void => {
            aRenderer.cubicTo( aSegment.getControl1(), aSegment.getControl2(), aSegment.getEnd() );
        }

    })

);
