export
class Control {
    private   container: HTMLElement;
    protected layer:     Element;

    constructor( aContainer: HTMLElement ) {
        this.container = aContainer;
        this.createCanvas( aContainer );
    }

    private createCanvas( aContainer: HTMLElement ) {
        var iCanvas : HTMLCanvasElement = <HTMLCanvasElement>document.createElement( 'CANVAS' );
        iCanvas.setAttribute( 'width',  aContainer.offsetWidth.toString()  );
        iCanvas.setAttribute( 'height', aContainer.offsetHeight.toString() );
        aContainer.appendChild( iCanvas );
    }
}