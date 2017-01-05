import { Viewee       } from '../../../viewees';
import { Clipped      } from './../../';
import { Point,
         Rect,
         Translation,
         Scale        } from '../../../geometry';

import { Transformations } from '../../../output';

import { getBoundingRect } from '../../../viewees/multimethods';

export
class Contextual extends Clipped {
    protected context:                  CanvasRenderingContext2D;

    constructor( aContext: CanvasRenderingContext2D ) {
        super();
        this.context = aContext;
    }

    // Called via cumulateTransformations. To achieve zoom, we simply scale the
    // canvas context. We practically apply the zoomMatrix here, but on the
    // canvas rather than the shape itself.
    // Note that all the methods below that output to the context first apply
    // the scaleMatrix; but they do not apply the
    // zoomMatrix since the zoom was already applied
    // in this method.
    zoom( aZoom: Scale ): void {
        super.zoom( aZoom );
        this.context.scale( aZoom.x, aZoom.y );
    }

    fillRect( aRelativeRect: Rect ): void {
        let iScaledRect = aRelativeRect.applyMatrix( this.scaleMatrix );
        this.context.fillRect( iScaledRect.x, iScaledRect.y, iScaledRect.w, iScaledRect.h );
    }

    strokeRect( aRelativeRect: Rect ): void {
        let iScaledRect = aRelativeRect.applyMatrix( this.scaleMatrix );
        this.context.strokeRect( iScaledRect.x, iScaledRect.y, iScaledRect.w, iScaledRect.h );
    }

    startPath( aRelativePoint: Point ): void {
        let iScaledPoint = aRelativePoint.applyMatrix( this.scaleMatrix );
        this.context.beginPath();
        this.context.moveTo( iScaledPoint.x, iScaledPoint.y )
    }

    endPath(): void {
        this.context.stroke();
    }

    lineTo( aRelativePoint: Point ): void {
        let iScaledPoint = aRelativePoint.applyMatrix( this.scaleMatrix );
        this.context.lineTo( iScaledPoint.x, iScaledPoint.y )
    }

    quadTo( aRelativeControl: Point, aRelativePoint: Point ): void {
        let iControl = aRelativeControl.applyMatrix( this.scaleMatrix ),
            iPoint   = aRelativePoint.applyMatrix( this.scaleMatrix );

        this.context.quadraticCurveTo( iControl.x, iControl.y, iPoint.x, iPoint.y )
    }

    cubicTo( aRelativeControl1: Point, aRelativeControl2: Point, aRelativePoint: Point ): void {
        let iControl1 = aRelativeControl1.applyMatrix( this.scaleMatrix ),
            iControl2 = aRelativeControl2.applyMatrix( this.scaleMatrix ),
            iPoint   = aRelativePoint.applyMatrix( this.scaleMatrix );

        this.context.bezierCurveTo( iControl1.x, iControl1.y, iControl2.x, iControl2.y, iPoint.x, iPoint.y )
    }

    setFillStyle( aFillStyle ) {
        this.context.fillStyle = aFillStyle;
    }

    protected erase( aAbsoluteRect: Rect ): void {
        this.context.clearRect( aAbsoluteRect.x, aAbsoluteRect.y, aAbsoluteRect.w, aAbsoluteRect.h );
    };

    // Note: We only clip the scaled rect as the applied zoom will be applied
    // directly to the canvas.
    protected intersectClipAreaWith( aViewee: Viewee ): void {
        let iRelativeRect = getBoundingRect( aViewee );
        let iScaledRect   = iRelativeRect.applyMatrix( this.scaleMatrix );

        this.context.beginPath();
        this.context.rect( iScaledRect.x, iScaledRect.y, iScaledRect.w, iScaledRect.h );
        this.context.clip();

        super.intersectClipAreaWith( aViewee );
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
