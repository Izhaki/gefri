import { Shape       } from './Shape';
import { Rect,
         Translation } from './../../../geometry';

export
class Rectangle extends Shape {
    private rect: Rect;

    public fillColour: string = '#1ABC9C'; // TODO: Temp

    constructor( x: number, y: number, w: number, h: number ) {
        super();
        this.rect = new Rect( x, y, w, h );
    }

    getRect(): Rect {
        return this.rect;
    }

    translate( aDelta: Translation ): void {
        this.notifyUpdate();
        this.rect.translate( aDelta );
        this.notifyUpdate();
    };

}
