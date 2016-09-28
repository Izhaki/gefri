import { Painter } from './';
import { Rect    } from '../geometry';

export
const ANTIALIASING_EXTRA_MARGINS = 1

export
class ContextPainter extends Painter {
    protected context:  CanvasRenderingContext2D;

    constructor( aContext: CanvasRenderingContext2D ) {
        super();
        this.context = aContext;
    }

    drawRectangle( aRect: Rect ): void {
        var context = this.context;
        context.beginPath();
        context.rect( aRect.x, aRect.y, aRect.w, aRect.h );
        context.fill();
        context.stroke();
        context.closePath();
    }

    erase( aRect: Rect ): void {
        let iExpandedRect = aRect.clone();
        iExpandedRect.expand( ANTIALIASING_EXTRA_MARGINS );

        this.context.clearRect( iExpandedRect.x, iExpandedRect.y, iExpandedRect.w, iExpandedRect.h );
    };

    translate( x, y ): void {
        super.translate( x, y );
        this.context.translate( x, y );
    }

    scale( x, y ): void {
        super.scale( x, y );
        this.context.scale( x, y );
    }

    intersectClipAreaWith( aRect: Rect ): void {
        super.intersectClipAreaWith( aRect );

        var iRect = aRect.clone();
        iRect.expand( ANTIALIASING_EXTRA_MARGINS );

        this.context.beginPath();

        this.context.rect(
            iRect.x,
            iRect.y,
            iRect.w,
            iRect.h
        );

        this.context.clip();
    }

    pushState(): void {
        super.pushState();
        this.context.save();
    }

    protected restoreState( aState: any ) {
        super.restoreState( aState );
        this.context.restore();
    }

}
