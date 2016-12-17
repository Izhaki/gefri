import { getClassName,
         currify       } from '../../../../core/Utils';

import { Renderer      } from '../';

import { Root,
         Transformer   } from '../../../viewees/invisibles';
import { Rectangle     } from '../../../viewees/visibles/shapes';
import { Path,
         PathSegment,
         LineSegment,
         QuadSegment,
         CubicSegment  } from '../../../viewees/visibles/path';

export
let stroke = currify(
    ( aRenderer: Renderer) => {
        let methods = {

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

        };

        return ( aViewee ) => {
            let iClassName = getClassName( aViewee );
            return methods[iClassName]( aViewee );
        }
    }
);
