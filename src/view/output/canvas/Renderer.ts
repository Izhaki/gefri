import { Contextual    } from './';
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

import { getBoundingRect } from '../../viewees/multimethods';

export
class Renderer extends Contextual {

    refresh( aViewee: Viewee, damagedRects: Rects ): void {
        this.eraseDamagedRects( damagedRects );
        this.render( aViewee );
        this.emptyDamagedRects( damagedRects );
    }

    render( aViewee: Viewee ): void {
        if ( this.needsRendering( aViewee ) ) {
            this.fill( aViewee );
            this.renderChildren( aViewee );
            this.stroke( aViewee );
        }
    }

    private routeToMethod( aPrefix: string, aObject: any ): void {
        let iObjectClass = getClassName( aObject ),
            iMethodName  = aPrefix + iObjectClass;

        this[ iMethodName ]( aObject );
    }

    private fill( aObject: any ): void {
        this.routeToMethod( 'fill', aObject );
    }

    private stroke( aObject: any ): void {
        this.routeToMethod( 'stroke', aObject );
    }

    private eraseDamagedRects( aRects: Rects ): void {
        aRects.forEach( aRect => {
            this.erase( aRect );
        });
    }

    private emptyDamagedRects( aRects: Rects ): void {
        emptyArray( aRects );
    }

    private isWithinClipArea( aViewee: Viewee ): boolean {
        let iBounds = getBoundingRect( aViewee );
        return this.isRectWithinClipArea( iBounds );
    }

    private needsRendering( aViewee: Viewee ): boolean {
        if ( aViewee instanceof Visible ) {
            let isVisble = (<Visible>aViewee).isVisible();
            let isWithinClipArea = this.isWithinClipArea( aViewee );
            return isVisble && isWithinClipArea;
        } else {
            return true;
        }
    }

    private renderChildren( aViewee: Viewee ): void {
        if ( aViewee.isChildless() ) return;

        this.pushState();

        if ( aViewee.isClipping ) {
            this.intersectClipAreaWith( getBoundingRect( aViewee ) );
        }

        this.applyTransformations( aViewee );

        aViewee.forEachChild( ( aChild ) => {
            this.render( aChild );
        });

        this.popState();
    }

    private fillRectangle( aRactangle: Rectangle ): void {
        this.context.fillStyle = aRactangle.fillColour;
        this.fillRect( aRactangle.getRect() );
    }

    private strokeRectangle( aRactangle: Rectangle ): void {
        this.strokeRect( aRactangle.getRect() );
    }

    private fillPath( aPath: Path ): void {}

    private strokePath( aPath: Path ): void {
        this.startPath( aPath.getStart() );

        aPath.forEachSegment( ( aSegment: PathSegment ) => {
            this.stroke( aSegment );
        });

        this.endPath();
    }

    private strokeLineSegment( aSegment: LineSegment ) {
        this.lineTo( aSegment.getEnd() );
    }

    private strokeQuadSegment( aSegment: QuadSegment ) {
        this.quadTo( aSegment.getControl(), aSegment.getEnd() );
    }

    private strokeCubicSegment( aSegment: CubicSegment ) {
        this.cubicTo( aSegment.getControl1(), aSegment.getControl2(), aSegment.getEnd() );
    }

    private fillTransformer  ( aTransformer: Transformer ): void {}
    private strokeTransformer( aTransformer: Transformer ): void {}

    private fillRoot  ( aRoot: Root ): void {}
    private strokeRoot( aRoot: Root ): void {}

}
