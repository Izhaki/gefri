import { Viewee } from './../Viewee';
import { Rect } from './../../geometry/Rect';

export
class Rectangle extends Viewee {
    rect: Rect;

    constructor( aRect: Rect ) {
        super();
        this.rect = aRect;
    }

    paint( aContext ) {
        var r = this.rect;

        aContext.beginPath();
        aContext.rect( r.x, r.y, r.w, r.h );
        aContext.fill();
        aContext.stroke();
    }

}
