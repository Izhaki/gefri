import { ContextPainter } from '../';
import { Rect           } from '../../geometry';
import { Viewee         } from '../../viewees/Viewee';
import { Rectangle      } from '../../viewees/shapes';
import { getClassName   } from '../../../core/Utils'

export
class CanvasRenderer extends ContextPainter {

    render( aViewee: Viewee ): void {
        let iVieweeClass = getClassName( aViewee ),
            iMethodName  = 'render' + iVieweeClass;

        this[ iMethodName ]( aViewee );

        this.renderChildren( aViewee );
    }

    renderChildren( aViewee: Viewee ): void {
        if ( aViewee.isChildless() ) return;

        aViewee.applyTransformations( this );

        aViewee.forEachChild( ( aChild ) => {
            this.render( aChild );
        });
    }

    renderRectangle( aRactangle: Rectangle ): void {
        this.drawRectangle( aRactangle.getRect() );
    }
}
