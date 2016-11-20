import { ContextPainter  } from '../';
import { Rect,
         Rects,
         Transformations } from '../../geometry';
import { getClassName    } from '../../../core/Utils';
import { Viewee          } from '../../viewees/Viewee';
import { Visible         } from '../../viewees/visibles/Visible';
import { Rectangle       } from '../../viewees/visibles/shapes';

import { Transformer,
         Root            } from '../../viewees/invisibles';

export
class CanvasRenderer extends ContextPainter {

    refresh( aViewee: Viewee, damagedRects: Rects ): void {
        this.eraseDamagedRects( damagedRects );
        this.render( aViewee );
        this.emptyDamagedRects( damagedRects );
    }

    render( aViewee: Viewee ): void {
        if ( this.needsRendering( aViewee ) ) {
            let iVieweeClass = getClassName( aViewee ),
                iMethodName  = 'render' + iVieweeClass;

            this[ iMethodName ]( aViewee );

            this.renderChildren( aViewee );
        }
    }

    private eraseDamagedRects( aRects: Rects ): void {
        aRects.forEach( aRect => {
            this.context.clearRect( aRect.x, aRect.y, aRect.w, aRect.h );
        });
    }

    private emptyDamagedRects( aRects: Rects ): void {
        while ( aRects.length > 0 ) {
            aRects.pop();
        }
    }

    private needsRendering( aViewee: Viewee ): boolean {
        if ( aViewee instanceof Visible ) {
            let isVisble = (<Visible>aViewee).isVisible();
            return isVisble;
        } else {
            return true;
        }
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
        let iTransformations: Transformations;

        iTransformations = aViewee.getTransformations();
        this.transform( iTransformations );
    }

    private renderRectangle( aRactangle: Rectangle ): void {
        this.drawRectangle( aRactangle.getRect() );
    }

    private renderTransformer( aTransformer: Transformer ): void {
    }

    private renderRoot( aRoot: Root ): void {
    }

}
