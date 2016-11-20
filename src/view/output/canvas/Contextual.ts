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
        iExpandedRect.expand( cAntialiasingExtraMargins );

        this.context.clearRect( iExpandedRect.x, iExpandedRect.y, iExpandedRect.w, iExpandedRect.h );
    };

    translate( aTranslation: Translation ): void {
        super.translate( aTranslation );
        this.context.translate( aTranslation.x, aTranslation.y );
    }

    scale( aScale: Scale ): void {
        super.scale( aScale );
        this.context.scale( aScale.x, aScale.y );
    }

    intersectClipAreaWith( aRect: Rect ): void {
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

    pushState(): void {
        super.pushState();
        this.context.save();
    }

    protected restoreState( aState: any ) {
        super.restoreState( aState );
        this.context.restore();
    }

}
