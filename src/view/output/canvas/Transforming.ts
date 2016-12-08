import { Contextual      } from './';
import { Point,
         Rect            } from '../../geometry';
import { Transformations } from '../../output';

/*
A class encapsulating the rather-not-straightforward logic behind how
transformations are applied.

Transformations are applied in the applyTransformations method, after the
current viewee has been rendered, but before its children are rendered.
*/
export
class Transforming extends Contextual {

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

    // For all the following:
    // Zoom has already been applied on the canvas (in transform above),
    // so we only need to apply the post-matrix here.

    protected intersectClipAreaWith( aRect: Rect ): void {
        super.intersectClipAreaWith( this.preTransformRect( aRect ) );
    }

    protected fillRect( aRect: Rect ): void {
        // Zoom has already been applied on the canvas (in transform above),
        // so we only need to apply the post-matrix here.
        let iRect = this.preTransformRect( aRect );
        super.fillRect( iRect );
    }

    protected strokeRect( aRect: Rect ): void {
        // Zoom has already been applied on the canvas (in transform above),
        // so we only need to apply the post-matrix here.
        let iRect = this.preTransformRect( aRect );
        super.strokeRect( iRect );
    }

    protected startPath( aPoint: Point ): void {
        let iPoint = this.preTransformPoint( aPoint );
        super.startPath( iPoint );
    }

    protected lineTo( aPoint: Point ): void {
        let iPoint = this.preTransformPoint( aPoint );
        super.lineTo( iPoint );
    }

    protected quadTo( aControl: Point, aPoint: Point ): void {
        let iControl = this.preTransformPoint( aControl ),
            iPoint   = this.preTransformPoint( aPoint );
        super.quadTo( iControl, iPoint );
    }

    protected cubicTo( aControl1: Point, aControl2: Point, aPoint: Point ): void {
        let iControl1 = this.preTransformPoint( aControl1 ),
            iControl2 = this.preTransformPoint( aControl2 ),
            iPoint    = this.preTransformPoint( aPoint );

        super.cubicTo( iControl1, iControl2, iPoint );
    }

}
