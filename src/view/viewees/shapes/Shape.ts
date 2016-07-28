import { Viewee }  from './../Viewee';
import { Painter } from './../../painters/Painter';
import { Rect }    from './../../geometry/Rect';

export
abstract class Shape extends Viewee {

    paint( aPainter: Painter ): void {
        this.paintSelf( aPainter )
        this.paintChildren( aPainter );
    }

    abstract paintSelf( aPainter: Painter ): void;

    abstract getRectBounds(): Rect;

    applyTransformations( aPainter: Painter ): void {
        var iBounds = this.getRectBounds();
        aPainter.translate( iBounds.getLeft(), iBounds.getTop() );
    }

}
