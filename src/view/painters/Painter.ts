import { Rect } from './../geometry/Rect';

export
class Painter {
    private context: CanvasRenderingContext2D;

    constructor( aContext: CanvasRenderingContext2D ) {
        this.context = aContext;
    }

    public drawRectangle( aRect: Rect ) {
        var context = this.context;
        context.beginPath();
        context.rect( aRect.x, aRect.y, aRect.w, aRect.h );
        context.fill();
        context.stroke();
    }

}
