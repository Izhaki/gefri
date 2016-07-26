import { Viewee } from './viewees/Viewee';
import { Painter } from './painters/Painter';

export
class Control {
    private container: HTMLElement;
    private canvas:    HTMLCanvasElement;
    private context:   CanvasRenderingContext2D;
    private painter:   Painter;

    constructor( aContainer: HTMLElement ) {
        this.container = aContainer;
        this.canvas    = this.createCanvas( aContainer );
        this.context   = this.getContext( this.canvas );
        this.painter   = new Painter( this.context );
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
        aViewee.paint( this.painter );
    }
}
