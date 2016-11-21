import { Viewee       } from '../../viewees/Viewee';
import { Renderer,
         Updater      } from './';
import { Rects        } from '../../geometry';
import { ElementLayer } from '../'
import { onNextFrame  } from '../../onNextFrame'

export
class Layer extends ElementLayer {
    private canvas:          HTMLCanvasElement;
    private context:         CanvasRenderingContext2D;
    private renderer:        Renderer;
    private updater:         Updater;
    private damagedRects:    Rects = [];

    constructor( aContainer: HTMLElement ) {
        super( aContainer );
        this.canvas   = this.createCanvas( aContainer );
        this.context  = this.getContext( this.canvas );
        this.renderer = new Renderer( this.context );
        this.updater  = new Updater( this.updatesStream, this.damagedRects );
    }

    setContents( aViewee: Viewee ): void {
        super.setContents( aViewee );

        this.updatesStream.subscribe( () => this.queueRefresh() )

        this.queueRefresh();
    }

    // As a callback, refresh is an instance method so we always get the same reference for it per instance
    // (required for correct operation of onNextFrame).
    private refresh = () => {
        this.renderer.refresh( this.root, this.damagedRects );
    }

    queueRefresh(): void {
        onNextFrame( this.refresh );
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
}
