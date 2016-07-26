import { Viewee } from './../Viewee';
import { Rect } from './../../geometry/Rect';
import { Painter } from './../../painters/Painter';

export
class Rectangle extends Viewee {
    rect: Rect;

    constructor( aRect: Rect ) {
        super();
        this.rect = aRect;
    }

    paint( aPainter: Painter ) {
        aPainter.drawRectangle( this.rect );
    }

}
