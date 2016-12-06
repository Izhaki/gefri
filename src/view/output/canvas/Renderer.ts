import { Transforming  } from './';
import { Point,
         Rects         } from '../../geometry';
import { getClassName,
         emptyArray    } from '../../../core/Utils';
import { Viewee        } from '../../viewees/Viewee';
import { Visible       } from '../../viewees/visibles/Visible';
import { Rectangle     } from '../../viewees/visibles/shapes';
import { Path,
         PathSegment,
         LineSegment,
         QuadSegment,
         CubicSegment  } from '../../viewees/visibles/path';

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
            this.routeToRenderMethod( aViewee );
            this.renderChildren( aViewee );
        }
    }

    private routeToRenderMethod( aObject: any ) {
        let iObjectClass = getClassName( aObject ),
            iMethodName  = 'render' + iObjectClass;

        this[ iMethodName ]( aObject );
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
        // aPath.forEachSegment( ( aSegment: PathSegment, aStart: Point ) => {
        //     let iBox = aSegment.getBoundingRect( aStart );
        //     this.drawRectangle( iBox );
        // });

        this.moveTo( aPath.getStart() );

        aPath.forEachSegment( ( aSegment: PathSegment ) => {
            this.routeToRenderMethod( aSegment );
        });

        this.strokePath();
    }

    private renderLineSegment( aSegment: LineSegment ) {
        this.lineTo( aSegment.getEnd() );
    }

    private renderQuadSegment( aSegment: QuadSegment ) {
        this.quadTo( aSegment.getControl(), aSegment.getEnd() );
    }

    private renderCubicSegment( aSegment: CubicSegment ) {
        this.cubicTo( aSegment.getControl1(), aSegment.getControl2(), aSegment.getEnd() );
    }

    private renderTransformer( aTransformer: Transformer ): void {
    }

    private renderRoot( aRoot: Root ): void {
    }

}
