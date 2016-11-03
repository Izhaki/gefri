import { Shape } from './Shape';
import { Rect  } from './../../geometry';

export
class Rectangle extends Shape {
    private rect: Rect;

    constructor( aRect: Rect ) {
        super();
        this.rect = aRect;
    }

    getBoundingRect(): Rect {
        return this.rect;
    }

    getRect(): Rect {
        return this.rect;
    }

}
