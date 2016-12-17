import { getClassName,
         currify      } from '../../../../core/Utils';

import { Renderer   } from '../';

import { Root,
         Transformer  } from '../../../viewees/invisibles';
import { Rectangle    } from '../../../viewees/visibles/shapes';
import { Path         } from '../../../viewees/visibles/path';

export
let fill = currify(
    ( aRenderer: Renderer) => {
        let methods = {

            Root: ( aRoot: Root ): void => {
            },

            Transformer: ( aTransformer: Transformer ): void => {
            },

            Rectangle: ( aRectangle: Rectangle ): void => {
                aRenderer.setFillStyle( aRectangle.fillColour );
                aRenderer.fillRect( aRectangle.getRect() );
            },

            Path: ( aPath: Path ): void => {
            }
        };

        return ( aViewee ) => {
            let iClassName = getClassName( aViewee );
            return methods[iClassName]( aViewee );
        }
    }
);
