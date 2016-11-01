import { ContextPainter } from '../';
import { Rect           } from '../../geometry';
import { getClassName   } from '../../../core/Utils'
import { Viewee         } from '../../viewees/Viewee';
import { Rectangle      } from '../../viewees/shapes';
import { Transformer,
         Root           } from '../../viewees/invisibles';


export
class CanvasRenderer extends ContextPainter {

    render( aViewee: Viewee ): void {
        let iVieweeClass = getClassName( aViewee ),
            iMethodName  = 'render' + iVieweeClass;

        this[ iMethodName ]( aViewee );

        this.renderChildren( aViewee );
    }

    private renderChildren( aViewee: Viewee ): void {
        if ( aViewee.isChildless() ) return;

        this.pushState();

        if ( aViewee.isClipping ) {
            this.intersectClipAreaWith( aViewee.getBoundingRect() );
        }

        aViewee.applyTransformations( this );

        aViewee.forEachChild( ( aChild ) => {
            this.render( aChild );
        });

        this.popState();
    }

    private renderRectangle( aRactangle: Rectangle ): void {
        this.drawRectangle( aRactangle.getRect() );
    }

    private renderTransformer( aTransformer: Transformer ): void {
    }

    private renderRoot( aRoot: Root ): void {
    }

}
