import { Transforming    } from './';
import { Rects           } from '../../geometry';
import { getClassName,
         emptyArray      } from '../../../core/Utils';
import { Viewee          } from '../../viewees/Viewee';
import { Visible         } from '../../viewees/visibles/Visible';
import { Rectangle       } from '../../viewees/visibles/shapes';
import { Path            } from '../../viewees/visibles/path';

import { Transformer,
         Root            } from '../../viewees/invisibles';

export
class Renderer extends Transforming {

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
            this.erase( aRect );
        });
    }

    private emptyDamagedRects( aRects: Rects ): void {
        emptyArray( aRects );
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

    private renderRectangle( aRactangle: Rectangle ): void {
        this.drawRectangle( aRactangle.getRect() );
    }

    private renderPath( aPath: Path ): void {
        this.moveTo( aPath.getStart() );

        aPath.forEachSegment( ( aSegment ) => {
            this.lineTo( aSegment.getEnd() );
        });

        this.strokePath();
    }

    private renderTransformer( aTransformer: Transformer ): void {
    }

    private renderRoot( aRoot: Root ): void {
    }

}
