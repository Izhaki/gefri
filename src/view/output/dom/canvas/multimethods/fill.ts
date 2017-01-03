import { currify          } from '../../../../../core/Utils';
import { methodDispatcher } from '../../../../viewees/methodDispatcher'
import { Renderer         } from '../';

import { Root,
         Transformer,
         Rectangle,
         Path,            } from '../../../../viewees';

export
let fill = currify(
    ( aRenderer: Renderer) => methodDispatcher({

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

    })

);
