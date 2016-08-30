import { Viewee }  from './viewees/Viewee';
import { ContextPainter } from './painters/ContextPainter';
import { Rect }    from './geometry/Rect';

export
class Control {
    private container: HTMLElement;
    private canvas:    HTMLCanvasElement;
    private context:   CanvasRenderingContext2D;
    private painter:   ContextPainter;
    private bounds:    Rect;

    constructor( aContainer: HTMLElement ) {
        this.container = aContainer;
        this.bounds    = new Rect( 0, 0, aContainer.offsetWidth, aContainer.offsetHeight );
        this.canvas    = this.createCanvas( aContainer );
        this.context   = this.getContext( this.canvas );
        this.painter   = new ContextPainter( this.context );
    }

    private createCanvas( aContainer: HTMLElement ) : HTMLCanvasElement {
        var iCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.createElement( 'CANVAS' );
        iCanvas.setAttribute( 'width',  aContainer.offsetWidth.toString()  );
        iCanvas.setAttribute( 'height', aContainer.offsetHeight.toString() );
        aContainer.appendChild( iCanvas );
        return iCanvas;
    }

    private getContext( aCanvas: HTMLCanvasElement ): CanvasRenderingContext2D {
        var context: CanvasRenderingContext2D = this.canvas.getContext( '2d' );
        // context.translate( 0.5, 0.5 ); // Prevents antialiasing effect.
        context.fillStyle = '#1ABC9C';
        context.lineWidth = 1;
        context.strokeStyle = 'black';
        return context;
    }

    public setContents( aViewee: Viewee ) {
        this.painter.pushState();
        this.painter.intersectClipAreaWith( this.bounds )
        aViewee.paint( this.painter );
        this.painter.popState();
    }
}
