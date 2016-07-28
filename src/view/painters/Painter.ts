import { Rect } from './../geometry/Rect';

export
class Painter {
    private context: CanvasRenderingContext2D;

    constructor( aContext: CanvasRenderingContext2D ) {
        this.context = aContext;
    }

    drawRectangle( aRect: Rect ) {
        var context = this.context;
        context.beginPath();
        context.rect( aRect.x, aRect.y, aRect.w, aRect.h );
        context.fill();
        context.stroke();
    }

    translate( x, y ) {
        this.context.translate( x, y );
    }

    pushState() {
        this.context.save()
    }

    popState() {
        this.context.restore()
    }


}
