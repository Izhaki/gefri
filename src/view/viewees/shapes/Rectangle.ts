import { Shape }   from './Shape';
import { Rect }    from './../../geometry/Rect';
import { Painter } from './../../output/Painter';

export
class Rectangle extends Shape {
    private rect: Rect;

    constructor( aRect: Rect ) {
        super();
        this.rect = aRect;
    }

    protected paintSelf( aPainter: Painter ): void {
        aPainter.drawRectangle( this.rect );
    }

    protected getBoundingRect(): Rect {
        return this.rect;
    }

}
