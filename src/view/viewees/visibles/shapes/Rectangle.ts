import { Shape } from './Shape';
import { Rect  } from './../../../geometry';

export
class Rectangle extends Shape {
    private rect: Rect;

    constructor( x: number, y: number, w: number, h: number ) {
        super();
        this.rect = new Rect( arguments[ 0 ], arguments[ 1 ], arguments[ 2 ], arguments[ 3 ] );
    }

    getBoundingRect(): Rect {
        return this.rect;
    }

    getRect(): Rect {
        return this.rect;
    }

}
