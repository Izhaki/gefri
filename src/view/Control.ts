import { Viewee } from './viewees/Viewee';

export
class Control {
    private container: HTMLElement;
    public  canvas:    HTMLCanvasElement;

    constructor( aContainer: HTMLElement ) {
        this.container = aContainer;
        this.canvas = this.createCanvas( aContainer );
    }

    private createCanvas( aContainer: HTMLElement ) : HTMLCanvasElement {
        var iCanvas : HTMLCanvasElement = <HTMLCanvasElement>document.createElement( 'CANVAS' );
        iCanvas.setAttribute( 'width',  aContainer.offsetWidth.toString()  );
        iCanvas.setAttribute( 'height', aContainer.offsetHeight.toString() );
        aContainer.appendChild( iCanvas );
        return iCanvas;
    }

    public setContents( aViewee: Viewee ) {
        var iContext = this.canvas.getContext( '2d' );

        // Prevents antialiasing effect.
        // iContext.translate( 0.5, 0.5 );

        iContext.fillStyle = '#1ABC9C';
        iContext.lineWidth = 1;
        iContext.strokeStyle = 'black';

        aViewee.paint( iContext )
    }
}
