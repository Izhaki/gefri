import { Clipped      } from './../';
import { Point,
         Rect,
         Translation,
         Scale        } from '../../geometry';
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

    protected fillRect( aRect: Rect ): void {
        this.context.fillRect( aRect.x, aRect.y, aRect.w, aRect.h );
    }

    protected strokeRect( aRect: Rect ): void {
        this.context.strokeRect( aRect.x, aRect.y, aRect.w, aRect.h );
    }

    protected startPath( aPoint: Point ): void {
        this.context.beginPath();
        this.context.moveTo( aPoint.x, aPoint.y )
    }

    protected endPath(): void {
        this.context.stroke();
    }

    protected lineTo( aPoint: Point ): void {
        this.context.lineTo( aPoint.x, aPoint.y )
    }

    protected quadTo( aControl: Point, aPoint: Point ): void {
        this.context.quadraticCurveTo( aControl.x, aControl.y, aPoint.x, aPoint.y )
    }

    protected cubicTo( aControl1: Point, aControl2: Point, aPoint: Point ): void {
        this.context.bezierCurveTo( aControl1.x, aControl1.y, aControl2.x, aControl2.y, aPoint.x, aPoint.y )
    }

    protected erase( aRect: Rect ): void {
        let iExpandedRect = aRect.clone();
        iExpandedRect.expand( this.antialiasingExtraMargins );

        this.context.clearRect( iExpandedRect.x, iExpandedRect.y, iExpandedRect.w, iExpandedRect.h );
    };

    protected intersectClipAreaWith( aRect: Rect ): void {
        super.intersectClipAreaWith( aRect );

        this.context.beginPath();

        this.context.rect(
            aRect.x,
            aRect.y,
            aRect.w,
            aRect.h
        );

        this.context.clip();
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
