import { Shape   } from './';
import { Rect    } from './../../geometry';
import { Painter } from './../../output';

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
