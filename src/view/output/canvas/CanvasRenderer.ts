import { ContextPainter  } from '../';
import { Rect,
         Transformations } from '../../geometry';
import { getClassName    } from '../../../core/Utils'
import { Viewee          } from '../../viewees/Viewee';
import { Rectangle       } from '../../viewees/shapes';
import { Transformer,
         Root            } from '../../viewees/invisibles';


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

        this.applyTransformations( aViewee );

        aViewee.forEachChild( ( aChild ) => {
            this.render( aChild );
        });

        this.popState();
    }

    private applyTransformations( aViewee: Viewee ): void {
        let iTransformations: Transformations = aViewee.getTransformations();

        this.translate( iTransformations.translate );
        this.scale( iTransformations.scale );
    }

    private renderRectangle( aRactangle: Rectangle ): void {
        this.drawRectangle( aRactangle.getRect() );
    }

    private renderTransformer( aTransformer: Transformer ): void {
    }

    private renderRoot( aRoot: Root ): void {
    }

}
