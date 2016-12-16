import { Clipped      } from './../';
import { Point,
         Rect,
         Translation,
         Scale        } from '../../geometry';
import { Transformations } from '../../output';
import { inject       } from '../../../core/di';

export
class Contextual extends Clipped {
    private   antialiasingExtraMargins: number;
    protected context:                  CanvasRenderingContext2D;

    constructor( aContext: CanvasRenderingContext2D ) {
        super();
        this.context = aContext;
        this.antialiasingExtraMargins = inject( 'antialiasingExtraMargins' );
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

    protected fillRect( aRelativeRect: Rect ): void {
        let iScaledRect = aRelativeRect.apply( this.scaleMatrix );
        this.context.fillRect( iScaledRect.x, iScaledRect.y, iScaledRect.w, iScaledRect.h );
    }

    protected strokeRect( aRelativeRect: Rect ): void {
        let iScaledRect = aRelativeRect.apply( this.scaleMatrix );
        this.context.strokeRect( iScaledRect.x, iScaledRect.y, iScaledRect.w, iScaledRect.h );
    }

    protected startPath( aRelativePoint: Point ): void {
        let iScaledPoint = aRelativePoint.apply( this.scaleMatrix );
        this.context.beginPath();
        this.context.moveTo( iScaledPoint.x, iScaledPoint.y )
    }

    protected endPath(): void {
        this.context.stroke();
    }

    protected lineTo( aRelativePoint: Point ): void {
        let iScaledPoint = aRelativePoint.apply( this.scaleMatrix );
        this.context.lineTo( iScaledPoint.x, iScaledPoint.y )
    }

    protected quadTo( aRelativeControl: Point, aRelativePoint: Point ): void {
        let iControl = aRelativeControl.apply( this.scaleMatrix ),
            iPoint   = aRelativePoint.apply( this.scaleMatrix );

        this.context.quadraticCurveTo( iControl.x, iControl.y, iPoint.x, iPoint.y )
    }

    protected cubicTo( aRelativeControl1: Point, aRelativeControl2: Point, aRelativePoint: Point ): void {
        let iControl1 = aRelativeControl1.apply( this.scaleMatrix ),
            iControl2 = aRelativeControl2.apply( this.scaleMatrix ),
            iPoint   = aRelativePoint.apply( this.scaleMatrix );

        this.context.bezierCurveTo( iControl1.x, iControl1.y, iControl2.x, iControl2.y, iPoint.x, iPoint.y )
    }

    protected erase( aAbsoluteRect: Rect ): void {
        let iExpandedRect = aAbsoluteRect.clone();
        iExpandedRect.expand( this.antialiasingExtraMargins );

        this.context.clearRect( iExpandedRect.x, iExpandedRect.y, iExpandedRect.w, iExpandedRect.h );
    };

    protected intersectClipAreaWith( aRelativeRect: Rect ): void {
        let iScaledRect = aRelativeRect.apply( this.scaleMatrix );

        this.context.beginPath();
        this.context.rect( iScaledRect.x, iScaledRect.y, iScaledRect.w, iScaledRect.h );
        this.context.clip();

        // Clip area is in absolute coordinates
        // So we convert the rect to absolute ones.
        let iAbsoluteRect = iScaledRect.apply( this.zoomMatrix );
        super.intersectClipAreaWith( iAbsoluteRect );
    }

    isRectWithinClipArea( aRelativeRect: Rect ): boolean {
        // Clip area is in absolute coordinates
        // So we convert the rect to absolute ones.
        let iAbsoluteRect = this.toAbsoluteRect( aRelativeRect );
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
