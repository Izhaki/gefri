import { Shape } from './Shape';
import { Rect  } from './../../../geometry';

export
class Rectangle extends Shape {
    private rect: Rect;

    public fillColour: string = '#1ABC9C'; // TODO: Temp

    constructor( x: number, y: number, w: number, h: number ) {
        super();
        this.rect = new Rect( arguments[ 0 ], arguments[ 1 ], arguments[ 2 ], arguments[ 3 ] );
    }

    getRect(): Rect {
        return this.rect;
    }

}
