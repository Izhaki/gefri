import { Clipped      } from './../';
import { Point,
         Rect,
         Translation,
         Scale        } from '../../geometry';
import { Transformations } from '../../output';
import { inject       } from '../../../di';

export
class Contextual extends Clipped {
    private   antialiasingExtraMargins: number;
    protected context:                  CanvasRenderingContext2D;

    constructor( aContext: CanvasRenderingContext2D ) {
        super();
        this.context = aContext;
        this.antialiasingExtraMargins = inject( 'antialiasingExtraMargins' );
    }

    // Called via applyTransformations. To achieve zoom, we simply scale the
    // canvas context. We practically apply the postMatrix here, but on the
    // canvas rather than the shape itself.
    // Note that this is applied first (on the canvas), only then the preMatrix
    // will be applied on the shape (via the drawX methods below). But since the
    // pre-matrix is applied before rendering to the canvas, the actual
    // transformations follow pre then post matrix.
    protected transform( aTransformations: Transformations ): void {
        super.transform( aTransformations );
        this.context.scale( aTransformations.zoom.x, aTransformations.zoom.y );
    }

    protected fillRect( aRect: Rect ): void {
        let iRect = this.preTransformRect( aRect );
        this.context.fillRect( iRect.x, iRect.y, iRect.w, iRect.h );
    }

    protected strokeRect( aRect: Rect ): void {
        let iRect = this.preTransformRect( aRect );
        this.context.strokeRect( iRect.x, iRect.y, iRect.w, iRect.h );
    }

    protected startPath( aPoint: Point ): void {
        let iPoint = this.preTransformPoint( aPoint );
        this.context.beginPath();
        this.context.moveTo( iPoint.x, iPoint.y )
    }

    protected endPath(): void {
        this.context.stroke();
    }

    protected lineTo( aPoint: Point ): void {
        let iPoint = this.preTransformPoint( aPoint );
        this.context.lineTo( iPoint.x, iPoint.y )
    }

    protected quadTo( aControl: Point, aPoint: Point ): void {
        let iControl = this.preTransformPoint( aControl ),
            iPoint   = this.preTransformPoint( aPoint );

        this.context.quadraticCurveTo( iControl.x, iControl.y, iPoint.x, iPoint.y )
    }

    protected cubicTo( aControl1: Point, aControl2: Point, aPoint: Point ): void {
        let iControl1 = this.preTransformPoint( aControl1 ),
            iControl2 = this.preTransformPoint( aControl2 ),
            iPoint    = this.preTransformPoint( aPoint );

        this.context.bezierCurveTo( iControl1.x, iControl1.y, iControl2.x, iControl2.y, iPoint.x, iPoint.y )
    }

    protected erase( aAbsoluteRect: Rect ): void {
        let iExpandedRect = aAbsoluteRect.clone();
        iExpandedRect.expand( this.antialiasingExtraMargins );

        this.context.clearRect( iExpandedRect.x, iExpandedRect.y, iExpandedRect.w, iExpandedRect.h );
    };

    protected intersectClipAreaWith( aRect: Rect ): void {
        let iRect = this.preTransformRect( aRect );

        this.context.beginPath();
        this.context.rect(
            iRect.x,
            iRect.y,
            iRect.w,
            iRect.h
        );
        this.context.clip();

        // Clip area is in absolute coordinates
        // So we convert the rect to absolute ones.
        let iAbsoluteRect = this.postTransformRect( iRect );
        super.intersectClipAreaWith( iAbsoluteRect );
    }

    isRectWithinClipArea( aRect: Rect ): boolean {
        // Clip area is in absolute coordinates
        // So we convert the rect to absolute ones.
        let iAbsoluteRect = this.toAbsoluteRect( aRect );
        return super.isRectWithinClipArea( iAbsoluteRect );
    }

    protected pushState(): void {
        super.pushState();
        this.context.save();
    }

    protected restoreState( aState: any ) {
        super.restoreState( aState );
        this.context.restore();
    }

}
