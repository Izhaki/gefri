import { Shape }   from './Shape';
import { Rect }    from './../../geometry/Rect';
import { Painter } from './../../painters/Painter';

export
class Rectangle extends Shape {
    rect: Rect;

    constructor( aRect: Rect ) {
        super();
        this.rect = aRect;
    }

    paintSelf( aPainter: Painter ): void {
        aPainter.drawRectangle( this.rect );
    }

    getRectBounds(): Rect {
        return this.rect;
    }

}
