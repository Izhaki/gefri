import { Clipped      } from './../';
import { Rect,
         Translation,
         Scale        } from '../../geometry';

export
const cAntialiasingExtraMargins = 1

export
class Contextual extends Clipped {
    protected context:  CanvasRenderingContext2D;

    constructor( aContext: CanvasRenderingContext2D ) {
        super();
        this.context = aContext;
    }

    protected drawRectangle( aRect: Rect ): void {
        let context = this.context;
        context.beginPath();
        context.rect( aRect.x, aRect.y, aRect.w, aRect.h );
        context.fill();
        context.stroke();
        context.closePath();
    }

    protected erase( aRect: Rect ): void {
        let iExpandedRect = aRect.clone();
        iExpandedRect.expand( cAntialiasingExtraMargins );

        this.context.clearRect( iExpandedRect.x, iExpandedRect.y, iExpandedRect.w, iExpandedRect.h );
    };

    protected intersectClipAreaWith( aRect: Rect ): void {
        super.intersectClipAreaWith( aRect );

        var iRect = aRect.clone();
        iRect.expand( cAntialiasingExtraMargins );

        this.context.beginPath();

        this.context.rect(
            iRect.x,
            iRect.y,
            iRect.w,
            iRect.h
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
