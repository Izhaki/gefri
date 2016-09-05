import { Viewee }  from './../Viewee';
import { Painter } from './../../painters/Painter';
import { Rect }    from './../../geometry/Rect';

export
abstract class Shape extends Viewee {

    paint( aPainter: Painter ): void {
        if ( this.isWithinClipArea( aPainter ) ) {
            this.paintSelf( aPainter )
            this.paintChildren( aPainter );
        }
    }

    abstract paintSelf( aPainter: Painter ): void;

    abstract getRectBounds(): Rect;

    beforeChildrenPainting( aPainter: Painter ): void {
        aPainter.intersectClipAreaWith( this.getRectBounds() );
        super.beforeChildrenPainting( aPainter );
    }

    applyTransformations( aPainter: Painter ): void {
        super.applyTransformations( aPainter );
        var iBounds = this.getRectBounds();
        aPainter.translate( iBounds.getLeft(), iBounds.getTop() );
    }

    isWithinClipArea( aPainter: Painter ): boolean {
        return aPainter.isRectWithinClipArea( this.getRectBounds() );
    }

}
